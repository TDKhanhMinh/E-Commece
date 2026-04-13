# Tích hợp Goong Map vào React Native (Shipping App)

> Ngày thực hiện: 13/04/2026  
> File chính được chỉnh sửa: `src/features/history/components/RouteMapSection.tsx`

---

## Tổng quan

Thay thế WebView + Leaflet/OpenStreetMap bằng native Mapbox SDK (`@rnmapbox/maps`) render nền bản đồ từ Goong Tiles, đồng thời gọi Goong Directions API để vẽ tuyến đường thực tế lên bản đồ.

---

## Các thư viện sử dụng

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| `@rnmapbox/maps` | ^10.3.0 | Render bản đồ (Mapbox SDK, dùng Goong tiles) |
| `@mapbox/polyline` | ^1.2.1 | Giải mã chuỗi polyline từ Goong Directions API |
| `react-native-geolocation-service` | ^5.3.1 | Lấy GPS hiện tại (dùng cho tính năng mở rộng) |
| `@types/mapbox__polyline` | (devDep) | TypeScript types cho @mapbox/polyline |

> **Lưu ý:** Tất cả các thư viện trên đã được cài đặt trong `package.json`. Chỉ cần cài thêm `@types/mapbox__polyline` vào devDependencies.

```bash
npm i --save-dev @types/mapbox__polyline
```

---

## Các Key cần chuẩn bị

| Key | Dùng để | Nơi khai báo |
|---|---|---|
| `GOONG_MAP_KEY` | Render nền bản đồ Goong Tiles | Trong file component |
| `GOONG_API_KEY` | Gọi Goong Directions API | Trong file component |
| `MAPBOX_DOWNLOADS_TOKEN` (`sk.xxx`) | Cho phép Gradle tải Mapbox SDK | `android/gradle.properties` |

---

## Cấu hình đã thực hiện

### 1. `android/gradle.properties`

Thêm Mapbox Downloads Token để Gradle có quyền tải SDK:

```properties
MAPBOX_DOWNLOADS_TOKEN=sk.eyJ1IjoiZ29vbmciLCJhIjoiY2sxdHN5dHZuMDFlcTNkcWJmN2szZzYzZSJ9.placeholder_replace_with_real_token
```

> **Thay** `placeholder_replace_with_real_token` bằng token thật từ tài khoản Mapbox của bạn.

### 2. `android/app/src/main/AndroidManifest.xml`

Các quyền location đã có sẵn:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### 3. iOS (nếu build iOS)

Tạo file `~/.netrc` trên máy Mac:

```
machine api.mapbox.com
  login mapbox
  password sk.xxx_YOUR_REAL_TOKEN
```

Thêm vào `ios/Shipping/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Ứng dụng cần vị trí để hiển thị bản đồ giao hàng</string>
```

---

## Kiến trúc Component `RouteMapSection.tsx`

### Luồng hoạt động

```
order props (pickupLongitude, pickupLatitude, destinationLongitude, destinationLatitude)
        │
        ▼
useEffect → fetchGoongDirections()
        │
        ├── Gọi: https://rsapi.goong.io/Direction?origin=...&destination=...
        │
        ▼
polyline.decode(overview_polyline.points)
        │   [lat, lng][]  →  [lng, lat][]  (đổi thứ tự cho GeoJSON)
        ▼
routeCoords: [number, number][]
        │
        ▼
Mapbox.ShapeSource (GeoJSON LineString)
        ├── LineLayer "routeOutline" (viền trắng, width=7)
        └── LineLayer "routeFill"   (xanh #2563EB, width=4)

Mapbox.PointAnnotation "pickup"      → marker xanh #10B981
Mapbox.PointAnnotation "destination" → marker đỏ #F43F5E
```

### Fallback khi API thất bại

Nếu Goong Directions API không trả về route (lỗi mạng, key sai...):
- Vẽ đường thẳng nối 2 điểm bằng màu xám `#94A3B8`
- Không crash app, không hiển thị lỗi cho người dùng

---

## Code chính

### Khởi tạo Mapbox với Goong tiles

```typescript
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken(''); // Không cần Mapbox token khi dùng Goong tiles

const GOONG_MAP_KEY = 'YOUR_GOONG_MAP_KEY';
const GOONG_STYLE_URL = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_KEY}`;
```

### Hàm gọi Goong Directions API

```typescript
import polyline from '@mapbox/polyline';

async function fetchGoongDirections(
  originLng: number, originLat: number,
  destLng: number, destLat: number,
): Promise<[number, number][]> {
  const url =
    `https://rsapi.goong.io/Direction` +
    `?origin=${originLng},${originLat}` +
    `&destination=${destLng},${destLat}` +
    `&vehicle=car` +
    `&api_key=${GOONG_API_KEY}`;

  const response = await fetch(url);
  const json = await response.json();

  if (json.routes?.length > 0) {
    const encoded = json.routes[0].overview_polyline.points;
    const decoded = polyline.decode(encoded); // [[lat, lng], ...]
    return decoded.map(p => [p[1], p[0]]);    // → [lng, lat]
  }
  return [];
}
```

### Render bản đồ + route + markers

```tsx
<Mapbox.MapView styleURL={GOONG_STYLE_URL} style={styles.map} logoEnabled={false}>
  <Mapbox.Camera zoomLevel={12} centerCoordinate={[centerLng, centerLat]} />

  {/* Route */}
  {routeGeoJSON && (
    <Mapbox.ShapeSource id="routeSource" shape={routeGeoJSON}>
      <Mapbox.LineLayer id="routeOutline"
        style={{ lineColor: '#FFFFFF', lineWidth: 7, lineCap: 'round', lineJoin: 'round' }}
        layerIndex={10}
      />
      <Mapbox.LineLayer id="routeFill"
        style={{ lineColor: '#2563EB', lineWidth: 4, lineCap: 'round', lineJoin: 'round' }}
        layerIndex={11}
      />
    </Mapbox.ShapeSource>
  )}

  {/* Markers */}
  <Mapbox.PointAnnotation id="pickup" coordinate={[pickupLng, pickupLat]}>
    <View style={[styles.markerOuter, styles.markerPickup]} />
  </Mapbox.PointAnnotation>

  <Mapbox.PointAnnotation id="destination" coordinate={[destLng, destLat]}>
    <View style={[styles.markerOuter, styles.markerDest]} />
  </Mapbox.PointAnnotation>
</Mapbox.MapView>
```

---

## So sánh trước và sau

| Tiêu chí | Trước (WebView + Leaflet) | Sau (Goong Map native) |
|---|---|---|
| Renderer | WebView (JS bridge) | Native Mapbox SDK |
| Nguồn bản đồ | OpenStreetMap | Goong Tiles (map Việt Nam chuẩn hơn) |
| Tuyến đường | Đường thẳng giả lập | Đường thực tế qua API Directions |
| Tương tác | Hạn chế (WebView) | Mượt mà, native gesture |
| Performance | Thấp (WebView overhead) | Cao (render GPU native) |
| TypeScript | Không cần | Type-safe hoàn toàn |

---

## Các bước cần làm thêm (TODO)

- [ ] Thay `YOUR_GOONG_MAP_KEY` và `YOUR_GOONG_API_KEY` bằng key thật trong file component (hoặc dùng file `.env`)
- [ ] Thay `MAPBOX_DOWNLOADS_TOKEN` trong `gradle.properties` bằng token thật từ [account.mapbox.com](https://account.mapbox.com)
- [ ] Thêm field `destinationLongitude` / `destinationLatitude` vào type `Order` nếu backend cung cấp
- [ ] (Tuỳ chọn) Chuyển key sang file `.env` + `react-native-config` để bảo mật hơn
- [ ] (Tuỳ chọn) Tích hợp `react-native-geolocation-service` để hiển thị vị trí tài xế realtime trên bản đồ

---

## Tham khảo

- [Goong Map Documentation](https://docs.goong.io)
- [Goong Directions API](https://docs.goong.io/rest/directions)
- [@rnmapbox/maps GitHub](https://github.com/rnmapbox/maps)
- [@mapbox/polyline npm](https://www.npmjs.com/package/@mapbox/polyline)

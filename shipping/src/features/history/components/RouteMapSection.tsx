import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Mapbox from '@rnmapbox/maps';
import polyline from '@mapbox/polyline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ──────────────────────────────────────────────────────────────────
// Goong Keys
// ──────────────────────────────────────────────────────────────────
const GOONG_MAP_KEY = 'N6tZz1MMmnVzn6OfoBPVNGJVqJFIIHi7ET62ZGCg';
const GOONG_API_KEY = 'dTxBSGquKN0T5txd9Kvm8dqrDWEfhiJq9PFQgkJe';
const GOONG_STYLE_URL = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_KEY}`;
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWluaDEzMDIwNCIsImEiOiJjbW53dXl1ODIwMGRsMnhvcXV3azZveHZkIn0.svghOcaw1pnff-ODZGH39w';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

// ──────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────
interface DirectionsResult {
  coords: [number, number][];
  distanceText: string;
  durationText: string;
}

// ──────────────────────────────────────────────────────────────────
// Hàm gọi API Goong Directions
// ──────────────────────────────────────────────────────────────────
async function fetchGoongDirections(
  originLng: number,
  originLat: number,
  destLng: number,
  destLat: number,
): Promise<DirectionsResult> {
  // Goong Directions API nhận tọa độ theo thứ tự lat,lng (khác với GeoJSON là lng,lat)
  const url =
    `https://rsapi.goong.io/Direction` +
    `?origin=${originLat},${originLng}` +
    `&destination=${destLat},${destLng}` +
    `&vehicle=car` +
    `&api_key=${GOONG_API_KEY}`;

  const response = await fetch(url);
  const json = await response.json();

  if (json.routes && json.routes.length > 0) {
    const route = json.routes[0];
    const leg = route.legs?.[0];
    const encoded: string = route.overview_polyline.points;
    const decoded = polyline.decode(encoded);
    const coords: [number, number][] = decoded.map((p: [number, number]) => [p[1], p[0]]);
    return {
      coords,
      distanceText: leg?.distance?.text ?? '',
      durationText: leg?.duration?.text ?? '',
    };
  }
  return { coords: [], distanceText: '', durationText: '' };
}

// ──────────────────────────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────────────────────────
const safeCoord = (val: unknown, fallback: number): number => {
  const n = Number(val);
  return isFinite(n) && n !== 0 ? n : fallback;
};

// ──────────────────────────────────────────────────────────────────
// MapContent – dùng chung cho cả chế độ thu nhỏ và toàn màn hình
// ──────────────────────────────────────────────────────────────────
interface MapContentProps {
  pickupLng: number;
  pickupLat: number;
  destLng: number;
  destLat: number;
  centerLng: number;
  centerLat: number;
  routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> | null;
  directionsError: boolean;
  zoomLevel?: number;
}

const MapContent = ({
  pickupLng,
  pickupLat,
  destLng,
  destLat,
  centerLng,
  centerLat,
  routeGeoJSON,
  directionsError,
  zoomLevel = 12,
}: MapContentProps) => (
  <Mapbox.MapView
    styleURL={GOONG_STYLE_URL}
    style={styles.map}
    logoEnabled={false}
    attributionEnabled={false}
    compassEnabled={false}
    scaleBarEnabled={false}
  >
    {isFinite(centerLng) && isFinite(centerLat) && (
      <Mapbox.Camera
        zoomLevel={zoomLevel}
        centerCoordinate={[centerLng, centerLat]}
        animationMode="flyTo"
        animationDuration={800}
      />
    )}

    {routeGeoJSON && (
      <Mapbox.ShapeSource id="routeSource" shape={routeGeoJSON}>
        <Mapbox.LineLayer
          id="routeOutline"
          style={{ lineColor: '#FFFFFF', lineWidth: 7, lineCap: 'round', lineJoin: 'round' }}
          layerIndex={10}
        />
        <Mapbox.LineLayer
          id="routeFill"
          style={{
            lineColor: directionsError ? '#94A3B8' : '#2563EB',
            lineWidth: 4,
            lineCap: 'round',
            lineJoin: 'round',
          }}
          layerIndex={11}
        />
      </Mapbox.ShapeSource>
    )}

    {isFinite(pickupLng) && isFinite(pickupLat) && (
      <Mapbox.PointAnnotation id="pickup" coordinate={[pickupLng, pickupLat]}>
        <View style={[styles.markerOuter, styles.markerPickup]}>
          <View style={styles.markerInner} />
        </View>
      </Mapbox.PointAnnotation>
    )}

    {isFinite(destLng) && isFinite(destLat) && (
      <Mapbox.PointAnnotation id="destination" coordinate={[destLng, destLat]}>
        <View style={[styles.markerOuter, styles.markerDest]}>
          <View style={styles.markerInner} />
        </View>
      </Mapbox.PointAnnotation>
    )}
  </Mapbox.MapView>
);

// ──────────────────────────────────────────────────────────────────
// Props
// ──────────────────────────────────────────────────────────────────
interface RouteMapSectionProps {
  order: any;
  isLoading?: boolean;
}

// ──────────────────────────────────────────────────────────────────
// Component chính
// ──────────────────────────────────────────────────────────────────
export const RouteMapSection = ({
  order,
  isLoading = false,
}: RouteMapSectionProps) => {
  const insets = useSafeAreaInsets();
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [directionsLoading, setDirectionsLoading] = useState(false);
  const [directionsError, setDirectionsError] = useState(false);
  const [distanceText, setDistanceText] = useState('');
  const [durationText, setDurationText] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cameraRef = useRef<Mapbox.Camera>(null);

  const pickupLng = safeCoord(order?.pickupLongitude, 106.6992);
  const pickupLat = safeCoord(order?.pickupLatitude,  10.7326);
  const destLng   = safeCoord(order?.longitude,       106.6602);
  const destLat   = safeCoord(order?.latitude,        10.7626);
  const centerLng = (pickupLng + destLng) / 2;
  const centerLat = (pickupLat + destLat) / 2;

  useEffect(() => {
    if (isLoading) { return; }
    setDirectionsLoading(true);
    setDirectionsError(false);

    fetchGoongDirections(pickupLng, pickupLat, destLng, destLat)
      .then(result => {
        if (result.coords.length > 0) {
          setRouteCoords(result.coords);
          setDistanceText(result.distanceText);
          setDurationText(result.durationText);
        } else {
          setRouteCoords([[pickupLng, pickupLat], [destLng, destLat]]);
          setDirectionsError(true);
        }
      })
      .catch(() => {
        setRouteCoords([[pickupLng, pickupLat], [destLng, destLat]]);
        setDirectionsError(true);
      })
      .finally(() => setDirectionsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.pickupLongitude, order?.pickupLatitude, order?.longitude, order?.latitude]);

  const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> | null = routeCoords
    ? { type: 'Feature', geometry: { type: 'LineString', coordinates: routeCoords }, properties: {} }
    : null;

  // ── Badge dùng chung ────────────────────────────────────────────
  const DistanceBadge = () => (
    (distanceText || durationText) ? (
      <View style={styles.badge}>
        {distanceText ? (
          <View style={styles.badgeItem}>
            <Icon name="map-marker-distance" size={16} color="#2563EB" />
            <Text style={styles.badgeText}>{distanceText}</Text>
          </View>
        ) : null}
        {distanceText && durationText ? <View style={styles.badgeDivider} /> : null}
        {durationText ? (
          <View style={styles.badgeItem}>
            <Icon name="clock-outline" size={16} color="#EA580C" />
            <Text style={styles.badgeText}>{durationText}</Text>
          </View>
        ) : null}
      </View>
    ) : null
  );

  return (
    <View className="bg-white pb-5 shadow-sm border-b border-gray-100 rounded-b-3xl mb-4">

      {/* ── BẢN ĐỒ THU NHỎ ── */}
      <View className="h-[260px] mx-4 mt-4 rounded-[20px] overflow-hidden bg-gray-100 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative">
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#10B981" />
          </View>
        ) : (
          <MapContent
            pickupLng={pickupLng}
            pickupLat={pickupLat}
            destLng={destLng}
            destLat={destLat}
            centerLng={centerLng}
            centerLat={centerLat}
            routeGeoJSON={routeGeoJSON}
            directionsError={directionsError}
          />
        )}

        {/* Loading overlay */}
        {directionsLoading && (
          <View style={styles.overlay} pointerEvents="none">
            <ActivityIndicator color="#2563EB" size="small" />
            <Text className="text-gray-500 text-xs mt-1">Đang tính tuyến đường...</Text>
          </View>
        )}

        {/* Nút mở toàn màn hình */}
        {!isLoading && (
          <TouchableOpacity
            style={styles.expandBtn}
            onPress={() => setIsFullscreen(true)}
            activeOpacity={0.85}
          >
            <Icon name="fullscreen" size={20} color="#1e293b" />
          </TouchableOpacity>
        )}

        {/* Badge khoảng cách & thời gian */}
        <View style={styles.badgeWrapper}>
          <DistanceBadge />
        </View>
      </View>

      {/* ── MODAL TOÀN MÀN HÌNH ── */}
      <Modal
        visible={isFullscreen}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsFullscreen(false)}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={StyleSheet.absoluteFill}>
          <MapContent
            pickupLng={pickupLng}
            pickupLat={pickupLat}
            destLng={destLng}
            destLat={destLat}
            centerLng={centerLng}
            centerLat={centerLat}
            routeGeoJSON={routeGeoJSON}
            directionsError={directionsError}
            zoomLevel={13}
          />

          {/* Header toàn màn hình */}
          <View
            style={[
              styles.fullscreenHeader,
              { paddingTop: insets.top + (Platform.OS === 'android' ? 8 : 4) },
            ]}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsFullscreen(false)}
              activeOpacity={0.85}
            >
              <Icon name="arrow-left" size={22} color="#1e293b" />
            </TouchableOpacity>

            <View style={styles.headerTitle}>
              <Icon name="map-marker-path" size={18} color="#2563EB" />
              <Text style={styles.headerTitleText}>Bản đồ tuyến đường</Text>
            </View>

            {/* Placeholder giữ cân bằng header */}
            <View style={styles.closeBtn} />
          </View>

          {/* Badge toàn màn hình – góc dưới giữa */}
          <View
            style={[
              styles.fullscreenBadgeWrapper,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            <DistanceBadge />

            {/* Legend điểm đầu – điểm cuối */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendText} numberOfLines={1}>
                  {order?.pickupLocation || 'Điểm lấy hàng'}
                </Text>
              </View>
              <View style={styles.legendArrow}>
                <Icon name="arrow-right" size={14} color="#94A3B8" />
              </View>
              <View style={[styles.legendItem, { flex: 1 }]}>
                <View style={[styles.legendDot, { backgroundColor: '#F43F5E' }]} />
                <Text style={styles.legendText} numberOfLines={1}>
                  {order?.destination || 'Điểm giao hàng'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── CHI TIẾT ĐỊA ĐIỂM ── */}
      <View className="px-5 mt-6">

        {/* Điểm Lấy Hàng */}
        <View className="flex-row">
          <View className="items-center mr-4">
            <View className="w-10 h-10 rounded-full items-center justify-center bg-emerald-50 border border-emerald-100">
              <Icon name="store" size={20} color="#10B981" />
            </View>
            <View className="w-[2px] h-8 bg-gray-200 my-2" />
          </View>
          <View className="flex-1 pt-1 opacity-90">
            <Text className="text-gray-500 font-bold text-[11px] uppercase tracking-wider mb-1">Điểm lấy hàng</Text>
            <Text className="text-gray-900 font-bold text-[15px] leading-5" numberOfLines={2}>
              {order?.pickupLocation || 'Kho phân phối (Chưa cập nhật)'}
            </Text>
          </View>
        </View>

        {/* Điểm Giao Hàng */}
        <View className="flex-row bg-gray-50 p-4 -ml-4 -mr-4 rounded-xl border border-gray-100/50 mt-1">
          <View className="items-center mr-4">
            <View className="w-10 h-10 rounded-full items-center justify-center bg-rose-50 border border-rose-100">
              <Icon name="map-marker-radius" size={22} color="#E11D48" />
            </View>
          </View>
          <View className="flex-1 justify-center">
            <Text className="text-gray-500 font-bold text-[11px] uppercase tracking-wider mb-1">ĐIỂM GIAO HÀNG</Text>
            <Text className="text-gray-900 font-black text-[16px] leading-6 mb-0.5">
              {order?.customerName || 'Khách hàng'}
            </Text>
            <Text className="text-gray-600 text-sm font-medium leading-5" numberOfLines={2}>
              {order?.destination || 'Chưa cập nhật địa chỉ'}
            </Text>
            {order?.customerPhone && (
              <View className="flex-row items-center mt-2 bg-white self-start px-2 py-1 rounded-md border border-gray-200">
                <Icon name="phone" size={14} color="#2563EB" />
                <Text className="text-blue-600 font-semibold text-xs ml-1.5">{order.customerPhone}</Text>
              </View>
            )}
          </View>
        </View>

      </View>

    </View>
  );
};

// ──────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },

  // ── Nút expand (thu nhỏ)
  expandBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
  },

  // ── Badge (dùng chung)
  badgeWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  badgeDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 12,
  },

  // ── Fullscreen header
  fullscreenHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },

  // ── Fullscreen badge + legend (bottom)
  fullscreenBadgeWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    zIndex: 50,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  legendArrow: {
    marginHorizontal: 8,
  },

  // ── Markers
  markerOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  markerPickup: { backgroundColor: '#10B981' },
  markerDest:   { backgroundColor: '#F43F5E' },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});

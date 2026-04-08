# Hướng dẫn chạy ứng dụng React Native

## Yêu cầu

- Node.js >= 22.11.0
- Android Studio với Android SDK
- Thiết bị Android hoặc Emulator

## Các bước khởi chạy

### 1. Kill process đang chiếm port 8081 (nếu có)

```powershell
# Tìm process đang sử dụng port 8081
netstat -ano | findstr :8081

# Kill process theo PID (thay <PID> bằng số PID tìm được)
taskkill /F /PID <PID>
```

**Ví dụ:**
```powershell
netstat -ano | findstr :8081
# Output: TCP  0.0.0.0:8081  0.0.0.0:0  LISTENING  12345

taskkill /F /PID 12345
# Output: SUCCESS: The process with PID 12345 has been terminated.
```

### 2. Khởi động Metro Bundler

```powershell
# Khởi động Metro với reset cache (khuyến nghị)
npx react-native start --reset-cache

# Hoặc khởi động Metro bình thường
npx react-native start
```

Chờ đến khi thấy thông báo:
```
INFO  Dev server ready. Press Ctrl+C to exit.
```

### 3. Chạy ứng dụng trên Android

Mở terminal mới và chạy:

```powershell
npx react-native run-android
```

Hoặc sử dụng npm script:

```powershell
npm run android
```

### 4. Reload ứng dụng (khi cần)

- **Trên thiết bị thật:** Lắc điện thoại → Chọn "Reload"
- **Trên Emulator:** Nhấn `R` hai lần hoặc `Ctrl + M` → Chọn "Reload"

## Xử lý lỗi thường gặp

### Lỗi: `EADDRINUSE: address already in use :::8081`

Port 8081 đang bị chiếm. Thực hiện bước 1 để kill process.

### Lỗi: `.plugins is not a valid Plugin property`

Kiểm tra file `babel.config.js`:
- Đảm bảo `react-native-reanimated/plugin` nằm cuối cùng trong mảng plugins
- NativeWind v4 không cần `nativewind/babel` plugin

### Lỗi: `Export namespace should be first transformed`

Thêm plugin vào `babel.config.js`:
```javascript
plugins: [
  '@babel/plugin-transform-export-namespace-from',
  // ... các plugin khác
  'react-native-reanimated/plugin', // luôn ở cuối
]
```

### Lỗi: `Export 'xxx' is not defined`

Kiểm tra xem biến/function được khai báo đúng scope để export.

## Script nhanh (All-in-one)

Chạy tất cả trong PowerShell:

```powershell
# Kill port 8081, sau đó start Metro
$proc = netstat -ano | Select-String ":8081.*LISTENING" | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -First 1
if ($proc) { taskkill /F /PID $proc }
npx react-native start --reset-cache
```

## Cấu trúc lệnh npm

| Lệnh | Mô tả |
|------|-------|
| `npm run start` | Khởi động Metro bundler |
| `npm run android` | Build và chạy trên Android |
| `npm run ios` | Build và chạy trên iOS |
| `npm run lint` | Kiểm tra lỗi ESLint |
| `npm run test` | Chạy test với Jest |

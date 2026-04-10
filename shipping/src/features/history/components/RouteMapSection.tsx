import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from 'react-native-webview';

interface RouteMapSectionProps {
  order: any;
  isLoading?: boolean;
}

export const RouteMapSection = ({
  order,
  isLoading = false,
}: RouteMapSectionProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // HTML chứa Leaflet & OpenStreetMap giúp tạo ra 1 bản đồ mượt mà, tĩnh nhưng kéo/zoom được
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { padding: 0; margin: 0; background-color: #f3f4f6; }
          html, body, #map { height: 100%; width: 100%; }
          .start-icon, .end-icon {
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          }
          .start-icon { background-color: #10B981; } /* Xanh ngọc */
          .end-icon { background-color: #F43F5E; } /* Đỏ hồng */
          .leaflet-control-attribution { display: none; } /* Ẩn bớt text bản quyền cho gọn */
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Giả lập tọa độ HCM City (Vì order hiện không có field lat/long cụ thể)
          var pickup = [10.7769, 106.7009]; // Quận 1
          var dropoff = [10.7626, 106.6602]; // Quận 10

          var map = L.map('map', { zoomControl: false }).setView(pickup, 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             maxZoom: 19
          }).addTo(map);

          var startIcon = L.divIcon({ className: 'start-icon', iconSize: [22, 22], iconAnchor: [11, 11] });
          var endIcon = L.divIcon({ className: 'end-icon', iconSize: [22, 22], iconAnchor: [11, 11] });

          L.marker(pickup, {icon: startIcon}).addTo(map);
          L.marker(dropoff, {icon: endIcon}).addTo(map);

          var line = L.polyline([pickup, dropoff], {color: '#2563EB', weight: 4, dashArray: '10, 8', opacity: 0.8}).addTo(map);
          map.fitBounds(line.getBounds(), {padding: [50, 50]});
        </script>
      </body>
    </html>
  `;

  return (
    <View className="bg-white pb-5 shadow-sm border-b border-gray-100 rounded-b-3xl mb-4">

      {/* KHU VỰC BẢN ĐỒ OPEN STREET MAP */}
      <View className="h-[260px] mx-4 mt-4 rounded-[20px] overflow-hidden bg-gray-100 border border-gray-200 relative shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative flex-col">
        {isLoading ? (
          <View className="w-full h-full justify-center items-center">
            <ActivityIndicator color="#10B981" />
          </View>
        ) : (
          <>
            {!mapLoaded && (
              <View className="absolute z-10 w-full h-full bg-gray-50 items-center justify-center">
                <ActivityIndicator color="#10B981" />
                <Text className="text-gray-400 text-xs mt-2">Đang tải bản đồ...</Text>
              </View>
            )}
            <WebView
              source={{ html: mapHtml }}
              className="flex-1 w-full h-full"
              scrollEnabled={false}
              onLoadEnd={() => setMapLoaded(true)}
            />
          </>
        )}

        {/* Lớp Overlay Hiển thị độ dài quãng đường */}
        <View className="absolute bottom-3 left-0 right-0 flex-row justify-center z-20">
          <View className="bg-white/95 px-4 py-2 rounded-full shadow-lg flex-row items-center border border-gray-100 backdrop-blur-md">
            <View className="flex-row items-center">
              <Icon name="map-marker-distance" size={16} color="#2563EB" />
              <Text className="ml-1.5 text-gray-800 font-bold text-sm">
                {order.distance ? `${order.distance} km` : 'Hành trình 5.2 km'}
              </Text>
            </View>
            <View className="w-[1px] h-4 bg-gray-300 mx-3" />
            <View className="flex-row items-center">
              <Icon name="clock-outline" size={16} color="#EA580C" />
              <Text className="ml-1.5 text-gray-800 font-bold text-sm">
                {order.duration ? `${order.duration} phút` : 'Dự kiến 25p'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* KHU VỰC CHI TIẾT ĐỊA ĐIỂM */}
      <View className="px-5 mt-6">

        {/* Điểm Lấy Hàng */}
        <View className="flex-row">
          <View className="items-center mr-4">
            <View className="w-10 h-10 rounded-full items-center justify-center bg-emerald-50 border border-emerald-100">
              <Icon name="store" size={20} color="#10B981" />
            </View>
            {/* Dòng kẻ nối */}
            <View className="w-[2px] h-8 bg-gray-200 my-2" />
          </View>
          <View className="flex-1 pt-1 opacity-90">
            <Text className="text-gray-500 font-bold text-[11px] uppercase tracking-wider mb-1">Điểm lấy hàng</Text>
            <Text className="text-gray-900 font-bold text-[15px] leading-5" numberOfLines={2}>
              {order.pickupAddress || 'Kho phân phối (Chưa cập nhật)'}
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
              {order.customerName || 'Khách hàng'}
            </Text>
            <Text className="text-gray-600 text-sm font-medium leading-5" numberOfLines={2}>
              {order.destination || 'Chưa cập nhật địa chỉ'}
            </Text>
            {order.customerPhone && (
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


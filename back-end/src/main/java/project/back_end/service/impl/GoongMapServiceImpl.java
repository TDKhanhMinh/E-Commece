package project.back_end.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import project.back_end.config.GoongMapConfig;
import project.back_end.response.DirectionsResponse;
import project.back_end.service.GoongMapService;

import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class GoongMapServiceImpl implements GoongMapService {
    private final RestTemplate restTemplate;
    private final GoongMapConfig goongMapConfig;

    @Override
    public DirectionsResponse getDirections(double oriLat, double oriLng, double destLat, double destLng) {
        String goongApiKey = goongMapConfig.getApiKey();
        String url = String.format(
                "https://rsapi.goong.io/Direction?origin=%s,%s&destination=%s,%s&vehicle=car&api_key=%s",
                oriLat, oriLng, destLat, destLng, goongApiKey
        );

        try {
            Map response = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> routes = (List<Map<String, Object>>) response.get("routes");

            if (routes != null && !routes.isEmpty()) {
                Map<String, Object> route = routes.get(0);
                Map<String, Object> overviewPolyline = (Map<String, Object>) route.get("overview_polyline");
                List<Map<String, Object>> legs = (List<Map<String, Object>>) route.get("legs");

                String encodedPoints = (String) overviewPolyline.get("points");

                // Lấy thông tin khoảng cách và thời gian từ chặng đầu tiên
                Map<String, Object> leg = legs.get(0);
                Map<String, Object> distance = (Map<String, Object>) leg.get("distance");
                Map<String, Object> duration = (Map<String, Object>) leg.get("duration");

                return new DirectionsResponse(
                        encodedPoints,
                        (String) distance.get("text"),
                        ((Number) distance.get("value")).longValue(),
                        (String) duration.get("text")
                );
            }
        } catch (Exception e) {
            System.out.println("Error fetching directions from Goong API: " + e.getMessage());
        }
        return null;
    }
}

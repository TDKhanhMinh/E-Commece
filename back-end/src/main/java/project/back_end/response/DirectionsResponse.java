package project.back_end.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DirectionsResponse {
    private String encodedPolyline; // Chuỗi mã hóa đường đi
    private String distanceText;    // Khoảng cách (VD: "5.2 km")
    private long distanceValue;     // Khoảng cách theo mét (dùng để tính phí)
    private String durationText;    // Thời gian dự kiến (VD: "15 phút")
}
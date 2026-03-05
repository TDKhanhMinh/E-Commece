package project.back_end.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import project.back_end.entity.MemberShipPointHistory;
import project.back_end.entity.User;
import project.back_end.response.MemberShipPointHistoryResponse;
import project.back_end.response.UserPointSummaryResponse;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PointMapper {

    // Chuyển đổi từ Entity PointHistory sang Response DTO
    MemberShipPointHistoryResponse toHistoryResponse(MemberShipPointHistory entity);

    // Chuyển đổi danh sách (MapStruct sẽ tự loop qua từng phần tử)
    List<MemberShipPointHistoryResponse> toHistoryResponseList(List<MemberShipPointHistory> entities);

    // Chuyển đổi thông tin tổng hợp điểm của User
    @Mapping(target = "pointsToNextTier", source = "totalAccumulatedPoints", qualifiedByName = "calculatePointsToNextTier")
    UserPointSummaryResponse toSummaryResponse(User user);

    // Logic tính toán số điểm còn thiếu để lên hạng
    @Named("calculatePointsToNextTier")
    default Long calculatePointsToNextTier(Long totalPoints) {
        if (totalPoints == null) return 2000L;
        if (totalPoints < 2000) return 2000 - totalPoints;   // Mốc Silver
        if (totalPoints < 5000) return 5000 - totalPoints;   // Mốc Gold
        if (totalPoints < 10000) return 10000 - totalPoints; // Mốc Platinum
        return 0L; // Đã đạt mức cao nhất
    }
}

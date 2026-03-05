package project.back_end.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import project.back_end.entity.Voucher;
import project.back_end.request.VoucherRequest.VoucherRequest;
import project.back_end.response.VoucherResponse;

@Mapper(componentModel = "spring")
public interface VoucherMapper {

    // 1. Chuyển từ Entity sang Response để trả về cho Frontend
    VoucherResponse toResponse(Voucher voucher);

    // 2. Chuyển từ Request sang Entity để lưu mới (Bỏ qua các trường tự động tạo)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Voucher toEntity(VoucherRequest request);

    // 3. Cập nhật một Entity có sẵn từ dữ liệu Request (Dùng cho hàm Update Voucher)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateVoucherFromRequest(VoucherRequest request, @MappingTarget Voucher voucher);
}
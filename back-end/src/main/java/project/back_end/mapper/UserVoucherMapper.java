package project.back_end.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.back_end.entity.UserVoucher;
import project.back_end.response.UserVoucherResponse;

// Thuộc tính uses = {VoucherMapper.class} báo cho MapStruct biết
// hãy dùng VoucherMapper để chuyển đổi trường "voucher" bên trong UserVoucher.
@Mapper(componentModel = "spring", uses = {VoucherMapper.class})
public interface UserVoucherMapper {

    // Ánh xạ từ UserVoucher Entity sang UserVoucherResponse
    // Lấy id từ đối tượng User để gán vào trường userId của DTO
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "voucher", target = "voucher")
    // Sẽ tự động gọi VoucherMapper.toResponse()
    UserVoucherResponse toResponse(UserVoucher userVoucher);
}
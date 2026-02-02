package project.back_end.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import project.back_end.entity.product.Brand;
import project.back_end.request.Product.BrandRequest;
import project.back_end.response.Product.BrandResponse;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    // 1. Entity -> Response
    BrandResponse toResponse(Brand brand);

    // 2. Request -> Entity (Dùng khi Create)
    // Ignore id (tự sinh), slug (service tự tạo), và các field audit
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Brand toEntity(BrandRequest request);

    // 3. Update Entity từ Request (Dùng khi Update)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true) // Slug update riêng trong service
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateBrandFromRequest(BrandRequest request, @MappingTarget Brand brand);
}
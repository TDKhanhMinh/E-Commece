package project.back_end.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import project.back_end.entity.product.Attribute;
import project.back_end.request.Product.AttributeRequest;
import project.back_end.response.Product.AttributeResponse;

@Mapper(componentModel = "spring")
public interface AttributeMapper {

    // 1. Entity -> Response
    AttributeResponse toResponse(Attribute attribute);

    // 2. Request -> Entity (Create)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Attribute toEntity(AttributeRequest request);

    // 3. Update Entity (Update)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateAttributeFromRequest(AttributeRequest request, @MappingTarget Attribute attribute);
}
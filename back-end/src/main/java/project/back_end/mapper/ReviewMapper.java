package project.back_end.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import project.back_end.entity.Review;
import project.back_end.request.ReviewRequest;
import project.back_end.response.ReviewResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReviewMapper {

    @Mapping(source = "user.name", target = "reviewerName")
    @Mapping(source = "user.avatarUrl", target = "reviewerImage")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.slug", target = "productSlug")
    @Mapping(source = "purchasedVariantName", target = "purchasedVariantName")
    ReviewResponse toResponse(Review review);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reviewDate", ignore = true)
    Review toEntity(ReviewRequest request);
}
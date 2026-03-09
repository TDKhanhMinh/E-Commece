package project.back_end.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String title;
    private String content;
    private Integer rating;
    private Boolean isVerified;
    private LocalDateTime reviewDate;

    private String reviewerName;
    private String reviewerImage = "https://res.cloudinary.com/dzcmadjl1/image/upload/v1700000000/default-avatar.png";

    private String productName;
    private String productImage;
    private String productSlug;

    private String purchasedVariantName;
}
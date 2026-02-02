package project.back_end.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.service.ImageUploadService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageUploadServiceImpl implements ImageUploadService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp");

    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file) {
        validateFile(file);

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "products",
                            "resource_type", "image"
                    )
            );
            log.info("Image uploaded to Cloudinary: {}", result.get("secure_url"));
            return result.get("secure_url").toString();

        } catch (IOException e) {
            throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    @Override
    public List<String> uploadImages(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_FILE);
        }

        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(uploadImage(file));
        }
        return urls;
    }

    @Override
    public void deleteImageByUrl(String imageUrl) {
        try {
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new AppException(ErrorCode.IMAGE_DELETE_FAILED);
        }
    }

    /* =========================
     * PRIVATE METHODS
     * ========================= */

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_FILE);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new AppException(ErrorCode.FILE_TOO_LARGE);
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new AppException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
    }

    private String extractPublicId(String imageUrl) {
        // https://res.cloudinary.com/demo/image/upload/v123/products/abc.jpg
        String[] parts = imageUrl.split("/");
        String fileName = parts[parts.length - 1];
        String folder = parts[parts.length - 2];

        return folder + "/" + fileName.substring(0, fileName.lastIndexOf("."));
    }
}

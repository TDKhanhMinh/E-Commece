package project.back_end.controller;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.back_end.response.ApiResponse;
import project.back_end.service.ImageUploadService;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @RequestParam("file") @NotNull MultipartFile file
    ) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", imageUploadService.uploadImage(file)));
    }

    @PostMapping("/upload-multiple")
    public ResponseEntity<ApiResponse<List<String>>> uploadImages(
            @RequestParam("files") List<MultipartFile> files
    ) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", imageUploadService.uploadImages(files)));

    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @RequestParam("url") String imageUrl
    ) {
        imageUploadService.deleteImageByUrl(imageUrl);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", null));

    }
}

package project.back_end.service;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface ImageUploadService {

    String uploadImage(MultipartFile file);

    List<String> uploadImages(List<MultipartFile> files);

    void deleteImageByUrl(String imageUrl);
}

package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.back_end.request.Product.BrandRequest;
import project.back_end.response.Product.BrandResponse;

@Service
public interface BrandService {
    Page<BrandResponse> getAllBrands(String keyword, Pageable pageable);

    BrandResponse getBrandById(Long id);

    BrandResponse createBrand(BrandRequest request);

    BrandResponse updateBrand(Long id, BrandRequest request);

    void deleteBrand(Long id);
}
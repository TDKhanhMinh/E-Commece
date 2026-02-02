package project.back_end.service;

import project.back_end.request.Product.BrandRequest;
import project.back_end.response.Product.BrandResponse;

import java.util.List;

public interface BrandService {
    List<BrandResponse> getAllBrands();

    BrandResponse getBrandById(Long id);

    BrandResponse createBrand(BrandRequest request);

    BrandResponse updateBrand(Long id, BrandRequest request);

    void deleteBrand(Long id);
}
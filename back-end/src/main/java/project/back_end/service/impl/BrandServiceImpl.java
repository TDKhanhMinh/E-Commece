package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.product.Brand;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.BrandMapper;
import project.back_end.repository.BrandRepository;
import project.back_end.request.Product.BrandRequest;
import project.back_end.response.Product.BrandResponse;
import project.back_end.service.BrandService;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Implementation of BrandService.
 * <p>
 * Responsible for handling business logic related to Brand entity,
 * including CRUD operations and slug generation.
 */
@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    /**
     * Retrieve all brands from database.
     *
     * @return list of BrandResponse
     */
    @Override
    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll()
                .stream()
                .map(brandMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get brand detail by id.
     *
     * @param id brand id
     * @return BrandResponse
     * @throws AppException if brand not found
     */
    @Override
    public BrandResponse getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        return brandMapper.toResponse(brand);
    }

    /**
     * Create new brand.
     * <p>
     * - Map request to entity
     * - Generate slug from brand name
     * - Persist entity
     *
     * @param request brand creation request
     * @return created BrandResponse
     */
    @Override
    @Transactional
    public BrandResponse createBrand(BrandRequest request) {
        // Convert request DTO to Brand entity
        Brand brand = brandMapper.toEntity(request);

        // Generate slug based on brand name
        brand.setSlug(toSlug(request.getName()));

        Brand savedBrand = brandRepository.save(brand);
        return brandMapper.toResponse(savedBrand);
    }

    /**
     * Update existing brand.
     * <p>
     * - Validate brand existence
     * - Update mutable fields
     * - Regenerate slug if name changes
     *
     * @param id      brand id
     * @param request brand update request
     * @return updated BrandResponse
     * @throws AppException if brand not found
     */
    @Override
    @Transactional
    public BrandResponse updateBrand(Long id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        // Update entity fields from request
        brandMapper.updateBrandFromRequest(request, brand);

        // Always regenerate slug to keep consistency with name
        brand.setSlug(toSlug(request.getName()));

        Brand savedBrand = brandRepository.save(brand);
        return brandMapper.toResponse(savedBrand);
    }

    /**
     * Delete brand by id.
     *
     * @param id brand id
     * @throws AppException if brand not found
     */
    @Override
    @Transactional
    public void deleteBrand(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new AppException(ErrorCode.BRAND_NOT_FOUND);
        }
        brandRepository.deleteById(id);
    }

    /* =========================
     * SLUG UTILS
     * ========================= */

    /**
     * Regex for removing non-latin characters.
     */
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");

    /**
     * Regex for replacing whitespace characters.
     */
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    /**
     * Convert input string to URL-friendly slug.
     *
     * @param input original string
     * @return normalized slug
     */
    private String toSlug(String input) {
        if (input == null) return "";

        // Replace whitespace with hyphen
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");

        // Normalize accented characters (e.g. tiếng Việt)
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);

        // Remove non-latin characters
        String slug = NONLATIN.matcher(normalized).replaceAll("");

        return slug.toLowerCase(Locale.ENGLISH);
    }
}

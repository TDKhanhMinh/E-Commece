package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.product.Attribute;
import project.back_end.entity.product.Product;
import project.back_end.entity.product.Sku;
import project.back_end.entity.product.SkuAttributeValue;
import project.back_end.enumerate.ErrorCode;
import project.back_end.exception.AppException;
import project.back_end.repository.AttributeRepository;
import project.back_end.repository.ProductRepository;
import project.back_end.repository.SkuRepository;
import project.back_end.request.Product.*;
import project.back_end.service.SkuService;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service xử lý nghiệp vụ liên quan đến SKU (Stock Keeping Unit)
 * Bao gồm: tạo, cập nhật và xóa SKU cho sản phẩm
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SkuServiceImpl implements SkuService {

    private final SkuRepository skuRepository;
    private final ProductRepository productRepository;
    private final AttributeRepository attributeRepository;

    /**
     * Tạo mới một SKU cho sản phẩm
     *
     * @param productId id của sản phẩm
     * @param request   dữ liệu SKU cần tạo
     */
    @Override
    @Transactional
    public void createSku(Long productId, SkuRequest request) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (skuRepository.findByCode(request.getSkuCode()).isPresent()) {
            throw new AppException(ErrorCode.SKU_CODE_EXISTS);
        }

        List<SkuAttributeRequest> attrRequests = request.getAttributes();
        Map<Long, Attribute> attributeMap = new HashMap<>();

        if (attrRequests != null && !attrRequests.isEmpty()) {
            for (SkuAttributeRequest attrReq : attrRequests) {
                Long attributeId = attrReq.getAttributeId();

                if (attributeMap.containsKey(attributeId)) {
                    throw new AppException(ErrorCode.DUPLICATE_ATTRIBUTE);
                }

                Attribute attribute = attributeRepository.findById(attributeId)
                        .orElseThrow(() -> new AppException(ErrorCode.ATTRIBUTE_NOT_FOUND));

                attributeMap.put(attributeId, attribute);
            }
        }

        Sku sku = new Sku();
        sku.setProduct(product);
        sku.setCode(request.getSkuCode());
        sku.setPrice(request.getPrice());
        sku.setStock(request.getStock());
        sku.setImages(request.getImages());

        List<SkuAttributeValue> attributeValues = new ArrayList<>();

        if (attrRequests != null && !attrRequests.isEmpty()) {
            for (SkuAttributeRequest attrReq : attrRequests) {
                SkuAttributeValue value = new SkuAttributeValue();
                value.setSku(sku);
                value.setAttribute(attributeMap.get(attrReq.getAttributeId()));
                value.setValue(attrReq.getValue());
                attributeValues.add(value);
            }
        }

        sku.setAttributeValues(attributeValues);

        skuRepository.save(sku);
    }

    /**
     * Tạo nhiều SKU cho cùng một sản phẩm
     *
     * @param productId id của sản phẩm
     * @param requests  danh sách SKU cần tạo
     */
    @Override
    @Transactional
    public void createSkus(Long productId, List<SkuRequest> requests) {
        for (SkuRequest request : requests) {
            createSku(productId, request);
        }
    }

    /**
     * Cập nhật thông tin SKU
     *
     * @param skuId   id của SKU
     * @param request dữ liệu cập nhật
     */
    @Override
    @Transactional
    public void updateSku(Long skuId, SkuRequest request) {

        // Kiểm tra SKU tồn tại
        Sku sku = skuRepository.findById(skuId)
                .orElseThrow(() -> new AppException(ErrorCode.SKU_NOT_FOUND));

        // Cập nhật thông tin cơ bản
        sku.setPrice(request.getPrice());
        sku.setStock(request.getStock());
        sku.setImages(request.getImages());

        // Cập nhật SKU code nếu có thay đổi
        if (!sku.getCode().equals(request.getSkuCode())) {
            if (skuRepository.findByCode(request.getSkuCode()).isPresent()) {
                throw new AppException(ErrorCode.SKU_CODE_EXISTS);
            }
            sku.setCode(request.getSkuCode());
        }

        skuRepository.save(sku);
    }

    /**
     * Xóa SKU theo id
     *
     * @param skuId id của SKU
     */
    @Override
    @Transactional
    public void deleteSku(Long skuId) {

        // Kiểm tra SKU tồn tại trước khi xóa
        if (!skuRepository.existsById(skuId)) {
            throw new AppException(ErrorCode.SKU_NOT_FOUND);
        }

        skuRepository.deleteById(skuId);
    }

    @Override
    @Transactional
    public void autoGenerateSku(Long productId, AutoGenerateSkuRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        validateRequest(request);

        Map<Long, Attribute> attributeMap = new LinkedHashMap<>();
        for (AttributeGenerateRequest attrReq : request.getAttributes()) {
            Attribute attribute = attributeRepository.findById(attrReq.getAttributeId())
                    .orElseThrow(() -> new AppException(ErrorCode.ATTRIBUTE_NOT_FOUND));
            attributeMap.put(attrReq.getAttributeId(), attribute);
        }

        List<List<String>> valueGroups = request.getAttributes()
                .stream()
                .map(AttributeGenerateRequest::getValues)
                .toList();

        List<List<String>> combinations = generateCombinations(valueGroups);

        if (combinations.size() >= 50) {
            throw new AppException(ErrorCode.TOO_MANY_SKU);
        }

        for (List<String> combination : combinations) {

            Map<Long, String> attributeValueMap =
                    buildAttributeValueMap(request.getAttributes(), combination);

            Optional<Sku> existingSku =
                    findExistingSku(product, attributeValueMap);

            if (existingSku.isPresent()) {
                updateSku(existingSku.get(), request);
            } else {
                createSku(product, request, attributeMap, attributeValueMap);
            }
        }
    }

    @Override
    @Transactional
    public void updateSkuDetails(
            Long productId,
            Long skuId,
            UpdateSkuRequest request
    ) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        Sku sku = skuRepository.findById(skuId)
                .orElseThrow(() -> new AppException(ErrorCode.SKU_NOT_FOUND));

        if (!sku.getProduct().getId().equals(product.getId())) {
            throw new AppException(ErrorCode.SKU_NOT_BELONG_TO_PRODUCT);
        }

        sku.setPrice(request.getPrice());

        Integer discountPercent = request.getDiscountPercent();
        sku.setDiscountPercent(discountPercent);

        if (discountPercent != null) {
            BigDecimal salePrice = request.getPrice()
                    .multiply(BigDecimal.valueOf(100 - discountPercent))
                    .divide(BigDecimal.valueOf(100));
            sku.setSalePrice(salePrice);
        } else {
            sku.setSalePrice(null);
        }
        sku.setStock(request.getStock());

        if (request.getImages() != null) {
            log.info("Updating SKU images for SKU ID {}: {}", skuId, request.getImages());
            sku.setImages(request.getImages());
        }
        skuRepository.save(sku);
    }


    /* ======================== PRIVATE METHODS ======================== */

    private void validateRequest(AutoGenerateSkuRequest request) {

        if (request.getAttributes() == null || request.getAttributes().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        Set<Long> attributeIds = new HashSet<>();

        for (AttributeGenerateRequest attr : request.getAttributes()) {

            if (!attributeIds.add(attr.getAttributeId())) {
                throw new AppException(ErrorCode.DUPLICATE_ATTRIBUTE);
            }

            if (attr.getValues() == null || attr.getValues().isEmpty()) {
                throw new AppException(ErrorCode.INVALID_ATTRIBUTE_VALUE);
            }
        }
    }

    private List<List<String>> generateCombinations(List<List<String>> groups) {
        List<List<String>> result = new ArrayList<>();
        backtrack(groups, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(
            List<List<String>> groups,
            int index,
            List<String> current,
            List<List<String>> result
    ) {
        if (index == groups.size()) {
            result.add(new ArrayList<>(current));
            return;
        }

        for (String value : groups.get(index)) {
            current.add(value);
            backtrack(groups, index + 1, current, result);
            current.remove(current.size() - 1);
        }
    }

    private Map<Long, String> buildAttributeValueMap(
            List<AttributeGenerateRequest> attrs,
            List<String> values
    ) {
        Map<Long, String> map = new LinkedHashMap<>();
        for (int i = 0; i < attrs.size(); i++) {
            map.put(attrs.get(i).getAttributeId(), values.get(i));
        }
        return map;
    }

    private Optional<Sku> findExistingSku(
            Product product,
            Map<Long, String> attributes
    ) {

        for (Sku sku : product.getSkus()) {

            if (sku.getAttributeValues().size() != attributes.size()) {
                continue;
            }

            boolean match = true;

            for (SkuAttributeValue sav : sku.getAttributeValues()) {
                String value = attributes.get(sav.getAttribute().getId());
                if (value == null || !value.equals(sav.getValue())) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return Optional.of(sku);
            }
        }

        return Optional.empty();
    }

    private void updateSku(Sku sku, AutoGenerateSkuRequest request) {
        sku.setPrice(request.getPrice());
        sku.setStock(request.getStock());
        skuRepository.save(sku);
    }

    private void createSku(
            Product product,
            AutoGenerateSkuRequest request,
            Map<Long, Attribute> attributeMap,
            Map<Long, String> attributeValueMap
    ) {

        Sku sku = new Sku();
        sku.setProduct(product);
        sku.setPrice(request.getPrice());
        sku.setStock(request.getStock());
        sku.setCode(generateSkuCode(attributeValueMap.values()));
        sku.setIsActive(true);
        List<SkuAttributeValue> values = new ArrayList<>();

        for (Map.Entry<Long, String> entry : attributeValueMap.entrySet()) {

            SkuAttributeValue sav = new SkuAttributeValue();
            sav.setSku(sku);
            sav.setAttribute(attributeMap.get(entry.getKey()));
            sav.setValue(entry.getValue());
            values.add(sav);
        }

        sku.setAttributeValues(values);
        skuRepository.save(sku);
    }

    private String generateSkuCode(Collection<String> values) {
        return values.stream()
                .map(v -> v.toLowerCase().replace(" ", ""))
                .collect(Collectors.joining("-"))
                .toUpperCase();
    }

    /**
     * Điều chỉnh trạng thái active/inactive của SKU
     *
     * @param skuId    id của SKU cần cập nhật
     * @param isActive trạng thái mới (true = active, false = inactive)
     */
    @Override
    @Transactional
    public void toggleSkuStatus(Long skuId, Boolean isActive) {
        Sku sku = skuRepository.findById(skuId)
                .orElseThrow(() -> new AppException(ErrorCode.SKU_NOT_FOUND));

        sku.setIsActive(isActive);
        skuRepository.save(sku);

        log.info("Updated SKU {} status to: {}", skuId, isActive ? "ACTIVE" : "INACTIVE");
    }
}

package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.product.Attribute;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.AttributeMapper;
import project.back_end.repository.AttributeRepository;
import project.back_end.request.Product.AttributeRequest;
import project.back_end.response.Product.AttributeResponse;
import project.back_end.service.AttributeService;

@Service
@RequiredArgsConstructor
public class AttributeServiceImpl implements AttributeService {

    private final AttributeRepository attributeRepository;

    private final AttributeMapper attributeMapper;

    @Override
    public Page<AttributeResponse> getAllAttributes(String keyword, Pageable pageable) {
        return attributeRepository.searchAttributes(keyword, pageable)
                .map(attributeMapper::toResponse);
    }

    @Override
    public AttributeResponse getAttributeById(Long id) {
        Attribute attr = attributeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ATTRIBUTE_NOT_FOUND));
        return attributeMapper.toResponse(attr);
    }

    @Override
    @Transactional
    public AttributeResponse createAttribute(AttributeRequest request) {
        if (attributeRepository.findByCode(request.getCode()).isPresent()) {
            throw new AppException(ErrorCode.ATTRIBUTE_EXISTED);
        }

        // Map Request -> Entity
        Attribute attr = attributeMapper.toEntity(request);

        Attribute savedAttr = attributeRepository.save(attr);
        return attributeMapper.toResponse(savedAttr);
    }

    @Override
    @Transactional
    public AttributeResponse updateAttribute(Long id, AttributeRequest request) {
        Attribute attr = attributeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ATTRIBUTE_NOT_FOUND));

        // Check trùng code nếu code thay đổi
        if (!attr.getCode().equals(request.getCode()) &&
                attributeRepository.findByCode(request.getCode()).isPresent()) {
            throw new AppException(ErrorCode.ATTRIBUTE_EXISTED);
        }

        // Update fields
        attributeMapper.updateAttributeFromRequest(request, attr);

        Attribute savedAttr = attributeRepository.save(attr);
        return attributeMapper.toResponse(savedAttr);
    }

    @Override
    @Transactional
    public void deleteAttribute(Long id) {
        if (!attributeRepository.existsById(id)) {
            throw new AppException(ErrorCode.ATTRIBUTE_NOT_FOUND);
        }
        attributeRepository.deleteById(id);
    }
}
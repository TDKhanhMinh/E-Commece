package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import project.back_end.request.Product.AttributeRequest;
import project.back_end.response.Product.AttributeResponse;

public interface AttributeService {
    Page<AttributeResponse> getAllAttributes(String keyword, Pageable pageable);

    AttributeResponse getAttributeById(Long id);

    AttributeResponse createAttribute(AttributeRequest request);

    AttributeResponse updateAttribute(Long id, AttributeRequest request);

    void deleteAttribute(Long id);
}
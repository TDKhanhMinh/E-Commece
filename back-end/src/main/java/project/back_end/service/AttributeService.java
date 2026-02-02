package project.back_end.service;

import project.back_end.request.Product.AttributeRequest;
import project.back_end.response.Product.AttributeResponse;

import java.util.List;

public interface AttributeService {
    List<AttributeResponse> getAllAttributes();

    AttributeResponse getAttributeById(Long id);

    AttributeResponse createAttribute(AttributeRequest request);

    AttributeResponse updateAttribute(Long id, AttributeRequest request);

    void deleteAttribute(Long id);
}
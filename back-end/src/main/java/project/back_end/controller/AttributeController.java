package project.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.back_end.request.Product.AttributeRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.Product.AttributeResponse;
import project.back_end.service.AttributeService;

import java.util.List;

@RestController
@RequestMapping("/api/attributes")
@RequiredArgsConstructor
public class AttributeController {

    private final AttributeService attributeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttributeResponse>>> getAllAttributes() {
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", attributeService.getAllAttributes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AttributeResponse>> getAttributeById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", attributeService.getAttributeById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AttributeResponse>> createAttribute(@Valid @RequestBody AttributeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(200, "Attribute created", attributeService.createAttribute(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AttributeResponse>> updateAttribute(@PathVariable Long id, @Valid @RequestBody AttributeRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Attribute updated", attributeService.updateAttribute(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAttribute(@PathVariable Long id) {
        attributeService.deleteAttribute(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Attribute deleted", null));
    }
}
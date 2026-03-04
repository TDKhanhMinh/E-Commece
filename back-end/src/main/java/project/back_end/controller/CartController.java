package project.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.back_end.request.CartRequest.CartItemRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.CartResponse;
import project.back_end.service.CartService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCurrentCart() {
        CartResponse cart = cartService.getCurrentCart();
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy giỏ hàng thành công", cart)
        );
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @Valid @RequestBody CartItemRequest request
    ) {
        CartResponse cart = cartService.addItem(
                request.getSkuId(),
                request.getQuantity()
        );
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Đã thêm sản phẩm vào giỏ hàng", cart)
        );
    }

    /**
     * Cập nhật số lượng item dựa trên SKU_ID
     */
    @PutMapping("/items/{skuId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(
            @PathVariable Long skuId,
            @Valid @RequestBody CartItemRequest request
    ) {
        log.info("Cập nhật giỏ hàng: SKU_ID={}, Số lượng mới={}", skuId, request.getQuantity());
        CartResponse cart = cartService.updateItem(
                skuId,
                request.getQuantity()
        );
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Cập nhật số lượng trong giỏ hàng thành công", cart)
        );
    }

    /**
     * Xoá một item khỏi giỏ hàng dựa trên SKU_ID
     */
    @DeleteMapping("/items/{skuId}")
    public ResponseEntity<ApiResponse<Void>> removeItem(
            @PathVariable Long skuId
    ) {
        cartService.removeItem(skuId);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Đã xoá sản phẩm khỏi giỏ hàng", null)
        );
    }

    /**
     * API quan trọng: Hợp nhất giỏ hàng sau khi login
     */
    @PostMapping("/merge")
    public ResponseEntity<ApiResponse<Void>> mergeCart(
            @RequestBody List<CartItemRequest> guestItems
    ) {
        cartService.mergeCart(guestItems);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Hợp nhất giỏ hàng thành công", null)
        );
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Đã xoá toàn bộ giỏ hàng", null)
        );
    }
}

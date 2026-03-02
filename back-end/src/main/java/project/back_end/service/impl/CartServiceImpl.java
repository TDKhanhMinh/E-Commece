package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.Cart;
import project.back_end.entity.CartItem;
import project.back_end.entity.User;
import project.back_end.entity.product.Sku;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.CartMapper;
import project.back_end.repository.CartItemRepository;
import project.back_end.repository.CartRepository;
import project.back_end.repository.SkuRepository;
import project.back_end.request.CartRequest.CartItemRequest;
import project.back_end.response.CartResponse;
import project.back_end.service.CartService;
import project.back_end.service.UserService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final SkuRepository skuRepository;
    private final CartMapper cartMapper;

    @Qualifier("userService")
    private final UserService authService;

    @Override
    public CartResponse getCurrentCart() {
        Cart cart = getOrCreateCart();
        return cartMapper.toResponse(cart);
    }

    @Override
    public void mergeCart(List<CartItemRequest> guestItems) {
        if (guestItems == null || guestItems.isEmpty()) return;

        for (CartItemRequest guestItem : guestItems) {
            this.addItem(guestItem.getSkuId(), guestItem.getQuantity());
        }
    }


    @Override
    public CartResponse addItem(Long skuId, int quantity) {
        if (quantity <= 0) throw new AppException(ErrorCode.INVALID_QUANTITY);

        Cart cart = getOrCreateCart();
        Sku sku = getSkuOrThrow(skuId);

        // Tìm item đã có trong giỏ
        CartItem item = cartItemRepository
                .findByCartIdAndSkuId(cart.getId(), skuId)
                .orElse(null);

        if (item == null) {
            // Validate trước khi thêm item mới
            validateSku(sku, quantity);

            item = new CartItem();
            item.setSku(sku);
            item.setQuantity(quantity);
            item.setCreatedAt(LocalDateTime.now());
            item.setUpdatedAt(LocalDateTime.now());
            // Sử dụng helper method để add
            cart.addCartItem(item);
        } else {
            // Validate với tổng số lượng mới
            int newQuantity = item.getQuantity() + quantity;
            validateSku(sku, newQuantity);

            item.setQuantity(newQuantity);
            item.setUpdatedAt(LocalDateTime.now());
        }

        // Lưu cart (cascade sẽ lưu item)
        cartRepository.save(cart);

        return cartMapper.toResponse(cart); // Trả về response thay vì null
    }

    @Override
    public CartResponse updateItem(Long skuId, int quantity) {
        Cart cart = getOrCreateCart();

        if (quantity <= 0) {
            removeItem(skuId);
            return getCurrentCart();
        }

        CartItem item = cartItemRepository
                .findByCartIdAndSkuId(cart.getId(), skuId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        // Validate SKU với số lượng mới
        validateSku(item.getSku(), quantity);

        item.setQuantity(quantity);
        item.setUpdatedAt(LocalDateTime.now());

        cartRepository.save(cart);
        return cartMapper.toResponse(cart); // Trả về response thay vì null
    }

    @Override
    public void removeItem(Long skuId) {
        Cart cart = getOrCreateCart();
        cartItemRepository.deleteByCartIdAndSkuId(cart.getId(), skuId);
    }

    @Override
    public void clearCart() {
        Cart cart = getOrCreateCart();
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    /* ================== HELPER METHODS ================== */

    private Cart getOrCreateCart() {
        User user = authService.getCurrentUser();
        if (user == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setCreatedAt(LocalDateTime.now());
                    cart.setUpdatedAt(LocalDateTime.now());
                    return cartRepository.save(cart);
                });
    }

    private Sku getSkuOrThrow(Long skuId) {
        return skuRepository.findById(skuId)
                .orElseThrow(() -> new AppException(ErrorCode.SKU_NOT_FOUND));
    }

    /**
     * Validate SKU trước khi thêm/cập nhật cart item
     * - Check SKU có active không
     * - Check stock có đủ không
     */
    private void validateSku(Sku sku, int quantity) {
        // Check SKU có active không
        Boolean isActive = sku.getIsActive();
        if (isActive == null || !isActive) {
            throw new AppException(ErrorCode.SKU_INACTIVE);
        }

        // Check stock có đủ không
        if (sku.getStock() == null || sku.getStock() < quantity) {
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }
    }
}
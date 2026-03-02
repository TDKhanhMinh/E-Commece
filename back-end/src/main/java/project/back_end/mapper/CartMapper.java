package project.back_end.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import project.back_end.entity.Cart;
import project.back_end.response.CartItemResponse;
import project.back_end.response.CartResponse;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CartMapper {

    private final CartItemMapper cartItemMapper;


    public CartResponse toResponse(Cart cart) {

        List<CartItemResponse> items = cart.getItems().stream()
                .map(cartItemMapper::toResponse)
                .toList();

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal discountTotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItemResponse item : items) {
            BigDecimal qty = BigDecimal.valueOf(item.getQuantity());

            subtotal = subtotal.add(
                    item.getPrice().multiply(qty)
            );

            discountTotal = discountTotal.add(
                    item.getPrice()
                            .subtract(item.getSalePrice())
                            .multiply(qty)
            );

            totalItems += item.getQuantity();
        }

        CartResponse response = new CartResponse();
        response.setItems(items);
        response.setSubtotal(subtotal);
        response.setDiscountTotal(discountTotal);
        response.setTotalPrice(subtotal.subtract(discountTotal));
        response.setTotalItems(totalItems);

        return response;
    }
}


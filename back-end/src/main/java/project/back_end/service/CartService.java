package project.back_end.service;

import org.springframework.stereotype.Service;
import project.back_end.request.CartRequest.CartItemRequest;
import project.back_end.response.CartResponse;

import java.util.List;

@Service
public interface CartService {


    CartResponse addItem(Long skuId, int quantity);

    CartResponse updateItem(Long skuId, int quantity);

    void removeItem(Long skuId);

    void clearCart();

    CartResponse getCurrentCart();

    void mergeCart(List<CartItemRequest> guestItems);
}


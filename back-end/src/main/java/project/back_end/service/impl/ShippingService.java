package project.back_end.service.impl;

import org.springframework.stereotype.Service;
import project.back_end.enumerate.ShippingMethod;

@Service
public class ShippingService {

    private static final double STANDARD_FEE = 0.0;     // Miễn phí
    private static final double EXPRESS_FEE = 30000.0;  // 30k cho hỏa tốc
    private static final double FREESHIP_THRESHOLD = 1000000.0; // Đơn trên 1 triệu freeship hỏa tốc

    public double calculateShippingFee(String method, double orderTotal) {
        try {
            ShippingMethod shippingMethod = ShippingMethod.valueOf(method.toUpperCase());

            return switch (shippingMethod) {
                case EXPRESS -> {
                    if (orderTotal >= FREESHIP_THRESHOLD) {
                        yield 0.0;
                    }
                    yield EXPRESS_FEE;
                }
                default -> STANDARD_FEE;
            };
        } catch (IllegalArgumentException e) {
            return STANDARD_FEE;
        }
    }
}
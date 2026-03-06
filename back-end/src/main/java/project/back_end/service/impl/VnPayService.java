package project.back_end.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import project.back_end.config.VnPayConfig;
import project.back_end.request.PaymentRequest;
import project.back_end.utils.VnPayUtils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@Service
public class VnPayService {

    private final VnPayConfig vnPayConfig;

    public VnPayService(VnPayConfig vnPayConfig) {
        this.vnPayConfig = vnPayConfig;
    }

    public String createPaymentUrl(PaymentRequest paymentRequest, HttpServletRequest request) {

        Map<String, String> params = new HashMap<>();

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnPayConfig.getVnp_TmnCode());

        params.put("vnp_Amount", String.valueOf(paymentRequest.getAmount() * 100));
        params.put("vnp_CurrCode", "VND");

        params.put("vnp_TxnRef", String.valueOf(paymentRequest.getOrderId()));
        params.put("vnp_OrderInfo", "Thanh toan don hang " + paymentRequest.getOrderId());

        params.put("vnp_OrderType", "other");

        params.put("vnp_Locale", "vn");

        params.put("vnp_ReturnUrl", vnPayConfig.getVnp_ReturnUrl() + "/" + paymentRequest.getOrderId());

        params.put("vnp_IpAddr", request.getRemoteAddr());

        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));

        SimpleDateFormat formatter =
                new SimpleDateFormat("yyyyMMddHHmmss");

        params.put("vnp_CreateDate", formatter.format(cal.getTime()));

        String query = VnPayUtils.buildQuery(params);

        String secureHash =
                VnPayUtils.hmacSHA512(
                        vnPayConfig.getVnp_HashSecret(),
                        query
                );

        return vnPayConfig.getVnp_Url()
                + "?"
                + query
                + "&vnp_SecureHash="
                + secureHash;
    }

}
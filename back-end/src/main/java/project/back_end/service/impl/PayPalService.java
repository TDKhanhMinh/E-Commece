package project.back_end.service.impl;


import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import project.back_end.config.PayPalConfig;

import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Slf4j
@Service
public class PayPalService {
    private final PayPalConfig payPalConfig;
    private final RestTemplate restTemplate;

    public PayPalService(PayPalConfig payPalConfig, RestTemplate restTemplate) {
        this.payPalConfig = payPalConfig;
        this.restTemplate = restTemplate;
    }


    /**
     * Lấy Access Token từ PayPal bằng Client ID và Secret
     */
    private String getAccessToken() {
        String url = payPalConfig.getBaseUrl() + "/v1/oauth2/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(payPalConfig.getClientId(), payPalConfig.getClientSecret());
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return (String) response.getBody().get("access_token");
            }
        } catch (Exception e) {
            log.error("Lỗi khi lấy PayPal Access Token: ", e);
        }
        return null;
    }

    /**
     * Tạo Order trên PayPal (Khởi tạo giao dịch)
     */
    public String createOrder(Double amountInUsd) {
        String accessToken = getAccessToken();
        if (accessToken == null) return null;

        String url = payPalConfig.getBaseUrl() + "/v2/checkout/orders";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Xây dựng JSON Body theo chuẩn PayPal v2
        Map<String, Object> amount = new HashMap<>();
        amount.put("currency_code", "USD");
        // Đảm bảo format số tiền luôn có 2 chữ số thập phân (VD: 10.50)
        amount.put("value", String.format(Locale.US, "%.2f", amountInUsd));

        Map<String, Object> purchaseUnit = new HashMap<>();
        purchaseUnit.put("amount", amount);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("intent", "CAPTURE");
        requestBody.put("purchase_units", Collections.singletonList(purchaseUnit));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode() == HttpStatus.CREATED && response.getBody() != null) {
                return (String) response.getBody().get("id");
            }
        } catch (Exception e) {
            log.error("Lỗi khi tạo PayPal Order: ", e);
        }
        return null;
    }

    /**
     * Xác nhận thanh toán sau khi người dùng đồng ý trên popup (Capture Order)
     */
    public boolean captureOrder(String paypalOrderId) {
        String accessToken = getAccessToken();
        if (accessToken == null) return false;

        String url = payPalConfig.getBaseUrl() + "/v2/checkout/orders/" + paypalOrderId + "/capture";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(null, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode() == HttpStatus.CREATED && response.getBody() != null) {
                String status = (String) response.getBody().get("status");
                return "COMPLETED".equals(status); // Thành công nếu status là COMPLETED
            }
        } catch (Exception e) {
            log.error("Lỗi khi capture PayPal Order {}: ", paypalOrderId, e);
        }
        return false;
    }
}
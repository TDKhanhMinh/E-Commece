package project.back_end.config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Setter
@Getter
@Configuration
@ConfigurationProperties(prefix = "vnpay")
public class VnPayConfig {

    private String vnp_TmnCode;
    private String vnp_HashSecret;
    private String vnp_Url;
    private String vnp_ReturnUrl;

}
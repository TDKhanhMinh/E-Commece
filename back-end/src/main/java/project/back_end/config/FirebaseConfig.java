package project.back_end.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initFirebase() {
        try {
            InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("serviceAccountKey.json");

            if (serviceAccount == null) {
                throw new RuntimeException(
                        "LỖI NGHIÊM TRỌNG: Không tìm thấy file serviceAccountKey.json trong thư mục src/main/resources!");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase đã khởi tạo THÀNH CÔNG!");
            }
        } catch (Exception e) {
            throw new RuntimeException("LỖI KHI KHỞI TẠO FIREBASE: " + e.getMessage(), e);
        }
    }
}
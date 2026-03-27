package project.back_end;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import project.back_end.service.UserService;

@SpringBootApplication
public class BackEndApplication {

    public static void main(String[] args) {

        SpringApplication.run(BackEndApplication.class, args);
    }
    @Bean
    CommandLineRunner initDatabase(UserService userService) {
        return args -> {
            System.out.println("Đang kiểm tra Admin...");
            userService.createAdminUserIfNotExist();
            System.out.println("Hoàn tất kiểm tra Admin!");
        };
    }


}

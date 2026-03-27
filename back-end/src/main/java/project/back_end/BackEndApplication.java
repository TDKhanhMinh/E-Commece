package project.back_end;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import project.back_end.service.UserService;

@SpringBootApplication
public class BackEndApplication {
private static UserService userService;
    public static void main(String[] args) {
        userService.createAdminUserIfNotExist();
        SpringApplication.run(BackEndApplication.class, args);
    }

}

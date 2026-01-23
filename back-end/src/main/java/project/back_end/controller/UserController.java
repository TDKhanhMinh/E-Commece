package project.back_end.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.back_end.dto.user.UserDTO;
import project.back_end.request.UserRequest.AddressRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.UserResponse.DeliveryAddressResponse;
import project.back_end.service.UserService.DeliveryAddressService;
import project.back_end.service.UserService.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final DeliveryAddressService deliveryAddressService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        log.info("Fetching profile for user ID: {}", username);
        UserDTO userDTO = userService.getUserProfile(username);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "User profile fetched successfully", userDTO)
        );
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(
                new ApiResponse<>(200, "All users fetched successfully", users)
        );
    }

    @GetMapping("/delivery-addresses")
    public ResponseEntity<ApiResponse<List<DeliveryAddressResponse>>> getUserDeliveryAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        log.info("Fetching delivery addresses for user ID: {}", username);
        List<DeliveryAddressResponse> addresses = deliveryAddressService.getUserDeliveryAddresses(username);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "User delivery addresses fetched successfully", addresses)
        );
    }

    @PostMapping("/delivery-addresses")
    public ResponseEntity<ApiResponse<DeliveryAddressResponse>> addUserDeliveryAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Validated AddressRequest addressRequest) {
        String username = userDetails.getUsername();
        log.info("Adding delivery address for user ID: {}", username);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "User delivery address added successfully", deliveryAddressService.addUserDeliveryAddress(username, addressRequest))
        );
    }

    @DeleteMapping("/delivery-addresses/{id}")
    public ResponseEntity<ApiResponse<?>> deleteUserDeliveryAddress(@PathVariable Long id) {
        log.info("Deleting delivery address with ID: {}", id);
        Boolean isDeleted = deliveryAddressService.deleteUserDeliveryAddress(id);
        if (!isDeleted) {
            return ResponseEntity.status(404).body(
                    new ApiResponse<>(404, "User delivery address not found", false)
            );

        }
        return ResponseEntity.ok(
                new ApiResponse<>(200, "User delivery address deleted successfully", true)
        );
    }
}

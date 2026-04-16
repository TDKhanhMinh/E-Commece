package project.back_end.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.back_end.dto.user.UserDTO;
import project.back_end.request.UserRequest.AddressRequest;
import project.back_end.request.UserRequest.UpdateUserRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.UserResponse.DeliveryAddressResponse;
import project.back_end.response.UserResponse.UserResponse;
import project.back_end.service.DeliveryAddressService;
import project.back_end.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
        private final UserService userService;
        private final DeliveryAddressService deliveryAddressService;

        @GetMapping("/profile")
        public ResponseEntity<ApiResponse<UserDTO>> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
                String username = userDetails.getUsername();
                log.info("Fetching profile for user ID: {}", username);
                UserDTO userDTO = userService.getUserProfile(username);
                return ResponseEntity.ok(
                                new ApiResponse<>(200, "User profile fetched successfully", userDTO));
        }

        @PutMapping("/profile")
        public ResponseEntity<ApiResponse<UserDTO>> updateUserProfile(
                        @AuthenticationPrincipal UserDetails userDetails,
                        @RequestBody @Validated UpdateUserRequest updateUserRequest) {
                String username = userDetails.getUsername();
                log.info("Updating profile for user ID: {}", username);
                UserDTO updatedUser = userService.updateUser(updateUserRequest, username);
                return ResponseEntity.ok(
                                new ApiResponse<>(200, "User profile updated successfully", updatedUser));
        }

        @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        @GetMapping("/all")
        public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(@RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "id", required = false) String sortBy,
                        @RequestParam(defaultValue = "asc") String sortDir,
                        @RequestParam(required = false) String searchQuery) {
                {
                        Page<UserResponse> users = userService.getAllUsers(page, size, sortBy, sortDir, searchQuery);
                        return ResponseEntity.ok(
                                        new ApiResponse<>(200, "All users fetched successfully", users));
                }
        }

        @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long id) {
                log.info("Deleting user with ID: {}", id);
                userService.deleteUser(id);
                return ResponseEntity.ok(
                                new ApiResponse<>(200, "User deleted successfully", true));
        }

        @GetMapping("/delivery-addresses")
        public ResponseEntity<ApiResponse<List<DeliveryAddressResponse>>> getUserDeliveryAddresses(
                        @AuthenticationPrincipal UserDetails userDetails) {
                String username = userDetails.getUsername();
                log.info("Fetching delivery addresses for user ID: {}", username);
                List<DeliveryAddressResponse> addresses = deliveryAddressService.getUserDeliveryAddresses(username);
                return ResponseEntity.ok(
                                new ApiResponse<>(200, "User delivery addresses fetched successfully", addresses));
        }

        @PostMapping("/delivery-addresses")
        public ResponseEntity<ApiResponse<DeliveryAddressResponse>> addUserDeliveryAddress(
                        @AuthenticationPrincipal UserDetails userDetails,
                        @RequestBody @Validated AddressRequest addressRequest) {
                String username = userDetails.getUsername();
                log.info("Adding delivery address for user ID: {}", username);
                log.info("Address details: location={}, userName={}, phoneNumber={}, latitude={}, longitude={}",
                                addressRequest.getLocation(), addressRequest.getUserName(),
                                addressRequest.getPhoneNumber(),
                                addressRequest.getLatitude(), addressRequest.getLongitude());
                return ResponseEntity.ok(
                                new ApiResponse<>(200, "User delivery address added successfully",
                                                deliveryAddressService.addUserDeliveryAddress(username,
                                                                addressRequest)));
        }

        @PutMapping("/delivery-addresses/{id}")
        public ResponseEntity<ApiResponse<DeliveryAddressResponse>> updateUserDeliveryAddress(
                        @PathVariable Long id,
                        @AuthenticationPrincipal UserDetails userDetails,
                        @RequestBody @Validated AddressRequest addressRequest) {
                String username = userDetails.getUsername();
                log.info("Updating delivery address with ID: {} for user ID: {}", id, username);
                DeliveryAddressResponse updatedAddress = deliveryAddressService.updateUserDeliveryAddress(id, username,
                                addressRequest);
                return ResponseEntity.ok(
                                new ApiResponse<>(200, "User delivery address updated successfully", updatedAddress));
        }

        @DeleteMapping("/delivery-addresses/{id}")
        public ResponseEntity<ApiResponse<?>> deleteUserDeliveryAddress(@PathVariable Long id) {
                log.info("Deleting delivery address with ID: {}", id);
                Boolean isDeleted = deliveryAddressService.deleteUserDeliveryAddress(id);
                if (!isDeleted) {
                        return ResponseEntity.status(404).body(
                                        new ApiResponse<>(404, "User delivery address not found", false));
                }
                return ResponseEntity.ok(
                                new ApiResponse<>(200, "User delivery address deleted successfully", true));
        }
}

package project.back_end.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    /* =========================
     * AUTH / SECURITY
     * ========================= */
    UNAUTHORIZED(401, "Authentication is required to access this resource"),
    BAD_CREDENTIALS(401, "Username or password is incorrect"),
    ACCOUNT_LOCKED(401, "This account has been locked"),
    ACCOUNT_DISABLED(401, "This account is disabled"),
    ACCOUNT_EXPIRED(401, "This account has expired"),

    FORBIDDEN(403, "You do not have permission to perform this action"),
    USER_INACTIVE(403, "This user account is inactive"),
    EMAIL_ALREADY_EXISTS(409, "This email address is already registered"),

    /* =========================
     * USER / ACCOUNT
     * ========================= */
    USER_NOT_FOUND(404, "User was not found"),
    ACCOUNT_NOT_FOUND(404, "Account was not found"),

    PASSWORD_MISMATCH(400, "The current password is incorrect"),
    SAME_PASSWORD(400, "The new password must be different from the current password"),

    /* =========================
     * PRODUCT / CATALOG
     * ========================= */
    PRODUCT_NOT_FOUND(404, "Product was not found"),
    CATEGORY_NOT_FOUND(404, "Category was not found"),
    BRAND_NOT_FOUND(404, "Brand was not found"),
    ATTRIBUTE_NOT_FOUND(404, "Attribute was not found"),
    ATTRIBUTE_EXISTED(409, "Attribute code already exists"),
    DUPLICATE_ATTRIBUTE(400, "Duplicate attribute in SKU attributes"),
    INVALID_ATTRIBUTE_VALUE(400, "Invalid attribute value for the given attribute"),

    /* =========================
     * SKU
     * ========================= */
    SKU_NOT_FOUND(404, "SKU was not found"),
    SKU_CODE_EXISTS(409, "SKU code already exists"),
    SKU_INACTIVE(400, "SKU is not active or available for purchase"),
    OUT_OF_STOCK(400, "SKU is out of stock or insufficient quantity available"),
    TOO_MANY_SKU(400, "Too many SKUs for the product. Maximum allowed is 50"),
    SKU_NOT_BELONG_TO_PRODUCT(400, "The SKU does not belong to the specified product"),

    /* =========================
     * CART / ORDER
     * ========================= */
    CART_ITEM_NOT_FOUND(404, "Cart item was not found"),
    ORDER_NOT_FOUND(404, "Order was not found"),
    DELIVERY_ADDRESS_NOT_FOUND(404, "Delivery address was not found"),
    INVALID_QUANTITY(400, "Quantity must be greater than zero"),
    INSUFFICIENT_STOCK(400, "Insufficient stock for the requested SKU"),

    /* =========================
     * PAYMENT
     * ========================= */
    PAYMENT_FAILED(402, "Payment processing failed. Please try again"),

    /* =========================
     * OTP / EMAIL
     * ========================= */
    INVALID_OTP(400, "The OTP code is invalid"),
    OTP_EXPIRED(400, "The OTP code has expired"),
    EMAIL_NOT_SENT(500, "Failed to send email. Please try again later"),
    /* =========================
     * FILE / IMAGE UPLOAD
     * ========================= */
    INVALID_FILE(400, "Uploaded file is invalid"),
    FILE_TOO_LARGE(400, "File size exceeds the allowed limit"),
    UNSUPPORTED_FILE_TYPE(400, "Unsupported file type"),
    IMAGE_UPLOAD_FAILED(500, "Failed to upload image"),
    IMAGE_DELETE_FAILED(500, "Failed to delete image"),

    /* =========================
     * COMMON / SYSTEM
     * ========================= */
    INVALID_REQUEST(400, "The request parameters are invalid"),
    RESOURCE_CONFLICT(409, "The resource already exists or is in conflict"),
    RESOURCE_NOT_FOUND(404, "The requested resource was not found"),

    UNKNOWN_ERROR(500, "An unexpected error occurred. Please try again later");

    private final int code;
    private final String message;
}

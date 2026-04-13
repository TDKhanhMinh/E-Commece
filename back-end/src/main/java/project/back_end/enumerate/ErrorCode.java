package project.back_end.enumerate;

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
    USER_ALREADY_EXISTS(409, "A user with this email already exists"),
    USER_NOT_SHIPPER(400, "The user is not a shipper or does not have a shipper profile"),

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
    INVALID_STATUS_TRANSITION(400, "Invalid status transition for the product"),
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
     * VOUCHER / PROMOTION
     * ========================= */
    VOUCHER_NOT_FOUND(404, "Voucher was not found"),
    VOUCHER_EXPIRED(400, "Voucher is expired"),
    MIN_ORDER_NOT_MET(400, "Order amount does not meet the minimum required for this voucher"),
    VOUCHER_NOT_AVAILABLE(400, "Voucher is not available for this user or has already been used"),
    VOUCHER_ALREADY_OWNED(409, "User has already collected this voucher"),
    VOUCHER_NOT_IN_WALLET(400, "User does not have this voucher in their wallet"),
    VOUCHER_USAGE_LIMIT_REACHED(400, "This voucher has reached its usage limit"),
    VOUCHER_MAX_DISCOUNT_EXCEEDED(400, "The discount amount exceeds the maximum allowed for this voucher"),
    VOUCHER_INVALID_DISCOUNT_TYPE(400, "Invalid discount type for this voucher"),
    VOUCHER_INVALID(400, "The voucher code is invalid or cannot be applied"),
    VOUCHER_NOT_APPLICABLE(400, "This voucher cannot be applied to the current order"),
    VOUCHER_ALREADY_USED(400, "This voucher has already been used by the user"),
    VOUCHER_NOT_OWNED(400, "User does not own this voucher"),
    VOUCHER_INACTIVE(400, "This voucher is not active or has been deactivated"),
    VOUCHER_USAGE_LIMIT_PER_USER_REACHED(400, "You have reached the usage limit for this voucher"),
    VOUCHER_NOT_YET_ACTIVE(400, "This voucher is not yet active. Please wait until the start date"),
    VOUCHER_EXPIRED_FOR_USER(400, "This voucher has expired for you and can no longer be used"),
    VOUCHER_INVALID_FOR_ORDER(400, "This voucher cannot be applied to your current order. Please check the conditions and try again"),
    VOUCHER_ALREADY_COLLECTED(400, "You have already collected this voucher. Please check your voucher wallet"),
    VOUCHER_NOT_COLLECTIBLE(400, "This voucher cannot be collected at this time. Please check the conditions and try again"),
    VOUCHER_ALREADY_EXISTS(409, "A voucher with this code already exists. Please choose a different code"),


    /* =========================
     * POINTS / REWARD
     * ========================= */
    INSUFFICIENT_POINTS(400, "You do not have enough points to redeem this reward"),


    /* =========================
     * REVIEW / RATING
     * ========================= */
    REVIEW_NOT_FOUND(404, "Review was not found"),
    REVIEW_PERMISSION_DENIED(403, "You do not have permission to delete this review"),

    /* =========================
     * DELIVERY / SHIPPER
     * ========================= */
    DELIVERY_NOT_FOUND(404, "Delivery was not found"),
    SHIPPER_PROFILE_ALREADY_EXISTS(409, "Shipper profile already exists for this user"),
    SHIPPER_PROFILE_NOT_FOUND(404, "Shipper profile was not found"),
    INVALID_DELIVERY_STATUS(400, "Invalid delivery status. Allowed values are PENDING ,PICKED_UP,DELIVERING, SUCCESS,CANCELLED "),
    DELIVERY_ALREADY_ACCEPTED(400, "This delivery has already been accepted by another shipper"),
    PROOF_IMAGE_REQUIRED(400, "Proof image is required when marking delivery as SUCCESS"),
    /* =========================
     * CHAT / MESSAGING
     * ========================= */
    CHAT_ROOM_NOT_FOUND(404, "Chat room was not found"),
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

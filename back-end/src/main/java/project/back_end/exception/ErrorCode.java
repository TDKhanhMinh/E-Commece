package project.back_end.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(404, "User not found"),
    UNKNOWN_ERROR(500, "Unknown error occurred"),
    USER_INACTIVE(403, "User account is inactive"),
    UNAUTHORIZED(401, "Unauthorized access"),
    FORBIDDEN(403, "Forbidden access"),
    EMAIL_ALREADY_EXISTS(403, "Email already exists"),
    BAD_CREDENTIALS(401, "Invalid username or password"),
    ACCOUNT_LOCKED(401, "Account is locked"),
    ACCOUNT_DISABLED(401, "Account is disabled"),
    ACCOUNT_EXPIRED(401, "Account has expired"),
    ACCOUNT_NOT_FOUND(404, "Account not found"),
    INVALIDATE(400, "Invalid request");
    private final int code;
    private final String message;


}

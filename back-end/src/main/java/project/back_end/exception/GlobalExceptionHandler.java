package project.back_end.exception;

import org.springframework.data.core.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import project.back_end.response.ApiResponse;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Map<Class<? extends AuthenticationException>, ErrorCode> ERROR_MAP = new HashMap<>();

    static {
        ERROR_MAP.put(BadCredentialsException.class, ErrorCode.BAD_CREDENTIALS);
        ERROR_MAP.put(LockedException.class, ErrorCode.ACCOUNT_LOCKED);
        ERROR_MAP.put(DisabledException.class, ErrorCode.ACCOUNT_DISABLED);
        ERROR_MAP.put(AccountExpiredException.class, ErrorCode.ACCOUNT_EXPIRED);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<?>> handleAuthentication(AuthenticationException e) {
        ErrorCode errorCode = ERROR_MAP.getOrDefault(e.getClass(), ErrorCode.UNAUTHORIZED);

        return buildErrorResponse(errorCode, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<?>> handleAccessDenied(AccessDeniedException e) {
        return buildErrorResponse(ErrorCode.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<?>> handleAppException(AppException e) {
        return buildErrorResponse(e.getErrorCode(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidation(MethodArgumentNotValidException ex) {
        String errorMessage = Objects.requireNonNull(ex.getBindingResult().getFieldError()).getDefaultMessage();

        return ResponseEntity
                .badRequest()
                .body(new ApiResponse(400, errorMessage, null));
    }

    @ExceptionHandler(PropertyReferenceException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(PropertyReferenceException e) {
        ApiResponse<?> response = ApiResponse.builder()
                .statusCode(ErrorCode.INVALIDATE.getCode())
                .message("Invalid sort key: " + e.getPropertyName())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    private ResponseEntity<ApiResponse<?>> buildErrorResponse(
            ErrorCode errorCode,
            HttpStatus status
    ) {
        ApiResponse<?> response = ApiResponse.builder()
                .statusCode(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(status).body(response);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleAll(Exception e) {
        return buildErrorResponse(
                ErrorCode.UNKNOWN_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

}

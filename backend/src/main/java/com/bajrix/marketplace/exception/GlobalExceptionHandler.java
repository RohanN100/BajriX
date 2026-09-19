package com.bajrix.marketplace.exception;

import com.bajrix.marketplace.dto.ErrorResponseDTO;
import jakarta.persistence.OptimisticLockException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, "Resource Not Found", ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(DuplicateListingException.class)
    public ResponseEntity<ErrorResponseDTO> handleDuplicateListing(
            DuplicateListingException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.CONFLICT, "Duplicate Listing", ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler({
            OptimisticLockConflictException.class,
            OptimisticLockException.class,
            ObjectOptimisticLockingFailureException.class,
            OptimisticLockingFailureException.class
    })
    public ResponseEntity<ErrorResponseDTO> handleConcurrencyConflict(
            Exception ex, HttpServletRequest request) {
        String msg = "The listing was modified by another transaction. Please reload and try again.";
        if (ex instanceof OptimisticLockConflictException) {
            msg = ex.getMessage();
        }
        return buildResponse(HttpStatus.CONFLICT, "Concurrency Conflict", msg, request.getRequestURI(), null);
    }

    @ExceptionHandler(UnauthorizedSellerAccessException.class)
    public ResponseEntity<ErrorResponseDTO> handleUnauthorizedAccess(
            UnauthorizedSellerAccessException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.FORBIDDEN, "Access Denied", ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(SellerNotApprovedException.class)
    public ResponseEntity<ErrorResponseDTO> handleSellerNotApproved(
            SellerNotApprovedException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.FORBIDDEN, "Seller Not Approved", ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidOperation(
            InvalidOperationException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Invalid Operation", ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation Failed", "One or more input fields are invalid.", request.getRequestURI(), errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGenericException(
            Exception ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex.getMessage(), request.getRequestURI(), null);
    }

    private ResponseEntity<ErrorResponseDTO> buildResponse(
            HttpStatus status, String error, String message, String path, Map<String, String> fieldErrors) {
        ErrorResponseDTO dto = ErrorResponseDTO.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error(error)
                .message(message)
                .path(path)
                .fieldErrors(fieldErrors)
                .build();
        return new ResponseEntity<>(dto, status);
    }
}

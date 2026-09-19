package com.bajrix.marketplace.exception;

public class UnauthorizedSellerAccessException extends RuntimeException {
    public UnauthorizedSellerAccessException(String message) {
        super(message);
    }
}

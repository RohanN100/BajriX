package com.bajrix.marketplace.exception;

public class SellerNotApprovedException extends RuntimeException {
    public SellerNotApprovedException(String message) {
        super(message);
    }
}

package com.bajrix.marketplace.exception;

public class OptimisticLockConflictException extends RuntimeException {
    public OptimisticLockConflictException(String message) {
        super(message);
    }
}

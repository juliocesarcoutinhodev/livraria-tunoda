package br.com.iraquitantunoda.livrariatunoda.domain.exception;

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}

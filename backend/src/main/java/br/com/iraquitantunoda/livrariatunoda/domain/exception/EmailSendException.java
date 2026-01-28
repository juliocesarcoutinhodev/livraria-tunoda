package br.com.iraquitantunoda.livrariatunoda.domain.exception;

public class EmailSendException extends RuntimeException {
    public EmailSendException(String message, Throwable cause) {
        super(message, cause);
    }
}

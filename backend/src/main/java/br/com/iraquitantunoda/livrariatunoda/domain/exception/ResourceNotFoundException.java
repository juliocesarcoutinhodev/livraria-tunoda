package br.com.iraquitantunoda.livrariatunoda.domain.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s with ID %d not found.", resource, id));
    }
}

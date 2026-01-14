package br.com.iraquitantunoda.livrariatunoda.infrastructure.exception;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {

        log.warn("Recurso não encontrado: {} - Path: {}", ex.getMessage(), request.getRequestURI());

        var error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(
            BusinessException ex, HttpServletRequest request) {

        log.warn("Erro de negócio: {} - Path: {}", ex.getMessage(), request.getRequestURI());

        var error = new ErrorResponse(
                HttpStatus.UNPROCESSABLE_ENTITY.value(),
                "Unprocessable Entity",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        List<ValidationError> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(field -> new ValidationError(field.getField(), field.getDefaultMessage()))
                .toList();

        log.warn("Erro de validação - Path: {} - Erros: {}", request.getRequestURI(), errors);

        var error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                "Erro de validação",
                request.getRequestURI(),
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex, HttpServletRequest request) {

        List<ValidationError> errors = ex.getConstraintViolations().stream()
                .map(v -> new ValidationError(v.getPropertyPath().toString(), v.getMessage()))
                .toList();

        log.warn("Erro de constraint violation - Path: {} - Erros: {}", request.getRequestURI(), errors);

        var error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                "Erro de validação",
                request.getRequestURI(),
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, HttpServletRequest request) {
        String message = getDuplicateError(ex);

        log.warn("Erro de integridade de dados: {} - Path: {}", message, request.getRequestURI());

        var error = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "Conflict",
                message,
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(
            Exception ex, HttpServletRequest request) {

        log.error("Erro interno do servidor: {} - Path: {}", ex.getMessage(), request.getRequestURI(), ex);

        var error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "Erro interno do servidor",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    private static @NonNull String getDuplicateError(DataIntegrityViolationException ex) {
        String message = "Erro de integridade de dados";

        // Extrair mensagem mais amigável baseada na constraint violada
        String exceptionMessage = ex.getMessage();

        if (exceptionMessage != null) {
            if (exceptionMessage.contains("uk_books_isbn") || exceptionMessage.contains("Duplicate entry") && exceptionMessage.contains("isbn")) {
                message = "ISBN já cadastrado no sistema";
            } else if (exceptionMessage.contains("Duplicate entry")) {
                message = "Registro duplicado no sistema";
            } else if (exceptionMessage.contains("foreign key constraint")) {
                message = "Não é possível realizar esta operação devido a dependências existentes";
            }
        }
        return message;
    }
}
package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.exception;

/**
 * Exceção para erros de integração com o Mercado Pago.
 */
public class MercadoPagoException extends RuntimeException {

    public MercadoPagoException(String message) {
        super(message);
    }

    public MercadoPagoException(String message, Throwable cause) {
        super(message, cause);
    }
}


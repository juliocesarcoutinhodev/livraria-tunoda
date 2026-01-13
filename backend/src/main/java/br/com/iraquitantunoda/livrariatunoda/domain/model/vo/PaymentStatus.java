package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

public enum PaymentStatus {

    // Pagamento criado, aguardando processamento
    CREATED,

    // Pagamento em processamento no gateway
    PENDING,

    // Pagamento aprovado
    APPROVED,

    // Pagamento rejeitado
    REJECTED,

    // Pagamento cancelado
    CANCELLED,

    // Pagamento expirado
    EXPIRED
}


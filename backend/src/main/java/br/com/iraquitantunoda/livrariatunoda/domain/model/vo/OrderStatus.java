package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

public enum OrderStatus {

    // Pedido criado, aguardando próximos passos (pagamento, confirmação)
    PENDING,

    // Pedido confirmado (pagamento aprovado)
    CONFIRMED,

    // Pedido em processamento/preparação
    PROCESSING,

    // Pedido enviado para entrega
    SHIPPED,

    // Pedido entregue ao cliente
    DELIVERED,

    // Pedido cancelado
    CANCELLED
}


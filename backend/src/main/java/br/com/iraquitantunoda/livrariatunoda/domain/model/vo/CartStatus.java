package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

public enum CartStatus {
    // Carrinho em uso, pode ser modificado
    ACTIVE,

    // Carrinho expirado, não pode mais ser modificado
    EXPIRED,

    // Carrinho já convertido em pedido, não pode mais ser modificado
    CONVERTED
}


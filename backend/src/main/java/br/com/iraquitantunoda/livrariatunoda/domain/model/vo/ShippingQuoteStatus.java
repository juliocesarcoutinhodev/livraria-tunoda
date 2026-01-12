package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

public enum ShippingQuoteStatus {

    // Cotação criada, aguardando seleção
    CREATED,

    // Cotação com serviço selecionado
    SELECTED,

    // Cotação expirada, não pode ser reutilizada
    EXPIRED
}


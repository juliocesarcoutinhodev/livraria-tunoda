package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

public enum ShippingQuoteStatus {

    // Cotação criada, aguardando cálculo
    CREATED,

    // Cotação com opções calculadas pelo provedor
    CALCULATED,

    // Cotação com serviço selecionado
    SELECTED,

    // Cotação expirada, não pode ser reutilizada
    EXPIRED
}


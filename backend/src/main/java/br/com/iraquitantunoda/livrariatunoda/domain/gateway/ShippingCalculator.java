package br.com.iraquitantunoda.livrariatunoda.domain.gateway;

import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuote;

/**
 * Porta de saída para cálculo de frete.
 * Implementação específica fica na camada de infraestrutura.
 */
public interface ShippingCalculator {

    /**
     * Calcula opções de frete e atualiza a cotação.
     * Busca opções em provedores externos (ex: Melhor Envio).
     *
     * @param quote Cotação a ser calculada
     * @return Cotação atualizada com opções calculadas
     */
    ShippingQuote calculate(ShippingQuote quote);
}


package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateStockRequest(
    @NotNull(message = "Operação é obrigatória")
    StockOperation operation,

    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser positiva")
    Integer quantity,

    String reason
) {
    public enum StockOperation {
        ADD,      // Adicionar ao estoque
        REMOVE,   // Remover do estoque
        SET       // Definir estoque absoluto
    }
}

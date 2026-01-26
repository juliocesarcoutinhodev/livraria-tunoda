package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingOption;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingQuoteStatus;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Getter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ShippingQuote {

    @EqualsAndHashCode.Include
    private final ShippingQuoteId id;
    private final CartId cartId;
    private final String toPostalCode;
    private final List<ShippingItem> items;
    private final List<ShippingOption> options;
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt;
    private ShippingQuoteStatus status;
    private String selectedServiceCode;

    private ShippingQuote(ShippingQuoteId id, CartId cartId, String toPostalCode, List<ShippingItem> items, List<ShippingOption> options,
                          LocalDateTime createdAt, LocalDateTime expiresAt, ShippingQuoteStatus status, String selectedServiceCode) {
        validateItems(items);
        validateOptions(options);
        validateCartId(cartId);
        validateToPostalCode(toPostalCode);

        this.id = id;
        this.cartId = cartId;
        this.toPostalCode = toPostalCode;
        this.items = new ArrayList<>(items);
        this.options = new ArrayList<>(options);
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.status = status;
        this.selectedServiceCode = selectedServiceCode;
    }

    public static ShippingQuote create(CartId cartId, String toPostalCode, List<ShippingItem> items, List<ShippingOption> options) {
        var now = LocalDateTime.now();
        var expiresAt = now.plusHours(24);

        return new ShippingQuote(
            ShippingQuoteId.generate(),
            cartId,
            toPostalCode,
            items,
            options,
            now,
            expiresAt,
            ShippingQuoteStatus.CREATED,
            null
        );
    }

    public static ShippingQuote reconstitute(ShippingQuoteId id, CartId cartId, String toPostalCode, List<ShippingItem> items,
                                             List<ShippingOption> options, LocalDateTime createdAt,
                                             LocalDateTime expiresAt, ShippingQuoteStatus status, String selectedServiceCode) {
        return new ShippingQuote(id, cartId, toPostalCode, items, options, createdAt, expiresAt, status, selectedServiceCode);
    }

    public void selectOption(String serviceCode) {
        if (isExpired()) {
            throw new BusinessException("Cotação expirada não pode ter opção selecionada");
        }
        if (status != ShippingQuoteStatus.CALCULATED
            && status != ShippingQuoteStatus.CREATED
            && status != ShippingQuoteStatus.SELECTED) {
            throw new BusinessException("Cotação deve estar calculada para selecionar opção");
        }
        if (!hasOption(serviceCode)) {
            throw new BusinessException("Serviço não encontrado nas opções disponíveis");
        }

        this.selectedServiceCode = serviceCode;
        this.status = ShippingQuoteStatus.SELECTED;
    }

    public void expire() {
        if (status == ShippingQuoteStatus.SELECTED) {
            throw new BusinessException("Cotação selecionada não pode ser expirada");
        }
        this.status = ShippingQuoteStatus.EXPIRED;
    }

    public void updateCalculatedOptions(List<ShippingOption> calculatedOptions) {
        if (status != ShippingQuoteStatus.CREATED) {
            throw new BusinessException("Apenas cotações com status CREATED podem ser calculadas");
        }
        if (calculatedOptions == null || calculatedOptions.isEmpty()) {
            throw new BusinessException("Opções calculadas não podem estar vazias");
        }

        this.options.clear();
        this.options.addAll(calculatedOptions);
        this.status = ShippingQuoteStatus.CALCULATED;
    }

    public boolean isExpired() {
        return status == ShippingQuoteStatus.EXPIRED || LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isSelected() {
        return status == ShippingQuoteStatus.SELECTED;
    }

    public boolean isCreated() {
        return status == ShippingQuoteStatus.CREATED;
    }

    public boolean isCalculated() {
        return status == ShippingQuoteStatus.CALCULATED;
    }

    public ShippingOption getSelectedOption() {
        if (selectedServiceCode == null) {
            return null;
        }
        return options.stream()
            .filter(option -> option.getServiceCode().equals(selectedServiceCode))
            .findFirst()
            .orElse(null);
    }

    /**
     * Valida se a cotação está apta para ser usada em um pedido.
     * Será usado futuramente no Epic de Pedido para garantir consistência no checkout.
     */
    public void validateForOrder() {
        if (!isSelected()) {
            throw new BusinessException("Cotação deve ter uma opção de frete selecionada para criar pedido");
        }

        if (isExpired()) {
            throw new BusinessException("Cotação expirada não pode ser usada para criar pedido");
        }

        if (selectedServiceCode == null) {
            throw new BusinessException("Código do serviço selecionado é obrigatório");
        }

        var selectedOption = getSelectedOption();
        if (selectedOption == null) {
            throw new BusinessException("Opção de frete selecionada não encontrada");
        }

        if (items.isEmpty()) {
            throw new BusinessException("Cotação sem itens não pode ser usada para pedido");
        }

        if (options.isEmpty()) {
            throw new BusinessException("Cotação sem opções de frete não pode ser usada para pedido");
        }
    }

    private boolean hasOption(String serviceCode) {
        return options.stream()
            .anyMatch(option -> option.getServiceCode().equals(serviceCode));
    }

    private static void validateCartId(CartId cartId) {
        if (cartId == null) {
            throw new BusinessException("CartId é obrigatório para cotação de frete");
        }
    }

    private static void validateToPostalCode(String toPostalCode) {
        if (toPostalCode == null || toPostalCode.isBlank()) {
            throw new BusinessException("CEP de destino é obrigatório");
        }
        // Remove hífen e valida se tem 8 dígitos
        var cleanCep = toPostalCode.replace("-", "");
        if (!cleanCep.matches("\\d{8}")) {
            throw new BusinessException("CEP de destino inválido. Use o formato: 00000-000 ou 00000000");
        }
    }

    private static void validateItems(List<ShippingItem> items) {
        if (items == null || items.isEmpty()) {
            throw new BusinessException("Cotação deve ter ao menos um item");
        }
    }

    private static void validateOptions(List<ShippingOption> options) {
        if (options == null || options.isEmpty()) {
            throw new BusinessException("Cotação deve ter ao menos uma opção de frete");
        }
    }

    // Sobrescreve getter do Lombok para retornar lista imutável
    public List<ShippingItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    // Sobrescreve getter do Lombok para retornar lista imutável
    public List<ShippingOption> getOptions() {
        return Collections.unmodifiableList(options);
    }
}

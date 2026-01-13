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
    private final List<ShippingItem> items;
    private final List<ShippingOption> options;
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt;
    private ShippingQuoteStatus status;
    private String selectedServiceCode;

    private ShippingQuote(ShippingQuoteId id, CartId cartId, List<ShippingItem> items, List<ShippingOption> options,
                          LocalDateTime createdAt, LocalDateTime expiresAt, ShippingQuoteStatus status, String selectedServiceCode) {
        validateItems(items);
        validateOptions(options);
        validateCartId(cartId);

        this.id = id;
        this.cartId = cartId;
        this.items = new ArrayList<>(items);
        this.options = new ArrayList<>(options);
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.status = status;
        this.selectedServiceCode = selectedServiceCode;
    }

    public static ShippingQuote create(CartId cartId, List<ShippingItem> items, List<ShippingOption> options) {
        var now = LocalDateTime.now();
        var expiresAt = now.plusHours(24);

        return new ShippingQuote(
            ShippingQuoteId.generate(),
            cartId,
            items,
            options,
            now,
            expiresAt,
            ShippingQuoteStatus.CREATED,
            null
        );
    }

    public static ShippingQuote reconstitute(ShippingQuoteId id, CartId cartId, List<ShippingItem> items,
                                             List<ShippingOption> options, LocalDateTime createdAt,
                                             LocalDateTime expiresAt, ShippingQuoteStatus status, String selectedServiceCode) {
        return new ShippingQuote(id, cartId, items, options, createdAt, expiresAt, status, selectedServiceCode);
    }

    public void selectOption(String serviceCode) {
        if (isExpired()) {
            throw new BusinessException("Cotação expirada não pode ter opção selecionada");
        }
        if (status == ShippingQuoteStatus.SELECTED) {
            throw new BusinessException("Cotação já possui opção selecionada e não pode ser alterada");
        }
        if (status != ShippingQuoteStatus.CALCULATED && status != ShippingQuoteStatus.CREATED) {
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

    private boolean hasOption(String serviceCode) {
        return options.stream()
            .anyMatch(option -> option.getServiceCode().equals(serviceCode));
    }

    private static void validateCartId(CartId cartId) {
        if (cartId == null) {
            throw new BusinessException("CartId é obrigatório para cotação de frete");
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


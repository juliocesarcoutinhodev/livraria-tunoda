package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingItemResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingOptionResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingQuoteResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuote;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingOption;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ShippingQuoteDTOMapper {

    public ShippingQuoteResponse toResponse(ShippingQuote quote) {
        return new ShippingQuoteResponse(
                quote.getId().getValue(),
                quote.getCartId().getValue(),
                quote.getToPostalCode(),
                quote.getStatus(),
                quote.getCreatedAt(),
                quote.getExpiresAt(),
                toItemResponses(quote.getItems()),
                toOptionResponses(quote.getOptions()),
                quote.getSelectedServiceCode()
        );
    }

    private List<ShippingItemResponse> toItemResponses(List<ShippingItem> items) {
        return items.stream()
                .map(this::toItemResponse)
                .toList();
    }

    private ShippingItemResponse toItemResponse(ShippingItem item) {
        return new ShippingItemResponse(
            item.getBookId().getValue(),
            item.getBookTitle(),
            item.getQuantity(),
            item.getWeight().getValue(),
            item.getWeight().getUnit().name(),
            item.getUnitPrice().getAmount(),
            item.getUnitPrice().getCurrency()
        );
    }

    private List<ShippingOptionResponse> toOptionResponses(List<ShippingOption> options) {
        return options.stream()
                .map(this::toOptionResponse)
                .toList();
    }

    private ShippingOptionResponse toOptionResponse(ShippingOption option) {
        return new ShippingOptionResponse(
            option.getCompany(),
            option.getServiceCode(),
            option.getServiceName(),
            option.getPrice().getAmount(),
            option.getPrice().getCurrency(),
            option.getDeliveryDays(),
            option.getExternalReference()
        );
    }
}


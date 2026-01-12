package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@EqualsAndHashCode
public class ShippingOption {

    private final String serviceCode;
    private final String serviceName;
    private final Money price;
    private final int deliveryDays;
    private final String company;
    private final String externalReference;

    private ShippingOption(String serviceCode, String serviceName, Money price, int deliveryDays, String company, String externalReference) {
        this.serviceCode = serviceCode;
        this.serviceName = serviceName;
        this.price = price;
        this.deliveryDays = deliveryDays;
        this.company = company;
        this.externalReference = externalReference;
    }

    public static ShippingOption create(String serviceCode, String serviceName, Money price, int deliveryDays, String company, String externalReference) {
        validate(serviceCode, serviceName, price, deliveryDays, company, externalReference);
        return new ShippingOption(serviceCode, serviceName, price, deliveryDays, company, externalReference);
    }

    private static void validate(String serviceCode, String serviceName, Money price, int deliveryDays, String company, String externalReference) {
        if (serviceCode == null || serviceCode.isBlank()) {
            throw new BusinessException("Código do serviço é obrigatório");
        }
        if (serviceName == null || serviceName.isBlank()) {
            throw new BusinessException("Nome do serviço é obrigatório");
        }
        if (price == null) {
            throw new BusinessException("Preço do frete é obrigatório");
        }
        if (deliveryDays <= 0) {
            throw new BusinessException("Prazo de entrega deve ser maior que zero");
        }
        if (company == null || company.isBlank()) {
            throw new BusinessException("Transportadora é obrigatória");
        }
        if (externalReference == null || externalReference.isBlank()) {
            throw new BusinessException("Referência externa é obrigatória");
        }
    }
}


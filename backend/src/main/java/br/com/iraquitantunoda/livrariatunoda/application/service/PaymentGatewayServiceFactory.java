package br.com.iraquitantunoda.livrariatunoda.application.service;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentGateway;
import br.com.iraquitantunoda.livrariatunoda.domain.service.PaymentGatewayService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Factory que seleciona a implementação correta do PaymentGatewayService.
 * Permite trocar gateways sem impacto no código dos use cases.
 */
@Component
@Slf4j
public class PaymentGatewayServiceFactory {

    private final Map<PaymentGateway, PaymentGatewayService> services;

    public PaymentGatewayServiceFactory(List<PaymentGatewayService> gatewayServices) {
        this.services = gatewayServices.stream()
            .collect(Collectors.toMap(
                PaymentGatewayService::getGateway,
                Function.identity()
            ));

        log.info("PaymentGatewayServiceFactory inicializado com {} gateway(s): {}",
            services.size(), services.keySet());
    }

    /**
     * Retorna a implementação do gateway especificado.
     * Lança exceção se gateway não estiver configurado.
     */
    public PaymentGatewayService getService(PaymentGateway gateway) {
        var service = services.get(gateway);

        if (service == null) {
            throw new BusinessException(
                String.format("Gateway de pagamento %s não está configurado. Gateways disponíveis: %s",
                    gateway, services.keySet())
            );
        }

        return service;
    }
}


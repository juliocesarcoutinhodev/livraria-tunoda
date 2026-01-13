package br.com.iraquitantunoda.livrariatunoda.domain.service;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Payment;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentGateway;

/**
 * Interface para abstração de gateways de pagamento.
 * Permite trocar implementações sem impacto no domínio.
 */
public interface PaymentGatewayService {

    /**
     * Cria uma preferência/sessão de pagamento no gateway.
     * Retorna informações necessárias para o cliente realizar o pagamento.
     */
    PaymentPreference createPaymentPreference(Order order, Payment payment);

    /**
     * Retorna qual gateway este serviço representa.
     */
    PaymentGateway getGateway();

    /**
     * Record com informações da preferência de pagamento criada.
     */
    record PaymentPreference(
        String id,
        String paymentUrl,
        String externalReference
    ) {
        public String getPaymentUrl() {
            return paymentUrl;
        }
    }
}


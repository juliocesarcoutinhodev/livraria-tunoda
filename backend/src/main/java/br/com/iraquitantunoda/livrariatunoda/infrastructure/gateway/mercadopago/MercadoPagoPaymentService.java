package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Payment;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentGateway;
import br.com.iraquitantunoda.livrariatunoda.domain.service.PaymentGatewayService;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.config.MercadoPagoProperties;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.dto.MercadoPagoPreferenceRequest;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.dto.MercadoPagoPreferenceResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementação do gateway de pagamento para Mercado Pago.
 * Service adapter que converte dados do domínio para o formato do Mercado Pago.
 * O domínio não conhece Mercado Pago - essa camada faz a tradução.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MercadoPagoPaymentService implements PaymentGatewayService {

    private final MercadoPagoClient client;
    private final MercadoPagoProperties properties;

    @Override
    public PaymentGateway getGateway() {
        return PaymentGateway.MERCADO_PAGO;
    }

    /**
     * Cria uma preferência de pagamento no Mercado Pago para um pedido.
     * Converte dados do domínio (Order, Payment) para o formato da API.
     */
    @Override
    public PaymentPreference createPaymentPreference(Order order, Payment payment) {
        log.info("Criando preferência de pagamento para Order: {} e Payment: {}",
            order.getId().getValue(), payment.getId().getValue());

        var request = buildPreferenceRequest(order, payment);
        var response = client.createPreference(request);

        log.info("Preferência criada. ID: {}, URL: {}", response.id(), response.getPaymentUrl());

        return toPaymentPreference(response);
    }

    /**
     * Converte response do Mercado Pago para formato do domínio.
     */
    private PaymentPreference toPaymentPreference(MercadoPagoPreferenceResponse response) {
        return new PaymentPreference(
            response.id(),
            response.getPaymentUrl(),
            response.externalReference()
        );
    }

    /**
     * Constrói o request da API do Mercado Pago a partir de Order e Payment.
     */
    private MercadoPagoPreferenceRequest buildPreferenceRequest(Order order, Payment payment) {
        // Item da preferência
        var item = new MercadoPagoPreferenceRequest.Item(
            "Pedido #" + order.getId().getValue().substring(0, 8),
            buildOrderDescription(order),
            1,
            payment.getAmount().getAmount(),
            "BRL"
        );

        // URLs de callback
        var backUrls = new MercadoPagoPreferenceRequest.BackUrls(
            properties.getSuccessUrl(),
            properties.getFailureUrl(),
            properties.getPendingUrl()
        );

        // Configurar métodos de pagamento aceitos baseado no método escolhido
        var paymentMethods = buildPaymentMethods(payment);

        return new MercadoPagoPreferenceRequest(
            List.of(item),
            backUrls,
            null,
            payment.getId().getValue(), // externalReference = paymentId
            properties.getNotificationUrl(),
            "Livraria Tunoda",
            paymentMethods
        );
    }

    /**
     * Constrói configuração de métodos de pagamento aceitos.
     * Permite apenas o método escolhido pelo cliente.
     */
    private MercadoPagoPreferenceRequest.PaymentMethods buildPaymentMethods(Payment payment) {
        return switch (payment.getMethod()) {
            case PIX -> {
                // Aceita APENAS PIX - exclui todos os outros tipos
                var excludedTypes = List.of(
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("credit_card"),
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("debit_card"),
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("ticket")
                );
                yield new MercadoPagoPreferenceRequest.PaymentMethods(
                    List.of(),
                    excludedTypes,
                    null
                );
            }
            case CREDIT_CARD -> {
                // Aceita APENAS cartão de crédito - exclui os outros
                var excludedTypes = List.of(
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("bank_transfer"),
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("ticket"),
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("debit_card")
                );
                yield new MercadoPagoPreferenceRequest.PaymentMethods(
                    List.of(),
                    excludedTypes,
                    12 // Máximo 12 parcelas
                );
            }
            case DEBIT_CARD -> {
                // Aceita APENAS cartão de débito
                var excludedTypes = List.of(
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("credit_card"),
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("bank_transfer"),
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("ticket")
                );
                yield new MercadoPagoPreferenceRequest.PaymentMethods(
                    List.of(),
                    excludedTypes,
                    1
                );
            }
            case BOLETO -> {
                // Aceita APENAS boleto (ticket)
                var excludedTypes = List.of(
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("credit_card"),
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("debit_card"),
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("bank_transfer")
                );
                yield new MercadoPagoPreferenceRequest.PaymentMethods(
                    List.of(),
                    excludedTypes,
                    null
                );
            }
            case BANK_TRANSFER -> {
                // Aceita transferência bancária
                var excludedTypes = List.of(
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("credit_card"),
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("debit_card"),
                    new MercadoPagoPreferenceRequest.ExcludedPaymentType("ticket")
                );
                yield new MercadoPagoPreferenceRequest.PaymentMethods(
                    List.of(),
                    excludedTypes,
                    null
                );
            }
        };
    }

    /**
     * Constrói descrição do pedido para exibir no Mercado Pago.
     */
    private String buildOrderDescription(Order order) {
        var itemCount = order.getItems().size();
        var itemWord = itemCount == 1 ? "item" : "itens";
        return String.format("Compra de %d %s", itemCount, itemWord);
    }
}


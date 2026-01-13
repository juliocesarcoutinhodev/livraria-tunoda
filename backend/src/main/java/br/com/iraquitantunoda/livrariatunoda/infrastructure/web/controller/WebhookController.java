package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.usecase.ProcessMercadoPagoWebhookUseCase;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.dto.MercadoPagoWebhookEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller para receber notificações de webhook do Mercado Pago.
 * Endpoint público (sem autenticação) pois é chamado pelo Mercado Pago.
 */
@Slf4j
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final ProcessMercadoPagoWebhookUseCase processMercadoPagoWebhookUseCase;

    /**
     * Recebe notificações do Mercado Pago sobre mudanças de status de pagamento.
     * O Mercado Pago envia eventos quando o pagamento é aprovado, rejeitado, etc.
     */
    @PostMapping("/mercadopago")
    public ResponseEntity<Void> handleMercadoPagoWebhook(
        @RequestBody MercadoPagoWebhookEvent event,
        @RequestParam(required = false) String type,
        @RequestParam(name = "data.id", required = false) String dataId
    ) {
        log.info("Webhook recebido do Mercado Pago. Type: {}, Action: {}", event.type(), event.action());
        log.debug("Payload completo do webhook: {}", event);

        // Valida se é evento de pagamento
        if (!event.isPaymentEvent()) {
            log.info("Evento ignorado. Tipo: {}", event.type());
            return ResponseEntity.ok().build();
        }

        // Extrai ID do pagamento do Mercado Pago
        var mercadoPagoPaymentId = event.getPaymentId();

        if (mercadoPagoPaymentId == null || mercadoPagoPaymentId.isBlank()) {
            log.warn("Webhook sem payment ID. Ignorando.");
            return ResponseEntity.badRequest().build();
        }

        try {
            // Processa webhook de forma assíncrona para não bloquear resposta
            processMercadoPagoWebhookUseCase.execute(mercadoPagoPaymentId);

            log.info("Webhook processado com sucesso. Payment ID do MP: {}", mercadoPagoPaymentId);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            // Mesmo em caso de erro, retorna 200 para o Mercado Pago não reenviar
            // O erro já foi logado pelo use case
            log.error("Erro ao processar webhook. Payment ID do MP: {}. Erro: {}",
                mercadoPagoPaymentId, e.getMessage());
            return ResponseEntity.ok().build();
        }
    }
}


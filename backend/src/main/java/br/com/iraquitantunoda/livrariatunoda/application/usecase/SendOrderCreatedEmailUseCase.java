package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.service.EmailDispatchService;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.EmailMessage;
import br.com.iraquitantunoda.livrariatunoda.domain.service.EmailTemplateRenderer;
import br.com.iraquitantunoda.livrariatunoda.domain.service.FrontendUrlProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class SendOrderCreatedEmailUseCase {

    private final EmailDispatchService emailDispatchService;
    private final EmailTemplateRenderer emailTemplateRenderer;
    private final FrontendUrlProvider frontendUrlProvider;

    public void execute(Order order) {
        if (order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) {
            log.warn("Pedido {} sem email de cliente. Envio de email de criacao ignorado",
                order.getId().getValue());
            return;
        }

        var customerName = order.getCustomerName();
        if (customerName == null || customerName.isBlank()) {
            customerName = "cliente";
        }

        var subject = "Seu pedido foi criado";
        var variables = new HashMap<String, Object>();
        variables.put("customerName", customerName);
        variables.put("orderId", order.getId().getValue());
        variables.put("status", order.getStatus().name());
        variables.put("trackingUrl", frontendUrlProvider.getOrderConfirmationUrl(order.getId().getValue()));

        var body = emailTemplateRenderer.render("email/order-created", variables);
        var message = EmailMessage.ofHtml(order.getCustomerEmail(), subject, body);
        emailDispatchService.sendAsync(message);
    }
}

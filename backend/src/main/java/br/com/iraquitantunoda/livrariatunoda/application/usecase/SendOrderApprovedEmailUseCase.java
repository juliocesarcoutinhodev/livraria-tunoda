package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.service.EmailDispatchService;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.EmailMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SendOrderApprovedEmailUseCase {

    private final EmailDispatchService emailDispatchService;

    public void execute(Order order) {
        if (order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) {
            log.warn("Pedido {} sem email de cliente. Envio de confirmacao ignorado",
                order.getId().getValue());
            return;
        }

        var customerName = order.getCustomerName();
        if (customerName == null || customerName.isBlank()) {
            customerName = "cliente";
        }

        var subject = "Pagamento confirmado";
        var body = new StringBuilder()
            .append("Ola, ").append(customerName).append(".\n\n")
            .append("Pagamento confirmado para o seu pedido.\n")
            .append("Pedido: ").append(order.getId().getValue()).append("\n")
            .append("Status: ").append(order.getStatus().name()).append("\n")
            .append("Acompanhe aqui: /pedido/").append(order.getId().getValue()).append("/confirmacao\n")
            .append("\nProximos passos: seu pedido sera processado e enviado em breve.\n")
            .toString();

        var message = EmailMessage.of(order.getCustomerEmail(), subject, body);
        emailDispatchService.sendAsync(message);
    }
}

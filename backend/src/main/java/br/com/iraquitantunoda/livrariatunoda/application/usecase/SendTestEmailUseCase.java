package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.SendTestEmailRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.SendTestEmailResponse;
import br.com.iraquitantunoda.livrariatunoda.application.service.EmailDispatchService;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.EmailMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SendTestEmailUseCase {

    private final EmailDispatchService emailDispatchService;

    public SendTestEmailResponse execute(SendTestEmailRequest request) {
        log.info("Solicitado envio de email de teste para {}", request.to());

        var message = EmailMessage.of(request.to(), request.subject(), request.body());
        emailDispatchService.sendAsync(message);

        return new SendTestEmailResponse("QUEUED", "Email enfileirado para envio");
    }
}

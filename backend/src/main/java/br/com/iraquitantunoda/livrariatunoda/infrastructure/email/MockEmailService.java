package br.com.iraquitantunoda.livrariatunoda.infrastructure.email;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.EmailMessage;
import br.com.iraquitantunoda.livrariatunoda.domain.service.EmailSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile({"dev", "local", "test"})
@Slf4j
public class MockEmailService implements EmailSender {

    @Override
    public void send(EmailMessage message) {
        log.info("Email mock enviado para {}", message.getTo().getValue());
        log.info("Formato: {}", message.isHtml() ? "HTML" : "TEXTO");
        log.info("Assunto: {}", message.getSubject());
        log.info("Corpo: {}", message.getBody());
    }
}

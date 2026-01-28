package br.com.iraquitantunoda.livrariatunoda.infrastructure.email;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.EmailMessage;
import br.com.iraquitantunoda.livrariatunoda.domain.service.EmailSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Profile({"prod", "staging"})
@RequiredArgsConstructor
@Slf4j
public class GmailEmailService implements EmailSender {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Override
    public void send(EmailMessage message) {
        var mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromAddress);
        mailMessage.setTo(message.getTo().getValue());
        mailMessage.setSubject(message.getSubject());
        mailMessage.setText(message.getBody());

        mailSender.send(mailMessage);
        log.info("Email enviado para {}", message.getTo().getValue());
    }
}

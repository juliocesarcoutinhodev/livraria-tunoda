package br.com.iraquitantunoda.livrariatunoda.infrastructure.email;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.EmailMessage;
import br.com.iraquitantunoda.livrariatunoda.domain.service.EmailSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            var helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(message.getTo().getValue());
            helper.setSubject(message.getSubject());
            helper.setText(message.getBody(), message.isHtml());
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            log.error("Erro ao preparar email para {}", message.getTo().getValue(), e);
            throw e;
        }
        log.info("Email enviado para {}", message.getTo().getValue());
    }
}

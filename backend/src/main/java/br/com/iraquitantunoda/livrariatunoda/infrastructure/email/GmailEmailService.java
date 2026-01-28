package br.com.iraquitantunoda.livrariatunoda.infrastructure.email;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.EmailSendException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.EmailMessage;
import br.com.iraquitantunoda.livrariatunoda.domain.service.EmailSender;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Profile;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Profile({"prod", "staging"})
@RequiredArgsConstructor
@Slf4j
public class GmailEmailService implements EmailSender {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final MailProperties mailProperties;

    @Override
    public void send(EmailMessage message) {
        var mailSender = mailSenderProvider.getObject();
        var fromAddress = mailProperties.getUsername();
        if (fromAddress == null || fromAddress.isBlank()) {
            throw new EmailSendException("Email de origem nao configurado", null);
        }
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            var helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(message.getTo().getValue());
            helper.setSubject(message.getSubject());
            helper.setText(message.getBody(), message.isHtml());
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new EmailSendException("Erro ao preparar email", e);
        }
        log.info("Email enviado para {}", message.getTo().getValue());
    }
}

package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.Value;

/**
 * Value Object que representa uma mensagem de email pronta para envio.
 */
@Value
public class EmailMessage {
    Email to;
    String subject;
    String body;
    boolean html;

    private EmailMessage(Email to, String subject, String body, boolean html) {
        validateSubject(subject);
        validateBody(body);
        this.to = to;
        this.subject = subject.trim();
        this.body = body.trim();
        this.html = html;
    }

    public static EmailMessage of(String to, String subject, String body) {
        return ofText(to, subject, body);
    }

    public static EmailMessage ofText(String to, String subject, String body) {
        return new EmailMessage(Email.of(to), subject, body, false);
    }

    public static EmailMessage ofHtml(String to, String subject, String body) {
        return new EmailMessage(Email.of(to), subject, body, true);
    }

    private static void validateSubject(String subject) {
        if (subject == null || subject.isBlank()) {
            throw new BusinessException("Assunto do email nao pode ser nulo ou vazio");
        }
    }

    private static void validateBody(String body) {
        if (body == null || body.isBlank()) {
            throw new BusinessException("Corpo do email nao pode ser nulo ou vazio");
        }
    }
}

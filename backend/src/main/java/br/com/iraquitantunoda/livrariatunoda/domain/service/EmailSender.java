package br.com.iraquitantunoda.livrariatunoda.domain.service;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.EmailMessage;

/**
 * Interface de envio de email.
 * A implementacao concreta pertence a infraestrutura.
 */
public interface EmailSender {
    void send(EmailMessage message);
}

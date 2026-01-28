package br.com.iraquitantunoda.livrariatunoda.application.service;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.EmailMessage;
import br.com.iraquitantunoda.livrariatunoda.domain.service.EmailSender;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Envio assincrono de emails usando virtual threads.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailDispatchService {

    private final EmailSender emailSender;
    private final ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor();

    public void sendAsync(EmailMessage message) {
        executorService.submit(() -> {
            try {
                emailSender.send(message);
            } catch (Exception e) {
                log.error("Erro ao enviar email para {}", message.getTo().getValue(), e);
            }
        });
    }

    @PreDestroy
    void shutdown() {
        executorService.shutdown();
    }
}

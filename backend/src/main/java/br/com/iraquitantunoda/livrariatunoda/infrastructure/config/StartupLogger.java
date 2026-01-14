package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * Logger de inicializacao da aplicacao.
 * Exibe informacoes sobre profile ativo, porta e configuracoes principais.
 */
@Component
@RequiredArgsConstructor
public class StartupLogger {

    private static final Logger log = LoggerFactory.getLogger(StartupLogger.class);

    private final Environment environment;
    private final SecurityProperties securityProperties;

    @EventListener(ApplicationReadyEvent.class)
    public void logStartup() {
        String[] activeProfiles = environment.getActiveProfiles();
        String profiles = activeProfiles.length > 0 ? String.join(", ", activeProfiles) : "default";

        log.info("========================================");
        log.info("Application started successfully!");
        log.info("Active profile(s): {}", profiles);
        log.info("Port: {}", environment.getProperty("server.port", "8080"));
        log.info("JWT Expiration: {}s", securityProperties.getJwt().getExpiration());
        log.info("Refresh Token Expiration: {} days", securityProperties.getRefreshToken().getExpirationDays());
        log.info("========================================");
    }
}


package br.com.iraquitantunoda.livrariatunoda.infrastructure.config.health;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

/**
 * Health indicator customizado para validar o estado geral da aplicacao.
 * Verifica se os componentes criticos estao carregados e prontos para uso.
 */
@Component
@RequiredArgsConstructor
public class ApplicationHealthIndicator implements HealthIndicator {

    private final ApplicationContext applicationContext;

    @Override
    public Health health() {
        try {
            // Verifica se o contexto da aplicacao esta carregado
            long beanCount = applicationContext.getBeanDefinitionCount();

            // Se conseguiu contar os beans, a aplicacao esta UP
            if (beanCount > 0) {
                return Health.up()
                    .withDetail("context", "Active")
                    .withDetail("beansLoaded", beanCount)
                    .withDetail("status", "Application ready")
                    .build();
            } else {
                return Health.down()
                    .withDetail("context", "No beans loaded")
                    .withDetail("status", "Application not ready")
                    .build();
            }
        } catch (Exception e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .withDetail("status", "Application error")
                .build();
        }
    }
}


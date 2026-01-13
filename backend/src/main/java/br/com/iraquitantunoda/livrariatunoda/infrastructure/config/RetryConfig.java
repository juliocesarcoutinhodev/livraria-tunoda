package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

/**
 * Habilita suporte a @Retryable no Spring.
 */
@Configuration
@EnableRetry
public class RetryConfig {
}


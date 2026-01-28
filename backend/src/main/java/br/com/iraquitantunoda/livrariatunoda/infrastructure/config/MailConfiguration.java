package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(MailProperties.class)
public class MailConfiguration {
}

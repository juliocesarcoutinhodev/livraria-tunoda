package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailSenderConfiguration {

    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    public JavaMailSender javaMailSender(MailProperties properties) {
        var sender = new JavaMailSenderImpl();
        sender.setHost(properties.getHost());
        sender.setPort(properties.getPort());
        sender.setUsername(properties.getUsername());
        sender.setPassword(properties.getPassword());
        sender.setProtocol(properties.getProtocol());
        var javaMailProperties = new java.util.Properties();
        javaMailProperties.putAll(properties.getProperties());
        sender.setJavaMailProperties(javaMailProperties);
        return sender;
    }
}

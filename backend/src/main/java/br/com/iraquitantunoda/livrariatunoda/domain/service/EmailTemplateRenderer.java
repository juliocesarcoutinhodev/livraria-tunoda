package br.com.iraquitantunoda.livrariatunoda.domain.service;

import java.util.Map;

/**
 * Interface para renderizacao de templates de email.
 */
public interface EmailTemplateRenderer {
    String render(String templateName, Map<String, Object> variables);
}

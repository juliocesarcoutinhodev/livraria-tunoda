package br.com.iraquitantunoda.livrariatunoda.infrastructure.email;

import br.com.iraquitantunoda.livrariatunoda.domain.service.EmailTemplateRenderer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ThymeleafEmailTemplateRenderer implements EmailTemplateRenderer {

    private final SpringTemplateEngine templateEngine;

    @Override
    public String render(String templateName, Map<String, Object> variables) {
        var context = new Context(new Locale("pt", "BR"));
        context.setVariables(variables);
        return templateEngine.process(templateName, context);
    }
}

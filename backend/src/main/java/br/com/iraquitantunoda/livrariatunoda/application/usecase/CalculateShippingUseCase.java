package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingQuoteResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.ShippingQuoteDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.gateway.ShippingCalculator;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingPayload;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuoteId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingProvider;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingPayloadRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingQuoteRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Caso de uso para calcular opções de frete via provedor externo.
 * Coordena cálculo, salvamento de payload e atualização da cotação.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CalculateShippingUseCase {

    private final ShippingQuoteRepository shippingQuoteRepository;
    private final ShippingPayloadRepository shippingPayloadRepository;
    private final ShippingCalculator shippingCalculator;
    private final ShippingQuoteDTOMapper mapper;
    private final ObjectMapper objectMapper;

    @Transactional
    public ShippingQuoteResponse execute(String quoteId) {
        log.info("Iniciando cálculo de frete para cotação {}", quoteId);

        var quote = shippingQuoteRepository.findById(ShippingQuoteId.of(quoteId))
            .orElseThrow(() -> new ResourceNotFoundException("Cotação não encontrada"));

        if (!quote.isCreated()) {
            throw new BusinessException("Cotação já foi calculada ou está em status inválido");
        }

        if (quote.isExpired()) {
            quote.expire();
            shippingQuoteRepository.save(quote);
            throw new BusinessException("Cotação expirada não pode ser calculada");
        }

        try {
            // Calcula opções via provedor externo (Melhor Envio)
            var calculatedQuote = shippingCalculator.calculate(quote);

            // Atualiza a cotação original com as opções calculadas
            quote.updateCalculatedOptions(calculatedQuote.getOptions());

            // Salva payload bruto para auditoria
            saveRawPayload(quote.getId(), calculatedQuote.getOptions());

            // Persiste cotação atualizada
            var savedQuote = shippingQuoteRepository.save(quote);

            log.info("Frete calculado com sucesso para cotação {}. Total de opções: {}",
                quoteId, savedQuote.getOptions().size());

            return mapper.toResponse(savedQuote);

        } catch (Exception e) {
            log.error("Erro ao calcular frete para cotação {}: {}", quoteId, e.getMessage());

            // Em caso de erro, marca cotação como expirada
            quote.expire();
            shippingQuoteRepository.save(quote);

            throw new BusinessException("Falha ao calcular opções de frete: " + e.getMessage());
        }
    }

    /**
     * Salva o payload bruto para auditoria.
     * Em caso de erro, apenas loga mas não interrompe o fluxo.
     */
    private void saveRawPayload(ShippingQuoteId quoteId, Object options) {
        try {
            var rawPayload = objectMapper.writeValueAsString(options);
            var payload = ShippingPayload.create(
                quoteId,
                ShippingProvider.MELHOR_ENVIO,
                rawPayload
            );
            shippingPayloadRepository.save(payload);
            log.debug("Payload bruto salvo para cotação {}", quoteId.getValue());
        } catch (JsonProcessingException e) {
            log.warn("Erro ao serializar payload para cotação {}: {}",
                quoteId.getValue(), e.getMessage());
        } catch (Exception e) {
            log.warn("Erro ao salvar payload para cotação {}: {}",
                quoteId.getValue(), e.getMessage());
        }
    }
}


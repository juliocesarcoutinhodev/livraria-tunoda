package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingQuoteResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.ShippingQuoteDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuoteId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingQuoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Caso de uso para consultar uma cotação de frete.
 * Retorna apenas cotações com status CALCULATED.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetShippingQuoteUseCase {

    private final ShippingQuoteRepository shippingQuoteRepository;
    private final ShippingQuoteDTOMapper mapper;

    @Transactional(readOnly = true)
    public ShippingQuoteResponse execute(String quoteId) {
        log.info("Consultando cotação de frete: {}", quoteId);

        var quote = shippingQuoteRepository.findById(ShippingQuoteId.of(quoteId))
            .orElseThrow(() -> new ResourceNotFoundException("Cotação não encontrada"));

        if (!quote.isCalculated()) {
            throw new BusinessException("Cotação ainda não foi calculada");
        }

        if (quote.isExpired()) {
            throw new BusinessException("Cotação expirada");
        }

        log.info("Cotação {} retornada com {} opções de frete", quoteId, quote.getOptions().size());

        return mapper.toResponse(quote);
    }
}


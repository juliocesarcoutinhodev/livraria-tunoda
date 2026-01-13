package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingQuoteResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.ShippingQuoteDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuoteId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingQuoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Caso de uso para selecionar uma opção de frete na cotação.
 * Valida a opção escolhida e bloqueia alterações futuras.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SelectShippingOptionUseCase {

    private final ShippingQuoteRepository shippingQuoteRepository;
    private final ShippingQuoteDTOMapper mapper;

    @Transactional
    public ShippingQuoteResponse execute(String quoteId, String serviceCode) {
        log.info("Selecionando opção de frete {} para cotação {}", serviceCode, quoteId);

        var quote = shippingQuoteRepository.findById(ShippingQuoteId.of(quoteId))
            .orElseThrow(() -> new ResourceNotFoundException("Cotação não encontrada"));

        // Validações e alteração de estado no domínio
        quote.selectOption(serviceCode);

        var savedQuote = shippingQuoteRepository.save(quote);

        log.info("Opção de frete {} selecionada com sucesso para cotação {}. Status alterado para SELECTED",
            serviceCode, quoteId);

        return mapper.toResponse(savedQuote);
    }
}


package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingQuoteResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.ShippingQuoteDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuote;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartStatus;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingOption;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.CartRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingQuoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateShippingQuoteUseCase {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final ShippingQuoteRepository shippingQuoteRepository;
    private final ShippingQuoteDTOMapper mapper;

    @Transactional
    public ShippingQuoteResponse execute(String cartId, String toPostalCode) {
        var cart = cartRepository.findById(CartId.of(cartId))
            .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado"));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new BusinessException("Carrinho não está ativo");
        }

        if (cart.getItems().isEmpty()) {
            throw new BusinessException("Carrinho vazio não pode ter cotação de frete");
        }

        // Cria snapshot dos itens do carrinho
        var shippingItems = createShippingItemsFromCart(cart);

        // Cria opção temporária até a integração com Melhor Envio na próxima story
        var temporaryOption = ShippingOption.create(
            "PENDING",
            "Aguardando cálculo de frete",
            Money.brl(BigDecimal.ZERO),
            1,
            "PENDING",
            "PENDING"
        );

        var quote = ShippingQuote.create(cart.getId(), toPostalCode, shippingItems, List.of(temporaryOption));

        var savedQuote = shippingQuoteRepository.save(quote);

        return mapper.toResponse(savedQuote);
    }

    private List<ShippingItem> createShippingItemsFromCart(br.com.iraquitantunoda.livrariatunoda.domain.model.Cart cart) {
        return cart.getItems().stream()
            .map(item -> {
                var book = bookRepository.findById(item.getBookId())
                    .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado: " + item.getBookId().getValue()));

                return ShippingItem.create(
                    item.getBookId(),
                    item.getBookTitle(),
                    item.getQuantity(),
                    book.getWeight(),
                    item.getUnitPrice()
                );
            })
            .toList();
    }
}


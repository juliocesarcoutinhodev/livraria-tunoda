package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.OrderDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.*;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.CartRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.ShippingQuoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConvertCartToOrderUseCase {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final ShippingQuoteRepository shippingQuoteRepository;
    private final OrderDTOMapper orderDTOMapper;

    /**
     * Converte carrinho em pedido com frete opcional.
     * Operacao transacional garante atomicidade (cart + order).
     *
     * @param cartId ID do carrinho a ser convertido
     * @param shippingQuoteId ID da cotacao de frete (opcional)
     * @return OrderResponse com dados do pedido criado
     */
    @Transactional
    public OrderResponse execute(String cartId, String shippingQuoteId) {
        log.info("Iniciando checkout do carrinho {}. Frete: {}", cartId,
                 shippingQuoteId != null ? shippingQuoteId : "sem frete");

        // 1. Buscar carrinho ou falhar
        var cart = cartRepository.findById(CartId.of(cartId))
            .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado"));

        // 2. Validar que não foi convertido anteriormente
        if (cart.isConverted()) {
            throw new BusinessException("Carrinho já foi convertido em pedido");
        }

        // 3. Validar livros ativos
        var bookIds = cart.getItems().stream()
            .map(CartItem::getBookId)
            .collect(Collectors.toSet());

        var activeBookIds = fetchActiveBookIds(bookIds);

        // 4. Validar carrinho para checkout (status, items, total, livros)
        cart.validateForCheckout(activeBookIds);

        // 5. Criar pedido com ou sem frete
        Order order;
        if (shippingQuoteId != null && !shippingQuoteId.isBlank()) {
            var shippingQuote = shippingQuoteRepository.findById(ShippingQuoteId.of(shippingQuoteId))
                .orElseThrow(() -> new ResourceNotFoundException("Cotação de frete não encontrada"));

            log.debug("Criando pedido com frete. Cotação: {}, Valor: {}",
                      shippingQuoteId, shippingQuote.getSelectedOption().getPrice());

            order = Order.createFromCartWithShipping(cart, shippingQuote);
        } else {
            log.debug("Criando pedido sem frete (frete grátis)");
            order = Order.createFromCart(cart);
        }

        // 6. Marcar carrinho como convertido (impede uso futuro)
        cart.markAsConverted();

        // 7. Persistir pedido e carrinho atomicamente
        var savedOrder = orderRepository.save(order);
        cartRepository.save(cart);

        log.info("Pedido {} criado com sucesso. Total: {} {}",
                 savedOrder.getId().getValue(),
                 savedOrder.getTotal().getAmount(),
                 savedOrder.getTotal().getCurrency());

        // 8. Retornar resposta
        return orderDTOMapper.toResponse(savedOrder);
    }

    private Set<BookId> fetchActiveBookIds(Set<BookId> bookIds) {
        return bookIds.stream()
            .filter(bookId -> {
                var book = bookRepository.findById(bookId);
                return book.isPresent() && book.get().isActive();
            })
            .collect(Collectors.toSet());
    }
}

package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.OrderDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.CartRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConvertCartToOrderUseCase {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final OrderDTOMapper orderDTOMapper;

    // Operação transacional garante que cart.markAsConverted() e order.save() ocorrem atomicamente
    // Em caso de erro, rollback automático (nenhum estado parcial persistido)
    @Transactional
    public OrderResponse execute(String cartId) {
        // 1. Buscar carrinho ou falhar
        var cart = cartRepository.findById(CartId.of(cartId))
            .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado"));

        // 2. Validar que não foi convertido anteriormente
        if (cart.isConverted()) {
            throw new BusinessException("Carrinho já foi convertido em pedido");
        }

        // 3. Validar livros ativos
        var bookIds = cart.getItems().stream()
            .map(item -> item.getBookId())
            .collect(Collectors.toSet());

        var activeBookIds = fetchActiveBookIds(bookIds);

        // 4. Validar carrinho para checkout (status, items, total, livros)
        cart.validateForCheckout(activeBookIds);

        // 5. Criar pedido a partir do carrinho (snapshot)
        var order = Order.createFromCart(cart);

        // 6. Marcar carrinho como convertido (impede uso futuro)
        cart.markAsConverted();

        // 7. Persistir pedido e carrinho atomicamente
        var savedOrder = orderRepository.save(order);
        cartRepository.save(cart);

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

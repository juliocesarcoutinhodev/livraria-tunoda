package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ValidateCartResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.CartItem;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ValidateCartUseCase {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public ValidateCartResponse execute(String cartId) {
        var cart = cartRepository.findById(CartId.of(cartId))
            .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado"));

        var bookIds = cart.getItems().stream()
            .map(CartItem::getBookId)
            .collect(Collectors.toSet());

        var activeBookIds = fetchActiveBookIds(bookIds);

        try {
            cart.validateForCheckout(activeBookIds);
            return new ValidateCartResponse(
                cart.getId().getValue(),
                true,
                "Carrinho válido para checkout"
            );
        } catch (BusinessException e) {
            return new ValidateCartResponse(
                cart.getId().getValue(),
                false,
                e.getMessage()
            );
        }
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


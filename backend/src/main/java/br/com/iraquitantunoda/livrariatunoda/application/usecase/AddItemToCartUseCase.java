package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AddItemToCartRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.CartResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.CartDTOMapper;
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

@Service
@RequiredArgsConstructor
public class AddItemToCartUseCase {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final CartDTOMapper cartDTOMapper;

    @Transactional
    public CartResponse execute(String cartId, AddItemToCartRequest request) {
        var cart = cartRepository.findById(CartId.of(cartId))
            .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado"));

        if (!cart.isActive()) {
            throw new BusinessException("Carrinho não está ativo");
        }

        var bookIdObj = BookId.of(request.bookId());
        var book = bookRepository.findById(bookIdObj)
            .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));

        if (!book.isActive()) {
            throw new BusinessException("Livro não está disponível");
        }

        var item = CartItem.create(
            bookIdObj,
            book.getTitle(),
            request.quantity(),
            book.getPrice()
        );

        cart.addItem(item);

        var savedCart = cartRepository.save(cart);

        return cartDTOMapper.toResponse(savedCart);
    }
}


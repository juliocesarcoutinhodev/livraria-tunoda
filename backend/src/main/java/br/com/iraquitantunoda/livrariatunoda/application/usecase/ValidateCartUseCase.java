package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.ValidateCartErrorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ValidateCartItemResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ValidateCartResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.CartId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ValidateCartUseCase {

    private static final String STATUS_OK = "OK";
    private static final String ERROR_OUT_OF_STOCK = "OUT_OF_STOCK";
    private static final String ERROR_INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK";
    private static final String ERROR_BOOK_INACTIVE = "BOOK_INACTIVE";
    private static final String ERROR_BOOK_NOT_FOUND = "BOOK_NOT_FOUND";
    private static final String ERROR_CART_INVALID = "CART_INVALID";
    private static final String ERROR_CART_EMPTY = "CART_EMPTY";
    private static final String ERROR_ITEM_INVALID = "ITEM_INVALID";
    private static final String MESSAGE_OUT_OF_STOCK = "Sem estoque para este livro.";
    private static final String MESSAGE_INSUFFICIENT_STOCK = "Estoque insuficiente para a quantidade solicitada.";
    private static final String MESSAGE_BOOK_INACTIVE = "Este livro não está disponível no momento.";
    private static final String MESSAGE_BOOK_NOT_FOUND = "Este livro não está disponível.";
    private static final String MESSAGE_CART_INVALID = "Carrinho inválido ou expirado.";
    private static final String MESSAGE_CART_EMPTY = "Seu carrinho está vazio.";
    private static final String MESSAGE_ITEM_INVALID = "Item inválido no carrinho.";
    private static final String MESSAGE_CART_VALID = "Carrinho válido para checkout";

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public ValidateCartResponse execute(String cartId) {
        var cart = cartRepository.findById(CartId.of(cartId))
            .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado"));

        var itemResponses = new ArrayList<ValidateCartItemResponse>();
        var errors = new ArrayList<ValidateCartErrorResponse>();
        var activeBookIds = new HashSet<BookId>();

        if (!cart.isActive()) {
            errors.add(new ValidateCartErrorResponse(
                ERROR_CART_INVALID,
                MESSAGE_CART_INVALID,
                null
            ));
        }

        if (cart.getItems().isEmpty()) {
            errors.add(new ValidateCartErrorResponse(
                ERROR_CART_EMPTY,
                MESSAGE_CART_EMPTY,
                null
            ));
        }

        if (!cart.getItems().isEmpty()) {
            var total = cart.calculateTotal();
            if (total.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                errors.add(new ValidateCartErrorResponse(
                    ERROR_CART_INVALID,
                    MESSAGE_CART_INVALID,
                    null
                ));
            }
        }

        for (var item : cart.getItems()) {
            var bookId = item.getBookId();
            var availableQuantity = 0;
            var status = STATUS_OK;
            String message = null;

            if (bookId == null || item.getQuantity() <= 0) {
                status = ERROR_ITEM_INVALID;
                message = MESSAGE_ITEM_INVALID;
                errors.add(new ValidateCartErrorResponse(
                    ERROR_ITEM_INVALID,
                    MESSAGE_ITEM_INVALID,
                    bookId != null ? bookId.getValue() : null
                ));
            } else {
                var book = bookRepository.findById(bookId).orElse(null);
                if (book == null) {
                    status = ERROR_BOOK_NOT_FOUND;
                    message = MESSAGE_BOOK_NOT_FOUND;
                    errors.add(new ValidateCartErrorResponse(
                        ERROR_BOOK_NOT_FOUND,
                        MESSAGE_BOOK_NOT_FOUND,
                        bookId.getValue()
                    ));
                } else if (!book.isActive()) {
                    status = ERROR_BOOK_INACTIVE;
                    message = MESSAGE_BOOK_INACTIVE;
                    errors.add(new ValidateCartErrorResponse(
                        ERROR_BOOK_INACTIVE,
                        MESSAGE_BOOK_INACTIVE,
                        bookId.getValue()
                    ));
                } else {
                    availableQuantity = book.getStock();
                    activeBookIds.add(bookId);
                    if (availableQuantity <= 0) {
                        status = ERROR_OUT_OF_STOCK;
                        message = MESSAGE_OUT_OF_STOCK;
                        errors.add(new ValidateCartErrorResponse(
                            ERROR_OUT_OF_STOCK,
                            MESSAGE_OUT_OF_STOCK,
                            bookId.getValue()
                        ));
                    } else if (availableQuantity < item.getQuantity()) {
                        status = ERROR_INSUFFICIENT_STOCK;
                        message = MESSAGE_INSUFFICIENT_STOCK;
                        errors.add(new ValidateCartErrorResponse(
                            ERROR_INSUFFICIENT_STOCK,
                            MESSAGE_INSUFFICIENT_STOCK,
                            bookId.getValue()
                        ));
                    }
                }
            }

            itemResponses.add(new ValidateCartItemResponse(
                bookId != null ? bookId.getValue() : null,
                item.getBookTitle(),
                item.getQuantity(),
                availableQuantity,
                status,
                message
            ));
        }

        try {
            if (errors.isEmpty()) {
                cart.validateForCheckout(activeBookIds);
                return new ValidateCartResponse(
                    cart.getId().getValue(),
                    true,
                    MESSAGE_CART_VALID,
                    itemResponses,
                    List.of()
                );
            }
        } catch (BusinessException e) {
            errors.add(new ValidateCartErrorResponse(
                ERROR_CART_INVALID,
                MESSAGE_CART_INVALID,
                null
            ));
        }

        var message = errors.isEmpty() ? MESSAGE_CART_VALID : errors.get(0).message();
        return new ValidateCartResponse(
            cart.getId().getValue(),
            errors.isEmpty(),
            message,
            itemResponses,
            errors
        );
    }

}

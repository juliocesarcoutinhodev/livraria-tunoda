package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.*;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.*;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DeductStockFromOrderUseCase - Testes")
class DeductStockFromOrderUseCaseTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private DeductStockFromOrderUseCase useCase;

    private Order order;
    private Book book1;
    private Book book2;
    private BookId bookId1;
    private BookId bookId2;

    @BeforeEach
    void setUp() {
        bookId1 = BookId.generate();
        bookId2 = BookId.generate();

        // Cria Order com 2 itens
        var orderItem1 = OrderItem.create(bookId1, "Clean Code", 2, Money.brl(BigDecimal.valueOf(50.00)));
        var orderItem2 = OrderItem.create(bookId2, "Design Patterns", 1, Money.brl(BigDecimal.valueOf(80.00)));

        order = Order.reconstitute(
            OrderId.generate(),
            CartId.generate(),
            null,
            List.of(orderItem1, orderItem2),
            Money.brl(BigDecimal.valueOf(180.00)),
            Money.brl(BigDecimal.ZERO),
            Money.brl(BigDecimal.valueOf(180.00)),
            LocalDateTime.now(),
            OrderStatus.CONFIRMED,
            "payment-ref-123",
            "Cliente",
            "cliente@email.com",
            "11999999999"
        );

        // Cria Books reais com estoque suficiente
        book1 = Book.reconstitute(
            bookId1,
            "Clean Code",
            "A handbook of agile software craftsmanship",
            null,
            null,
            Money.brl(BigDecimal.valueOf(50.00)),
            Weight.kilograms(BigDecimal.valueOf(0.5)),
            Set.of(AuthorId.generate()),
            Status.ACTIVE,
            10 // estoque inicial
        );

        book2 = Book.reconstitute(
            bookId2,
            "Design Patterns",
            "Elements of Reusable Object-Oriented Software",
            null,
            null,
            Money.brl(BigDecimal.valueOf(80.00)),
            Weight.kilograms(BigDecimal.valueOf(0.7)),
            Set.of(AuthorId.generate()),
            Status.ACTIVE,
            5 // estoque inicial
        );
    }

    @Test
    @DisplayName("Deve deduzir estoque com sucesso quando pedido tem itens e estoque suficiente")
    void shouldDeductStockSuccessfullyWhenOrderHasItemsAndSufficientStock() {
        // Arrange
        when(bookRepository.findById(bookId1)).thenReturn(Optional.of(book1));
        when(bookRepository.findById(bookId2)).thenReturn(Optional.of(book2));

        // Act
        useCase.execute(order);

        // Assert
        assertEquals(8, book1.getStock()); // 10 - 2 = 8
        assertEquals(4, book2.getStock()); // 5 - 1 = 4
        verify(bookRepository, times(2)).save(any(Book.class));
    }

    @Test
    @DisplayName("Deve lancar excecao quando livro nao for encontrado")
    void shouldThrowExceptionWhenBookNotFound() {
        // Arrange
        when(bookRepository.findById(bookId1)).thenReturn(Optional.empty());

        // Act & Assert
        var exception = assertThrows(ResourceNotFoundException.class, () -> useCase.execute(order));
        assertTrue(exception.getMessage().contains("Livro nao encontrado"));

        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    @DisplayName("Deve lancar excecao quando estoque for insuficiente")
    void shouldThrowExceptionWhenInsufficientStock() {
        // Arrange - cria um livro com estoque insuficiente (1 unidade)
        var bookWithLowStock = Book.reconstitute(
            bookId1,
            "Clean Code",
            "A handbook of agile software craftsmanship",
            null,
            null,
            Money.brl(BigDecimal.valueOf(50.00)),
            Weight.kilograms(BigDecimal.valueOf(0.5)),
            Set.of(AuthorId.generate()),
            Status.ACTIVE,
            1 // Estoque insuficiente - pedido precisa de 2
        );

        when(bookRepository.findById(bookId1)).thenReturn(Optional.of(bookWithLowStock));

        // Act & Assert
        var exception = assertThrows(BusinessException.class, () -> useCase.execute(order));
        assertTrue(exception.getMessage().contains("Estoque insuficiente"));

        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    @DisplayName("Deve alertar quando estoque ficar baixo apos deducao")
    void shouldAlertWhenStockBecomesLowAfterDeduction() {
        // Arrange - cria livro com estoque que ficará baixo após dedução (6 - 2 = 4, que é menor que 5)
        var bookWithLimitedStock = Book.reconstitute(
            bookId1,
            "Clean Code",
            "A handbook of agile software craftsmanship",
            null,
            null,
            Money.brl(BigDecimal.valueOf(50.00)),
            Weight.kilograms(BigDecimal.valueOf(0.5)),
            Set.of(AuthorId.generate()),
            Status.ACTIVE,
            6 // Depois da deducao de 2, ficara com 4 (baixo)
        );

        when(bookRepository.findById(bookId1)).thenReturn(Optional.of(bookWithLimitedStock));
        when(bookRepository.findById(bookId2)).thenReturn(Optional.of(book2));

        // Act
        useCase.execute(order);

        // Assert
        assertEquals(4, bookWithLimitedStock.getStock());
        assertTrue(bookWithLimitedStock.hasLowStock(5));
        verify(bookRepository, times(2)).save(any(Book.class));
    }

    @Test
    @DisplayName("Deve alertar quando estoque zerar apos deducao")
    void shouldAlertWhenStockBecomesZeroAfterDeduction() {
        // Arrange - cria livro com estoque exato igual à quantidade do pedido (1 - 1 = 0)
        var bookToBeEmpty = Book.reconstitute(
            bookId2,
            "Design Patterns",
            "Elements of Reusable Object-Oriented Software",
            null,
            null,
            Money.brl(BigDecimal.valueOf(80.00)),
            Weight.kilograms(BigDecimal.valueOf(0.7)),
            Set.of(AuthorId.generate()),
            Status.ACTIVE,
            1 // Depois da deducao de 1, ficara com 0 (esgotado)
        );

        when(bookRepository.findById(bookId1)).thenReturn(Optional.of(book1));
        when(bookRepository.findById(bookId2)).thenReturn(Optional.of(bookToBeEmpty));

        // Act
        useCase.execute(order);

        // Assert
        assertEquals(0, bookToBeEmpty.getStock());
        assertTrue(bookToBeEmpty.isOutOfStock());
        verify(bookRepository, times(2)).save(any(Book.class));
    }

    @Test
    @DisplayName("Deve processar pedido com unico item")
    void shouldProcessOrderWithSingleItem() {
        // Arrange
        var singleOrderItem = OrderItem.create(bookId1, "Clean Code", 1, Money.brl(BigDecimal.valueOf(50.00)));
        var singleItemOrder = Order.reconstitute(
            OrderId.generate(),
            CartId.generate(),
            null,
            List.of(singleOrderItem),
            Money.brl(BigDecimal.valueOf(50.00)),
            Money.brl(BigDecimal.ZERO),
            Money.brl(BigDecimal.valueOf(50.00)),
            LocalDateTime.now(),
            OrderStatus.CONFIRMED,
            "payment-ref-789",
            "Cliente",
            "cliente@email.com",
            "11999999999"
        );

        when(bookRepository.findById(bookId1)).thenReturn(Optional.of(book1));

        // Act
        useCase.execute(singleItemOrder);

        // Assert
        assertEquals(9, book1.getStock()); // 10 - 1 = 9
        verify(bookRepository, times(1)).save(book1);
    }
}

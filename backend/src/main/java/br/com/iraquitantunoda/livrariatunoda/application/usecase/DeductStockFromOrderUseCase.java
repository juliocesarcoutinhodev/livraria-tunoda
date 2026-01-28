package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use Case para deduzir estoque dos livros quando um pedido é confirmado.
 * Processa todos os itens do pedido e atualiza o estoque de cada livro.
 * Garante atomicidade: se falhar em qualquer livro, toda a operação é revertida.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DeductStockFromOrderUseCase {

    private final BookRepository bookRepository;

    /**
     * Deduz o estoque de todos os livros do pedido.
     *
     * @param order Pedido confirmado
     * @throws ResourceNotFoundException se algum livro não for encontrado
     * @throws BusinessException se houver estoque insuficiente
     */
    @Transactional
    public void execute(Order order) {
        log.info("Iniciando deducao de estoque para order: {}", order.getId().getValue());

        if (order.getItems().isEmpty()) {
            log.warn("Order {} nao possui itens. Nenhuma deducao de estoque necessaria", order.getId().getValue());
            return;
        }

        int totalItemsProcessed = 0;
        int totalQuantityDeducted = 0;

        for (var orderItem : order.getItems()) {
            var bookId = orderItem.getBookId();
            var quantity = orderItem.getQuantity();

            log.debug("Processando item: Book {} ({}), Quantidade: {}",
                bookId.getValue(), orderItem.getBookTitle(), quantity);

            // Busca o livro
            var book = bookRepository.findById(bookId)
                .orElseThrow(() -> {
                    log.error("Livro nao encontrado ao deduzir estoque. BookId: {}, Order: {}",
                        bookId.getValue(), order.getId().getValue());
                    return new ResourceNotFoundException(
                        "Livro nao encontrado: " + orderItem.getBookTitle()
                    );
                });

            // Valida se o livro tem estoque suficiente
            int stockBefore = book.getStock();

            if (stockBefore < quantity) {
                log.error("Estoque insuficiente para livro {}. Disponivel: {}, Solicitado: {}",
                    book.getTitle(), stockBefore, quantity);
                throw new BusinessException(
                    String.format("Estoque insuficiente para o livro '%s'. Disponivel: %d, Necessario: %d",
                        book.getTitle(), stockBefore, quantity)
                );
            }

            // Remove o estoque
            book.removeStock(quantity);
            bookRepository.save(book);

            int stockAfter = book.getStock();

            log.info("Estoque deduzido com sucesso. Livro: {} | Antes: {} | Deduzido: {} | Depois: {}",
                book.getTitle(), stockBefore, quantity, stockAfter);

            totalItemsProcessed++;
            totalQuantityDeducted += quantity;

            // Alerta de estoque baixo
            if (book.hasLowStock(5)) {
                log.warn("ALERTA: Estoque baixo para livro '{}'. Estoque atual: {}",
                    book.getTitle(), stockAfter);
            }

            if (book.isOutOfStock()) {
                log.warn("ALERTA: Livro '{}' ESGOTADO apos deducao", book.getTitle());
            }
        }

        log.info("Deducao de estoque concluida com sucesso. Order: {} | Itens processados: {} | Quantidade total deduzida: {}",
            order.getId().getValue(), totalItemsProcessed, totalQuantityDeducted);
    }
}

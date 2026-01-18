package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.BookResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.UpdateStockRequest;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.BookDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UpdateBookStockUseCase {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final BookDTOMapper bookDTOMapper;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional
    public BookResponse execute(String bookId, UpdateStockRequest request) {
        var book = bookRepository.findById(BookId.of(bookId))
            .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));

        var oldStock = book.getStock();

        switch (request.operation()) {
            case ADD -> book.addStock(request.quantity());
            case REMOVE -> book.removeStock(request.quantity());
            case SET -> book.setStock(request.quantity());
        }

        var savedBook = bookRepository.save(book);

        log.info("Estoque do livro {} atualizado: {} -> {} (Operação: {}, Motivo: {})",
            bookId,
            oldStock,
            savedBook.getStock(),
            request.operation(),
            request.reason() != null ? request.reason() : "Não informado"
        );

        var authors = authorRepository.findByIds(book.getAuthorIds());
        var authorSummaries = authors.stream()
            .map(authorDTOMapper::toSummaryDTO)
            .toList();

        return bookDTOMapper.toResponse(savedBook, authorSummaries);
    }
}

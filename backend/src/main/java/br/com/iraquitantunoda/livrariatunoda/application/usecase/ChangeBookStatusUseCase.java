package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.BookResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ChangeStatusRequest;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.BookDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChangeBookStatusUseCase {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final BookDTOMapper bookDTOMapper;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional
    public BookResponse execute(String bookId, ChangeStatusRequest request) {
        var book = findBookOrThrow(bookId);
        var newStatus = Status.valueOf(request.status());

        if (newStatus == Status.ACTIVE) {
            validateCanActivate(book);
        }

        changeStatus(book, newStatus);

        var savedBook = bookRepository.save(book);

        var authors = authorRepository.findByIds(book.getAuthorIds());
        var authorSummaries = authors.stream()
            .map(authorDTOMapper::toSummaryDTO)
            .toList();

        return bookDTOMapper.toResponse(savedBook, authorSummaries);
    }

    private Book findBookOrThrow(String bookId) {
        return bookRepository.findById(BookId.of(bookId))
            .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));
    }

    private void validateCanActivate(Book book) {
        var authors = authorRepository.findByIds(book.getAuthorIds());

        var hasActiveAuthor = authors.stream()
            .anyMatch(Author::isActive);

        if (!hasActiveAuthor) {
            throw new BusinessException(
                "Não é possível ativar o livro pois ele não possui nenhum autor ativo"
            );
        }
    }

    private void changeStatus(Book book, Status newStatus) {
        if (newStatus == Status.ACTIVE) {
            book.activate();
        } else {
            book.deactivate();
        }
    }
}


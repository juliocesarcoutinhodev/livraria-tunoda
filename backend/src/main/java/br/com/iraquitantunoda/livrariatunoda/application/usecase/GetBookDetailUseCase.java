package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.BookDetailResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.BookDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetBookDetailUseCase {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final BookDTOMapper bookDTOMapper;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional(readOnly = true)
    public BookDetailResponse execute(String bookId) {
        var book = findBookOrThrow(bookId);

        validateBookIsActive(book);

        var authorsMap = fetchAuthorsAsMap(book);

        return mapToResponse(book, authorsMap);
    }

    private Book findBookOrThrow(String bookId) {
        return bookRepository.findById(BookId.of(bookId))
            .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));
    }

    private void validateBookIsActive(Book book) {
        if (!book.isActive()) {
            throw new ResourceNotFoundException("Livro não está disponível");
        }
    }

    private Map<String, Author> fetchAuthorsAsMap(Book book) {
        return authorRepository.findByIds(book.getAuthorIds())
            .stream()
            .collect(Collectors.toMap(
                author -> author.getId().getValue(),
                author -> author
            ));
    }

    private BookDetailResponse mapToResponse(Book book, Map<String, Author> authorsMap) {
        var authorDetails = book.getAuthorIds().stream()
            .map(AuthorId::getValue)
            .map(authorsMap::get)
            .filter(java.util.Objects::nonNull)
            .map(authorDTOMapper::toDetailDTO)
            .toList();

        return bookDTOMapper.toDetailResponse(book, authorDetails);
    }
}


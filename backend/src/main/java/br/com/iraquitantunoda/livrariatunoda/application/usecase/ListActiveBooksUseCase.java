package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.BookCatalogResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.PageResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.BookDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListActiveBooksUseCase {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final BookDTOMapper bookDTOMapper;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional(readOnly = true)
    public PageResponse<BookCatalogResponse> execute(int page, int size) {
        var pageResult = bookRepository.findAllActiveWithPagination(page, size);
        var books = pageResult.content();

        if (books.isEmpty()) {
            return new PageResponse<>(
                List.of(),
                pageResult.page(),
                pageResult.size(),
                pageResult.totalElements()
            );
        }

        var allAuthorIds = extractAllAuthorIds(books);
        var authorsMap = fetchAuthorsAsMap(allAuthorIds);

        var responses = books.stream()
            .map(book -> mapToResponse(book, authorsMap))
            .toList();

        return new PageResponse<>(
            responses,
            pageResult.page(),
            pageResult.size(),
            pageResult.totalElements()
        );
    }

    private Set<AuthorId> extractAllAuthorIds(List<Book> books) {
        var authorIds = new HashSet<AuthorId>();
        books.forEach(book -> authorIds.addAll(book.getAuthorIds()));
        return authorIds;
    }

    private Map<String, Author> fetchAuthorsAsMap(Set<AuthorId> authorIds) {
        return authorRepository.findByIds(authorIds)
            .stream()
            .collect(Collectors.toMap(
                author -> author.getId().getValue(),
                author -> author
            ));
    }

    private BookCatalogResponse mapToResponse(Book book, Map<String, Author> authorsMap) {
        var authorSummaries = book.getAuthorIds().stream()
            .map(AuthorId::getValue)
            .map(authorsMap::get)
            .filter(java.util.Objects::nonNull)
            .map(authorDTOMapper::toSummaryDTO)
            .toList();

        return bookDTOMapper.toCatalogResponse(book, authorSummaries);
    }
}


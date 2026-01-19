package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorSummaryDTO;
import br.com.iraquitantunoda.livrariatunoda.application.dto.BookResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.BookDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.AuthorEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.BookEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.AuthorJpaRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.BookJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetBookDetailAdminUseCase {

    private final BookJpaRepository bookJpaRepository;
    private final AuthorJpaRepository authorJpaRepository;
    private final BookDTOMapper bookDTOMapper;

    @Transactional(readOnly = true)
    public BookResponse execute(String bookId) {
        var book = findBookOrThrow(bookId);
        var authorsMap = fetchAuthorsAsMap(book);

        var authorSummaries = book.getAuthorIds().stream()
            .map(authorsMap::get)
            .filter(java.util.Objects::nonNull)
            .map(this::toAuthorSummary)
            .toList();

        return bookDTOMapper.toResponseFromEntity(book, authorSummaries);
    }

    private BookEntity findBookOrThrow(String bookId) {
        return bookJpaRepository.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));
    }

    private Map<String, AuthorEntity> fetchAuthorsAsMap(BookEntity book) {
        return authorJpaRepository.findAllById(book.getAuthorIds())
            .stream()
            .collect(Collectors.toMap(
                AuthorEntity::getId,
                author -> author
            ));
    }

    private AuthorSummaryDTO toAuthorSummary(AuthorEntity author) {
        return new AuthorSummaryDTO(
            author.getId(),
            author.getName()
        );
    }
}

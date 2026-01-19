package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorSummaryDTO;
import br.com.iraquitantunoda.livrariatunoda.application.dto.BookResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.PageResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.BookDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.AuthorEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.BookEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.AuthorJpaRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.BookJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListBooksUseCase {

    private final BookJpaRepository bookJpaRepository;
    private final AuthorJpaRepository authorJpaRepository;
    private final BookDTOMapper bookDTOMapper;

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> execute(int page, int size, Status status, String authorId, Boolean lowStock, String title, String sortBy, String sortDirection) {
        var sort = createSort(sortBy != null ? sortBy : "createdAt", sortDirection != null ? sortDirection : "desc");
        var pageable = PageRequest.of(page, size, sort);
        var pageResult = bookJpaRepository.findAllWithFilters(status, authorId, lowStock, title, pageable);

        var bookEntities = pageResult.getContent();

        if (bookEntities.isEmpty()) {
            return new PageResponse<>(
                List.of(),
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements()
            );
        }

        var allAuthorIds = extractAllAuthorIds(bookEntities);
        var authorsMap = fetchAuthorsAsMap(allAuthorIds);

        var responses = bookEntities.stream()
            .map(book -> mapToResponse(book, authorsMap))
            .toList();

        return new PageResponse<>(
            responses,
            pageResult.getNumber(),
            pageResult.getSize(),
            pageResult.getTotalElements()
        );
    }

    private Set<String> extractAllAuthorIds(List<BookEntity> books) {
        var authorIds = new HashSet<String>();
        books.forEach(book -> authorIds.addAll(book.getAuthorIds()));
        return authorIds;
    }

    private Map<String, AuthorEntity> fetchAuthorsAsMap(Set<String> authorIds) {
        return authorJpaRepository.findAllById(authorIds)
            .stream()
            .collect(Collectors.toMap(
                AuthorEntity::getId,
                author -> author
            ));
    }

    private BookResponse mapToResponse(BookEntity book, Map<String, AuthorEntity> authorsMap) {
        var authorSummaries = book.getAuthorIds().stream()
            .map(authorsMap::get)
            .filter(java.util.Objects::nonNull)
            .map(this::toAuthorSummary)
            .toList();

        return bookDTOMapper.toResponseFromEntity(book, authorSummaries);
    }

    private AuthorSummaryDTO toAuthorSummary(AuthorEntity author) {
        return new AuthorSummaryDTO(
            author.getId(),
            author.getName()
        );
    }

    private Sort createSort(String sortBy, String sortDirection) {
        var direction = "desc".equalsIgnoreCase(sortDirection)
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;
        return Sort.by(direction, sortBy);
    }
}


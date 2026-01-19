package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.PageResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.AuthorJpaRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ListAuthorsUseCase {

    private final AuthorJpaRepository authorJpaRepository;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional(readOnly = true)
    public PageResponse<AuthorResponse> execute(int page, int size, Status status, String name, String sortBy, String sortDirection) {
        var sort = createSort(sortBy != null ? sortBy : "name", sortDirection != null ? sortDirection : "asc");
        var pageable = PageRequest.of(page, size, sort);
        var pageResult = authorJpaRepository.findWithFilters(status, name, pageable);

        var responses = pageResult.getContent().stream()
            .map(authorDTOMapper::toResponseFromEntity)
            .toList();

        return new PageResponse<>(
            responses,
            pageResult.getNumber(),
            pageResult.getSize(),
            pageResult.getTotalElements()
        );
    }

    private Sort createSort(String sortBy, String sortDirection) {
        var direction = "desc".equalsIgnoreCase(sortDirection)
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;
        return Sort.by(direction, sortBy);
    }
}

package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.PageResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ListAuthorsUseCase {

    private final AuthorRepository authorRepository;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional(readOnly = true)
    public PageResponse<AuthorResponse> execute(int page, int size, Status status, String name) {
        var pageResult = authorRepository.findWithFilters(page, size, status, name);

        var responses = pageResult.content().stream()
            .map(authorDTOMapper::toResponse)
            .toList();

        return new PageResponse<>(
            responses,
            pageResult.page(),
            pageResult.size(),
            pageResult.totalElements()
        );
    }
}

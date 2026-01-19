package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetAuthorDetailUseCase {

    private final AuthorRepository authorRepository;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional(readOnly = true)
    public AuthorResponse execute(String authorId) {
        var author = findAuthorOrThrow(authorId);
        return authorDTOMapper.toResponse(author);
    }

    private Author findAuthorOrThrow(String authorId) {
        return authorRepository.findById(AuthorId.of(authorId))
            .orElseThrow(() -> new ResourceNotFoundException("Autor não encontrado"));
    }
}

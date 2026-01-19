package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.AuthorEntity;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.AuthorJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetAuthorDetailUseCase {

    private final AuthorJpaRepository authorJpaRepository;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional(readOnly = true)
    public AuthorResponse execute(String authorId) {
        var author = findAuthorOrThrow(authorId);
        return authorDTOMapper.toResponseFromEntity(author);
    }

    private AuthorEntity findAuthorOrThrow(String authorId) {
        return authorJpaRepository.findById(authorId)
            .orElseThrow(() -> new ResourceNotFoundException("Autor não encontrado"));
    }
}

package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.UpdateAuthorRequest;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateAuthorUseCase {

    private final AuthorRepository authorRepository;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional
    public AuthorResponse execute(String authorId, UpdateAuthorRequest request) {
        var existingAuthor = findAuthorOrThrow(authorId);

        var updatedAuthor = Author.reconstitute(
            existingAuthor.getId(),
            request.name(),
            request.biography(),
            request.photoUrl(),
            Status.valueOf(request.status())
        );

        var savedAuthor = authorRepository.save(updatedAuthor);

        return authorDTOMapper.toResponse(savedAuthor);
    }

    private Author findAuthorOrThrow(String authorId) {
        return authorRepository.findById(AuthorId.of(authorId))
            .orElseThrow(() -> new ResourceNotFoundException("Autor não encontrado"));
    }
}


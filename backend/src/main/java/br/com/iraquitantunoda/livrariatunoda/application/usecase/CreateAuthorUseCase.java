package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.CreateAuthorRequest;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateAuthorUseCase {

    private final AuthorRepository authorRepository;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional
    public AuthorResponse execute(CreateAuthorRequest request) {
        var author = Author.create(
            request.name(),
            request.biography(),
            request.photoUrl()
        );

        var savedAuthor = authorRepository.save(author);

        return authorDTOMapper.toResponse(savedAuthor);
    }
}


package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ChangeStatusRequest;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChangeAuthorStatusUseCase {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional
    public AuthorResponse execute(String authorId, ChangeStatusRequest request) {
        var author = findAuthorOrThrow(authorId);
        var newStatus = Status.valueOf(request.status());

        if (newStatus == Status.INACTIVE) {
            validateCanDeactivate(author);
        }

        changeStatus(author, newStatus);

        var savedAuthor = authorRepository.save(author);

        return authorDTOMapper.toResponse(savedAuthor);
    }

    private Author findAuthorOrThrow(String authorId) {
        return authorRepository.findById(AuthorId.of(authorId))
            .orElseThrow(() -> new ResourceNotFoundException("Autor não encontrado"));
    }

    private void validateCanDeactivate(Author author) {
        var activeBookCount = bookRepository.countActiveBooksByAuthorId(author.getId());

        if (activeBookCount > 0) {
            throw new BusinessException(
                "Não é possível desativar o autor pois existem " + activeBookCount +
                " livro(s) ativo(s) associado(s) a ele"
            );
        }
    }

    private void changeStatus(Author author, Status newStatus) {
        if (newStatus == Status.ACTIVE) {
            author.activate();
        } else {
            author.deactivate();
        }
    }
}


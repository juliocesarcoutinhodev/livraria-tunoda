package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.BookResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.UpdateBookRequest;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.AuthorDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.BookDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ISBN;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Status;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Weight;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.WeightUnit;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.AuthorRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UpdateBookUseCase {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final BookDTOMapper bookDTOMapper;
    private final AuthorDTOMapper authorDTOMapper;

    @Transactional
    public BookResponse execute(String bookId, UpdateBookRequest request) {
        var existingBook = findBookOrThrow(bookId);

        var authorIds = convertToAuthorIds(request.authorIds());

        validateAuthorsExistAndActive(authorIds);

        var isbn = request.isbn() != null && !request.isbn().isBlank()
            ? ISBN.of(request.isbn())
            : null;

        var money = Money.of(
            request.price(),
            request.currency() != null ? request.currency() : "BRL"
        );

        var weight = Weight.of(
            request.weight(),
            WeightUnit.valueOf(request.weightUnit().toUpperCase())
        );

        var updatedBook = Book.reconstitute(
            existingBook.getId(),
            request.title(),
            request.description(),
            request.photoUrl(),
            isbn,
            money,
            weight,
            authorIds,
            Status.valueOf(request.status())
        );

        var savedBook = bookRepository.save(updatedBook);

        var authors = authorRepository.findByIds(authorIds);
        var authorSummaries = authors.stream()
            .map(authorDTOMapper::toSummaryDTO)
            .toList();

        return bookDTOMapper.toResponse(savedBook, authorSummaries);
    }

    private Book findBookOrThrow(String bookId) {
        return bookRepository.findById(BookId.of(bookId))
            .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));
    }

    private Set<AuthorId> convertToAuthorIds(Set<String> authorIdStrings) {
        return authorIdStrings.stream()
            .map(AuthorId::of)
            .collect(Collectors.toSet());
    }

    private void validateAuthorsExistAndActive(Set<AuthorId> authorIds) {
        var existingAuthors = authorRepository.findByIds(authorIds);

        if (existingAuthors.size() != authorIds.size()) {
            throw new BusinessException("Um ou mais autores informados não existem");
        }

        var inactiveAuthors = existingAuthors.stream()
            .filter(author -> !author.isActive())
            .toList();

        if (!inactiveAuthors.isEmpty()) {
            throw new BusinessException("Um ou mais autores informados estão inativos");
        }
    }
}


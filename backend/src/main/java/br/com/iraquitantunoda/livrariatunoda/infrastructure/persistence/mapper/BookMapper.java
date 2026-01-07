package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper;

import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ISBN;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Weight;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.BookEntity;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.ERROR,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface BookMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "bookIdToString")
    @Mapping(target = "isbn", source = "isbn", qualifiedByName = "isbnToString")
    @Mapping(target = "priceAmount", source = "price.amount")
    @Mapping(target = "priceCurrency", source = "price.currency")
    @Mapping(target = "weightValue", source = "weight.value")
    @Mapping(target = "weightUnit", source = "weight.unit")
    @Mapping(target = "authorIds", source = "authorIds", qualifiedByName = "authorIdsToStrings")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    BookEntity toEntity(Book book);

    default Book toDomain(BookEntity entity) {
        return Book.reconstitute(
            stringToBookId(entity.getId()),
            entity.getTitle(),
            entity.getDescription(),
            entity.getPhotoUrl(),
            stringToIsbn(entity.getIsbn()),
            Money.of(entity.getPriceAmount(), entity.getPriceCurrency()),
            Weight.of(entity.getWeightValue(), entity.getWeightUnit()),
            stringsToAuthorIds(entity.getAuthorIds()),
            entity.getStatus()
        );
    }

    @Named("bookIdToString")
    default String bookIdToString(BookId bookId) {
        return bookId != null ? bookId.getValue() : null;
    }

    @Named("stringToBookId")
    default BookId stringToBookId(String id) {
        return id != null ? BookId.of(id) : null;
    }

    @Named("isbnToString")
    default String isbnToString(ISBN isbn) {
        return isbn != null ? isbn.getValue() : null;
    }

    @Named("stringToIsbn")
    default ISBN stringToIsbn(String isbn) {
        return isbn != null ? ISBN.of(isbn) : null;
    }


    @Named("authorIdsToStrings")
    default Set<String> authorIdsToStrings(Set<AuthorId> authorIds) {
        return authorIds != null
            ? authorIds.stream()
                .map(AuthorId::getValue)
                .collect(Collectors.toSet())
            : Set.of();
    }

    @Named("stringsToAuthorIds")
    default Set<AuthorId> stringsToAuthorIds(Set<String> authorIdStrings) {
        return authorIdStrings != null
            ? authorIdStrings.stream()
                .map(AuthorId::of)
                .collect(Collectors.toSet())
            : Set.of();
    }
}


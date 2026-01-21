package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.*;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.BookEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring")
public interface BookDTOMapper {

    DateTimeFormatter BRAZILIAN_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Mapping(target = "id", source = "book.id.value")
    @Mapping(target = "title", source = "book.title")
    @Mapping(target = "description", source = "book.description")
    @Mapping(target = "photoUrl", source = "book.photoUrl")
    @Mapping(target = "price", source = "book.price.amount")
    @Mapping(target = "currency", source = "book.price.currency")
    @Mapping(target = "authors", source = "authors")
    BookCatalogResponse toCatalogResponse(Book book, List<AuthorSummaryDTO> authors);

    @Mapping(target = "id", source = "book.id.value")
    @Mapping(target = "title", source = "book.title")
    @Mapping(target = "description", source = "book.description")
    @Mapping(target = "photoUrl", source = "book.photoUrl")
    @Mapping(target = "isbn", expression = "java(book.getIsbn() != null ? book.getIsbn().getValue() : null)")
    @Mapping(target = "price", source = "book.price.amount")
    @Mapping(target = "currency", source = "book.price.currency")
    @Mapping(target = "weight", source = "book.weight.value")
    @Mapping(target = "weightUnit", source = "book.weight.unit")
    @Mapping(target = "stock", source = "book.stock")
    @Mapping(target = "status", source = "book.status")
    @Mapping(target = "authors", source = "authors")
    BookDetailResponse toDetailResponse(Book book, List<AuthorDetailDTO> authors);

    @Mapping(target = "id", source = "book.id.value")
    @Mapping(target = "isbn", expression = "java(book.getIsbn() != null ? book.getIsbn().getValue() : null)")
    @Mapping(target = "price", source = "book.price.amount")
    @Mapping(target = "currency", source = "book.price.currency")
    @Mapping(target = "weight", source = "book.weight.value")
    @Mapping(target = "weightUnit", expression = "java(book.getWeight().getUnit().name())")
    @Mapping(target = "stock", source = "book.stock")
    @Mapping(target = "status", expression = "java(book.getStatus().name())")
    @Mapping(target = "authors", source = "authors")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    BookResponse toResponse(Book book, List<AuthorSummaryDTO> authors);

    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "title", source = "entity.title")
    @Mapping(target = "description", source = "entity.description")
    @Mapping(target = "photoUrl", source = "entity.photoUrl")
    @Mapping(target = "isbn", source = "entity.isbn")
    @Mapping(target = "price", source = "entity.priceAmount")
    @Mapping(target = "currency", source = "entity.priceCurrency")
    @Mapping(target = "weight", source = "entity.weightValue")
    @Mapping(target = "weightUnit", expression = "java(entity.getWeightUnit().name())")
    @Mapping(target = "stock", source = "entity.stock")
    @Mapping(target = "status", expression = "java(entity.getStatus().name())")
    @Mapping(target = "authors", source = "authors")
    @Mapping(target = "createdAt", source = "entity.createdAt", qualifiedByName = "formatDate")
    @Mapping(target = "updatedAt", source = "entity.updatedAt", qualifiedByName = "formatDate")
    BookResponse toResponseFromEntity(BookEntity entity, List<AuthorSummaryDTO> authors);

    @Named("formatDate")
    default String formatDate(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(BRAZILIAN_DATE_FORMAT) : null;
    }
}


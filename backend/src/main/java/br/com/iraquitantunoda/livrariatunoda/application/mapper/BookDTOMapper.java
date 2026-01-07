package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.*;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Book;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookDTOMapper {

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
    @Mapping(target = "authors", source = "authors")
    BookDetailResponse toDetailResponse(Book book, List<AuthorDetailDTO> authors);

    @Mapping(target = "id", source = "book.id.value")
    @Mapping(target = "isbn", expression = "java(book.getIsbn() != null ? book.getIsbn().getValue() : null)")
    @Mapping(target = "price", source = "book.price.amount")
    @Mapping(target = "currency", source = "book.price.currency")
    @Mapping(target = "weight", source = "book.weight.value")
    @Mapping(target = "weightUnit", expression = "java(book.getWeight().getUnit().name())")
    @Mapping(target = "status", expression = "java(book.getStatus().name())")
    @Mapping(target = "authors", source = "authors")
    BookResponse toResponse(Book book, List<AuthorSummaryDTO> authors);
}

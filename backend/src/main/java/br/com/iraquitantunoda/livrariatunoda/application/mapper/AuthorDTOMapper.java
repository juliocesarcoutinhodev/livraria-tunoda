package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorDetailDTO;
import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorSummaryDTO;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.AuthorEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface AuthorDTOMapper {

    DateTimeFormatter BRAZILIAN_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Mapping(target = "id", source = "id.value")
    AuthorSummaryDTO toSummaryDTO(Author author);

    @Mapping(target = "id", source = "id.value")
    AuthorDetailDTO toDetailDTO(Author author);

    @Mapping(target = "id", source = "id.value")
    @Mapping(target = "status", expression = "java(author.getStatus().name())")
    AuthorResponse toResponse(Author author);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "status", expression = "java(entity.getStatus().name())")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "formatDate")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "formatDate")
    AuthorResponse toResponseFromEntity(AuthorEntity entity);

    @Named("formatDate")
    default String formatDate(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(BRAZILIAN_DATE_FORMAT) : null;
    }
}

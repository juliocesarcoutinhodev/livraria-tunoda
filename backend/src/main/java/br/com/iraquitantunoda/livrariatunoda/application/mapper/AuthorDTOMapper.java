package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorDetailDTO;
import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthorSummaryDTO;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthorDTOMapper {

    @Mapping(target = "id", source = "id.value")
    AuthorSummaryDTO toSummaryDTO(Author author);

    @Mapping(target = "id", source = "id.value")
    AuthorDetailDTO toDetailDTO(Author author);

    @Mapping(target = "id", source = "id.value")
    @Mapping(target = "status", expression = "java(author.getStatus().name())")
    AuthorResponse toResponse(Author author);
}

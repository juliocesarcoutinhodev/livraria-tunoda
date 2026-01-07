package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Author;
import br.com.iraquitantunoda.livrariatunoda.domain.model.AuthorId;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.AuthorEntity;
import org.mapstruct.*;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.ERROR,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AuthorMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "authorIdToString")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    AuthorEntity toEntity(Author author);

    default Author toDomain(AuthorEntity entity) {
        return Author.reconstitute(
            stringToAuthorId(entity.getId()),
            entity.getName(),
            entity.getBiography(),
            entity.getPhotoUrl(),
            entity.getStatus()
        );
    }

    @Named("authorIdToString")
    default String authorIdToString(AuthorId authorId) {
        return authorId != null ? authorId.getValue() : null;
    }

    @Named("stringToAuthorId")
    default AuthorId stringToAuthorId(String id) {
        return id != null ? AuthorId.of(id) : null;
    }
}


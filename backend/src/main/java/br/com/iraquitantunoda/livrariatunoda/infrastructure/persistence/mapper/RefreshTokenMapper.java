package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper;

import br.com.iraquitantunoda.livrariatunoda.domain.model.RefreshToken;
import br.com.iraquitantunoda.livrariatunoda.domain.model.RefreshTokenId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.RefreshTokenEntity;
import org.mapstruct.*;

/**
 * MapStruct mapper para RefreshToken <-> RefreshTokenEntity.
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.ERROR,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface RefreshTokenMapper {

    @Mapping(target = "id", source = "id", qualifiedByName = "tokenIdToString")
    @Mapping(target = "userId", source = "userId", qualifiedByName = "userIdToString")
    RefreshTokenEntity toEntity(RefreshToken token);

    default RefreshToken toDomain(RefreshTokenEntity entity) {
        return RefreshToken.reconstitute(
            RefreshTokenId.of(entity.getId()),
            UserId.of(entity.getUserId()),
            entity.getToken(),
            entity.getCreatedAt(),
            entity.getExpiresAt(),
            entity.isRevoked()
        );
    }

    @Named("tokenIdToString")
    default String tokenIdToString(RefreshTokenId id) {
        return id != null ? id.getValue() : null;
    }

    @Named("userIdToString")
    default String userIdToString(UserId id) {
        return id != null ? id.getValue() : null;
    }
}


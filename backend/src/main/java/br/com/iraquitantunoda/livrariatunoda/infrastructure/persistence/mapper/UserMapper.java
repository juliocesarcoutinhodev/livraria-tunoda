package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper;

import br.com.iraquitantunoda.livrariatunoda.domain.model.User;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Email;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.UserEntity;
import org.mapstruct.*;

/**
 * MapStruct mapper para conversao User (domain) <-> UserEntity (infrastructure).
 * Responsavel por converter entre as camadas sem vazar dependencias.
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.ERROR,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserMapper {

    /**
     * Converte User (dominio) para UserEntity (JPA).
     * Usado ao persistir no banco de dados.
     *
     * @param user Usuario do dominio
     * @return Entidade JPA
     */
    @Mapping(target = "id", source = "id", qualifiedByName = "userIdToString")
    @Mapping(target = "email", source = "email", qualifiedByName = "emailToString")
    @Mapping(target = "passwordHash", expression = "java(getPasswordHashFromDomain(user))")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", ignore = true)
    UserEntity toEntity(User user);

    /**
     * Converte UserEntity (JPA) para User (dominio).
     * Usado ao buscar do banco de dados.
     *
     * @param entity Entidade JPA
     * @return Usuario do dominio
     */
    default User toDomain(UserEntity entity) {
        return User.reconstitute(
            UserId.of(entity.getId()),
            entity.getName(),
            Email.of(entity.getEmail()),
            entity.getPasswordHash(),
            entity.getRole(),
            entity.getCreatedAt(),
            entity.getStatus()
        );
    }

    @Named("userIdToString")
    default String userIdToString(UserId userId) {
        return userId != null ? userId.getValue() : null;
    }

    @Named("emailToString")
    default String emailToString(Email email) {
        return email != null ? email.getValue() : null;
    }

    /**
     * Extrai o hash da senha do dominio.
     * Usa reflexao via metodo package-private getPasswordHash().
     *
     * @param user Usuario do dominio
     * @return Hash da senha
     */
    default String getPasswordHashFromDomain(User user) {
        if (user == null) {
            return null;
        }
        try {
            var method = User.class.getDeclaredMethod("getPasswordHash");
            method.setAccessible(true);
            return (String) method.invoke(user);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao extrair passwordHash do dominio", e);
        }
    }
}


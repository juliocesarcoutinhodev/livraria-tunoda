package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository;

import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository para UserEntity.
 * Metodos customizados para queries especificas.
 */
@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, String> {

    /**
     * Busca usuario por email.
     * Usado para autenticacao e validacao de unicidade.
     *
     * @param email Email do usuario (unique constraint)
     * @return Optional com usuario se encontrado
     */
    Optional<UserEntity> findByEmail(String email);

    /**
     * Verifica se existe usuario com o email informado.
     * Usado para validar unicidade antes de criar.
     *
     * @param email Email a verificar
     * @return true se email ja esta em uso
     */
    boolean existsByEmail(String email);
}


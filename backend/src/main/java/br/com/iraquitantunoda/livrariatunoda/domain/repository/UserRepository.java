package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.User;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Email;

import java.util.Optional;

/**
 * Repository para agregado User.
 * Interface no dominio, implementacao na infraestrutura.
 */
public interface UserRepository {

    /**
     * Salva um usuario (create ou update).
     *
     * @param user Usuario a ser salvo
     * @return Usuario salvo
     */
    User save(User user);

    /**
     * Busca usuario por ID.
     *
     * @param id Identificador do usuario
     * @return Optional com usuario se encontrado
     */
    Optional<User> findById(UserId id);

    /**
     * Busca usuario por email.
     * Usado para validar unicidade e autenticacao.
     *
     * @param email Email do usuario
     * @return Optional com usuario se encontrado
     */
    Optional<User> findByEmail(Email email);

    /**
     * Verifica se existe usuario com o email informado.
     * Usado para validar unicidade antes de criar.
     *
     * @param email Email a verificar
     * @return true se email ja esta em uso
     */
    boolean existsByEmail(Email email);
}


package br.com.iraquitantunoda.livrariatunoda.domain.model;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Email;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.UserRole;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.UserStatus;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * Aggregate Root que representa um usuario administrativo do sistema.
 * Responsavel por autenticacao e autorizacao de operacoes sensíveis.
 *
 * Regras de negocio:
 * - Email e unico no sistema
 * - Senha armazenada apenas como hash (nunca em texto plano)
 * - Usuario pode ser bloqueado/desbloqueado
 * - Status inicial sempre ACTIVE
 * - Campos imutaveis exceto status
 */
@Getter
@ToString(exclude = {"passwordHash"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @EqualsAndHashCode.Include
    private final UserId id;
    private final String name;
    private final Email email;

    @Getter(AccessLevel.NONE)
    private final String passwordHash;

    private final UserRole role;
    private final LocalDateTime createdAt;
    private UserStatus status;

    private User(UserId id, String name, Email email, String passwordHash, UserRole role,
                 LocalDateTime createdAt, UserStatus status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = createdAt;
        this.status = status;
    }

    /**
     * Cria um novo usuario administrativo.
     * Senha deve ser fornecida ja como hash (BCrypt, Argon2, etc).
     *
     * @param name Nome do usuario
     * @param email Email unico do usuario
     * @param passwordHash Hash da senha (nunca senha em texto plano)
     * @return Usuario criado com status ACTIVE
     */
    public static User create(String name, Email email, String passwordHash) {
        validate(name, email, passwordHash);

        return new User(
            UserId.generate(),
            name,
            email,
            passwordHash,
            UserRole.ADMIN,
            LocalDateTime.now(),
            UserStatus.ACTIVE
        );
    }

    /**
     * Reconstitui um usuario existente (ex: do banco de dados).
     *
     * @param id Identificador do usuario
     * @param name Nome do usuario
     * @param email Email do usuario
     * @param passwordHash Hash da senha
     * @param role Papel do usuario
     * @param createdAt Data de criacao
     * @param status Status atual
     * @return Usuario reconstituido
     */
    public static User reconstitute(UserId id, String name, Email email, String passwordHash,
                                    UserRole role, LocalDateTime createdAt, UserStatus status) {
        validate(name, email, passwordHash);
        return new User(id, name, email, passwordHash, role, createdAt, status);
    }

    private static void validate(String name, Email email, String passwordHash) {
        if (name == null || name.isBlank()) {
            throw new BusinessException("Nome do usuario e obrigatorio");
        }
        if (name.length() > 200) {
            throw new BusinessException("Nome do usuario nao pode exceder 200 caracteres");
        }
        if (email == null) {
            throw new BusinessException("Email do usuario e obrigatorio");
        }
        if (passwordHash == null || passwordHash.isBlank()) {
            throw new BusinessException("Hash da senha e obrigatorio");
        }
    }

    /**
     * Bloqueia o usuario, impedindo acesso ao sistema.
     */
    public void block() {
        if (this.status == UserStatus.BLOCKED) {
            throw new BusinessException("Usuario ja esta bloqueado");
        }
        this.status = UserStatus.BLOCKED;
    }

    /**
     * Desbloqueia o usuario, permitindo acesso ao sistema.
     */
    public void unblock() {
        if (this.status == UserStatus.ACTIVE) {
            throw new BusinessException("Usuario ja esta ativo");
        }
        this.status = UserStatus.ACTIVE;
    }

    /**
     * Verifica se o usuario esta ativo.
     *
     * @return true se status for ACTIVE
     */
    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }

    /**
     * Verifica se o usuario esta bloqueado.
     *
     * @return true se status for BLOCKED
     */
    public boolean isBlocked() {
        return this.status == UserStatus.BLOCKED;
    }

    /**
     * Verifica se o usuario tem papel de administrador.
     *
     * @return true se role for ADMIN
     */
    public boolean isAdmin() {
        return this.role == UserRole.ADMIN;
    }

    /**
     * Retorna o hash da senha para comparacao durante autenticacao.
     * Metodo package-private para uso apenas dentro do dominio.
     *
     * @return Hash da senha
     */
    String getPasswordHash() {
        return passwordHash;
    }

    /**
     * Verifica se o hash fornecido corresponde ao hash armazenado.
     * Usado durante o processo de autenticacao.
     *
     * @param hashedPassword Hash da senha a ser comparado
     * @return true se os hashes correspondem
     */
    public boolean matchesPassword(String hashedPassword) {
        if (hashedPassword == null) {
            return false;
        }
        return this.passwordHash.equals(hashedPassword);
    }
}


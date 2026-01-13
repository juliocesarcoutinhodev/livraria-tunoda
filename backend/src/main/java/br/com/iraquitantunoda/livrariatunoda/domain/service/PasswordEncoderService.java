package br.com.iraquitantunoda.livrariatunoda.domain.service;

/**
 * Service de dominio para encoding e validacao de senhas.
 * Interface no dominio, implementacao na infraestrutura (BCrypt).
 */
public interface PasswordEncoderService {

    /**
     * Codifica uma senha em texto plano para hash BCrypt.
     *
     * @param rawPassword Senha em texto plano
     * @return Hash BCrypt da senha
     */
    String encode(String rawPassword);

    /**
     * Verifica se a senha em texto plano corresponde ao hash.
     *
     * @param rawPassword Senha em texto plano
     * @param encodedPassword Hash BCrypt armazenado
     * @return true se correspondem
     */
    boolean matches(String rawPassword, String encodedPassword);
}


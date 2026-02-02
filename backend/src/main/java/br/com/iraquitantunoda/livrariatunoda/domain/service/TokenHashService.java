package br.com.iraquitantunoda.livrariatunoda.domain.service;

/**
 * Servico de dominio para operacoes de hash de tokens.
 * Utilizado para armazenar tokens de forma segura no banco de dados.
 */
public interface TokenHashService {

    /**
     * Gera hash SHA-256 de um token.
     * O hash e utilizado para armazenamento seguro no banco de dados.
     *
     * @param token Token em texto puro
     * @return Hash SHA-256 do token em hexadecimal
     */
    String hashToken(String token);

    /**
     * Verifica se um token corresponde a um hash armazenado.
     *
     * @param token Token em texto puro
     * @param hash Hash armazenado no banco
     * @return true se o token corresponde ao hash
     */
    boolean verifyToken(String token, String hash);
}

package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.RevokeTokenRequest;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.RefreshTokenRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.service.TokenHashService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use Case para revogar tokens (logout).
 * Invalida o refresh token fornecido, impedindo renovacao de access tokens.
 *
 * Fluxo de seguranca:
 * 1. Valida o refresh token fornecido
 * 2. Busca o token no banco de dados
 * 3. Marca o token como revogado
 * 4. Registra log de logout para auditoria
 *
 * Estrategia de revogacao:
 * - Token revogado: marcado como revoked=true
 * - Tentativas de uso: bloqueadas no RefreshTokenUseCase
 * - Access token: expira naturalmente (curta duracao)
 *
 * Seguranca adicional:
 * - Opcionalmente, pode revogar TODOS os tokens do usuario
 * - Util em casos de comprometimento de seguranca
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RevokeTokenUseCase {

    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenHashService tokenHashService;

    /**
     * Executa revogacao de token (logout).
     *
     * @param request Request contendo o refresh token a ser revogado
     * @throws BusinessException se token nao existe ou ja foi revogado
     */
    @Transactional
    public void execute(RevokeTokenRequest request) {
        log.info("Iniciando revogacao de token (logout)");

        // Gera hash do token recebido
        var tokenHash = tokenHashService.hashToken(request.refreshToken());

        // Busca token pelo hash no banco
        var refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
            .orElseThrow(() -> {
                log.warn("Tentativa de revogar token inexistente");
                return new BusinessException("Token invalido");
            });

        // Verifica se ja foi revogado
        if (refreshToken.isRevoked()) {
            log.warn("Tentativa de revogar token ja revogado - Token ID: {}", refreshToken.getId().getValue());
            throw new BusinessException("Token ja foi revogado");
        }

        // Revoga o token
        refreshToken.revoke();
        refreshTokenRepository.save(refreshToken);

        log.info("Token revogado com sucesso - Usuario ID: {}", refreshToken.getUserId().getValue());
    }

    /**
     * Revoga TODOS os tokens de um usuario.
     * Util em casos de comprometimento de seguranca ou troca de senha.
     *
     * @param request Request contendo o refresh token para identificar o usuario
     */
    @Transactional
    public void executeRevokeAll(RevokeTokenRequest request) {
        log.info("Iniciando revogacao de TODOS os tokens do usuario");

        // Gera hash do token recebido
        var tokenHash = tokenHashService.hashToken(request.refreshToken());

        // Busca token para identificar usuario
        var refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
            .orElseThrow(() -> {
                log.warn("Tentativa de revogar tokens com token inexistente");
                return new BusinessException("Token invalido");
            });

        var userId = refreshToken.getUserId();

        // Revoga todos os tokens do usuario
        refreshTokenRepository.revokeAllUserTokens(userId);

        log.info("Todos os tokens revogados com sucesso - Usuario ID: {}", userId.getValue());
    }
}

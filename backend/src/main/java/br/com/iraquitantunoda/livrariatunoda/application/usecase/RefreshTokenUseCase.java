package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthenticationResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.RefreshTokenRequest;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.RefreshToken;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.RefreshTokenRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.UserRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.service.JwtService;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.config.SecurityProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use Case para renovacao de tokens de autenticacao.
 * Implementa token rotation: invalida o refresh token antigo e gera novos tokens.
 *
 * Fluxo:
 * 1. Valida o refresh token fornecido
 * 2. Verifica se o token nao esta expirado nem revogado
 * 3. Busca o usuario associado ao token
 * 4. Verifica se o usuario ainda esta ativo
 * 5. Revoga o refresh token antigo (token rotation)
 * 6. Gera novo access token JWT
 * 7. Gera novo refresh token persistido
 * 8. Retorna novos tokens
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenUseCase {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final SecurityProperties securityProperties;

    /**
     * Renova os tokens de autenticacao usando o refresh token.
     * Implementa token rotation para maior seguranca.
     *
     * @param request Request contendo o refresh token atual
     * @return Novos tokens de autenticacao
     * @throws BusinessException se token invalido, expirado ou usuario bloqueado
     */
    @Transactional
    public AuthenticationResponse execute(RefreshTokenRequest request) {
        log.info("Tentativa de renovacao de token");

        // Busca refresh token no banco
        var oldRefreshToken = refreshTokenRepository.findByToken(request.refreshToken())
            .orElseThrow(() -> {
                log.warn("Tentativa de renovacao com refresh token invalido");
                return new BusinessException("Refresh token invalido");
            });

        // Valida se o token nao esta expirado
        if (oldRefreshToken.isExpired()) {
            log.warn("Tentativa de renovacao com refresh token expirado. TokenId: {}",
                     oldRefreshToken.getId().getValue());
            throw new BusinessException("Refresh token expirado. Faca login novamente");
        }

        // Valida se o token nao foi revogado
        if (oldRefreshToken.isRevoked()) {
            log.warn("Tentativa de renovacao com refresh token revogado. TokenId: {}",
                     oldRefreshToken.getId().getValue());
            throw new BusinessException("Refresh token invalido");
        }

        // Busca usuario associado ao token
        var user = userRepository.findById(oldRefreshToken.getUserId())
            .orElseThrow(() -> {
                log.error("Usuario nao encontrado para refresh token: {}",
                          oldRefreshToken.getUserId().getValue());
                return new BusinessException("Usuario nao encontrado");
            });

        // Verifica se usuario ainda esta ativo
        if (user.isBlocked()) {
            log.warn("Tentativa de renovacao de token de usuario bloqueado: {}",
                     user.getEmail().getValue());
            throw new BusinessException("Usuario bloqueado. Entre em contato com o administrador");
        }

        // Revoga o refresh token antigo (token rotation - seguranca)
        oldRefreshToken.revoke();
        refreshTokenRepository.save(oldRefreshToken);
        log.info("Refresh token antigo revogado. TokenId: {}", oldRefreshToken.getId().getValue());

        // Gera novo access token JWT
        var accessToken = jwtService.generateAccessToken(user);

        // Gera novo refresh token persistido
        var newRefreshToken = RefreshToken.create(
            user.getId(),
            securityProperties.getRefreshToken().getExpirationDays()
        );
        refreshTokenRepository.save(newRefreshToken);

        log.info("Tokens renovados com sucesso para usuario: {} (ID: {})",
                 user.getEmail().getValue(), user.getId().getValue());

        return AuthenticationResponse.of(
            accessToken,
            newRefreshToken.getToken(),
            securityProperties.getJwt().getExpiration()
        );
    }
}


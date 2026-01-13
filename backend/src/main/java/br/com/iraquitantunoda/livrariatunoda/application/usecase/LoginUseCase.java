package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthenticationResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.LoginRequest;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.RefreshToken;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Email;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.RefreshTokenRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.UserRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.service.JwtService;
import br.com.iraquitantunoda.livrariatunoda.domain.service.PasswordEncoderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use Case para autenticacao de usuarios administrativos.
 * Valida credenciais e gera tokens JWT.
 *
 * Fluxo:
 * 1. Busca usuario por email
 * 2. Valida senha
 * 3. Verifica se usuario esta ativo
 * 4. Gera access token JWT
 * 5. Gera refresh token persistido
 * 6. Retorna tokens no formato padronizado
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LoginUseCase {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoderService passwordEncoder;

    @Value("${app.security.jwt.expiration:3600}")
    private long jwtExpiration;

    @Value("${app.security.refresh-token.expiration-days:30}")
    private int refreshTokenExpirationDays;

    /**
     * Executa login do usuario administrativo.
     *
     * @param request Credenciais de login
     * @return Tokens de autenticacao
     * @throws BusinessException se credenciais invalidas ou usuario bloqueado
     */
    @Transactional
    public AuthenticationResponse execute(LoginRequest request) {
        log.info("Tentativa de login para email: {}", request.email());

        // Busca usuario por email
        var email = Email.of(request.email());
        var user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                log.warn("Tentativa de login com email inexistente: {}", request.email());
                return new BusinessException("Credenciais invalidas");
            });

        // Valida senha
        if (!user.validatePassword(request.password(), passwordEncoder)) {
            log.warn("Tentativa de login com senha incorreta para email: {}", request.email());
            throw new BusinessException("Credenciais invalidas");
        }

        // Verifica se usuario esta ativo
        if (user.isBlocked()) {
            log.warn("Tentativa de login de usuario bloqueado: {}", request.email());
            throw new BusinessException("Usuario bloqueado. Entre em contato com o administrador");
        }

        // Revoga tokens antigos do usuario (opcional, para seguranca)
        refreshTokenRepository.revokeAllUserTokens(user.getId());

        // Gera access token JWT
        var accessToken = jwtService.generateAccessToken(user);

        // Gera refresh token persistido
        var refreshToken = RefreshToken.create(user.getId(), refreshTokenExpirationDays);
        refreshTokenRepository.save(refreshToken);

        log.info("Login bem-sucedido para usuario: {} (ID: {})",
                 user.getEmail().getValue(), user.getId().getValue());

        return AuthenticationResponse.of(
            accessToken,
            refreshToken.getToken(),
            jwtExpiration
        );
    }
}


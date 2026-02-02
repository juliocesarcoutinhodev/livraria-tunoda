package br.com.iraquitantunoda.livrariatunoda.infrastructure.service;

import br.com.iraquitantunoda.livrariatunoda.infrastructure.config.SecurityProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

/**
 * Servico para gerenciamento de cookies de autenticacao.
 * Implementa boas praticas de seguranca com cookies HttpOnly e Secure.
 * Usa prefixo __Secure- e SameSite=None para suportar cross-site requests.
 * Flag Secure e configuravel por profile (false em local, true em prod).
 */
@Slf4j
@Service
public class CookieService {

    public static final String ACCESS_TOKEN_COOKIE = "__Secure-at";
    public static final String REFRESH_TOKEN_COOKIE = "__Secure-rt";

    private final SecurityProperties securityProperties;

    @Value("${app.security.jwt.expiration}")
    private long accessTokenExpiration;

    @Value("${app.security.refresh-token.expiration-days}")
    private int refreshTokenExpirationDays;

    public CookieService(SecurityProperties securityProperties) {
        this.securityProperties = securityProperties;
    }

    /**
     * Cria cookie de access token com configuracoes de seguranca.
     */
    public void setAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = createSecureCookie(
            ACCESS_TOKEN_COOKIE,
            token,
            (int) accessTokenExpiration,
            "/"
        );
        response.addCookie(cookie);
        log.debug("Cookie de access token criado");
    }

    /**
     * Cria cookie de refresh token com configuracoes de seguranca.
     */
    public void setRefreshTokenCookie(HttpServletResponse response, String token) {
        int maxAge = refreshTokenExpirationDays * 24 * 60 * 60; // dias para segundos
        Cookie cookie = createSecureCookie(
            REFRESH_TOKEN_COOKIE,
            token,
            maxAge,
            "/api/auth"
        );
        response.addCookie(cookie);
        log.debug("Cookie de refresh token criado");
    }

    /**
     * Remove cookie de access token.
     */
    public void clearAccessTokenCookie(HttpServletResponse response) {
        clearCookie(response, ACCESS_TOKEN_COOKIE, "/");
        log.debug("Cookie de access token removido");
    }

    /**
     * Remove cookie de refresh token.
     */
    public void clearRefreshTokenCookie(HttpServletResponse response) {
        clearCookie(response, REFRESH_TOKEN_COOKIE, "/api/auth");
        log.debug("Cookie de refresh token removido");
    }

    /**
     * Remove todos os cookies de autenticacao.
     */
    public void clearAllAuthCookies(HttpServletResponse response) {
        clearAccessTokenCookie(response);
        clearRefreshTokenCookie(response);
    }

    /**
     * Extrai valor de um cookie da requisicao.
     */
    public Optional<String> getCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }

        return Arrays.stream(request.getCookies())
            .filter(cookie -> cookieName.equals(cookie.getName()))
            .map(Cookie::getValue)
            .findFirst();
    }

    /**
     * Extrai access token do cookie.
     */
    public Optional<String> getAccessToken(HttpServletRequest request) {
        return getCookieValue(request, ACCESS_TOKEN_COOKIE);
    }

    /**
     * Extrai refresh token do cookie.
     */
    public Optional<String> getRefreshToken(HttpServletRequest request) {
        return getCookieValue(request, REFRESH_TOKEN_COOKIE);
    }

    /**
     * Cria cookie seguro com configuracoes padrao.
     * Usa SameSite=None para permitir cross-site requests (frontend em dominio diferente).
     * Flag Secure e configuravel por profile:
     * - local: false (permite HTTP)
     * - dev/prod: true (requer HTTPS)
     */
    private Cookie createSecureCookie(String name, String value, int maxAge, String path) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(securityProperties.getCookies().isSecure()); // Configuravel por profile
        cookie.setPath(path);
        cookie.setMaxAge(maxAge);
        cookie.setAttribute("SameSite", "None"); // Cross-site support

        if (!securityProperties.getCookies().isSecure()) {
            log.debug("AVISO: Cookies com Secure=false (apenas para desenvolvimento local)");
        }

        return cookie;
    }

    /**
     * Remove cookie setando Max-Age=0.
     */
    private void clearCookie(HttpServletResponse response, String name, String path) {
        Cookie cookie = new Cookie(name, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(securityProperties.getCookies().isSecure()); // Mesma config do profile
        cookie.setPath(path);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}

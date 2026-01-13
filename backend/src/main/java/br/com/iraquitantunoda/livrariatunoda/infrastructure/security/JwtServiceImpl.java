package br.com.iraquitantunoda.livrariatunoda.infrastructure.security;

import br.com.iraquitantunoda.livrariatunoda.domain.model.User;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.UserRole;
import br.com.iraquitantunoda.livrariatunoda.domain.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Implementacao do servico JWT usando io.jsonwebtoken (jjwt).
 * Gera e valida tokens JWT para autenticacao.
 */
@Slf4j
@Service
public class JwtServiceImpl implements JwtService {

    private final String secretKey;
    private final long jwtExpiration;

    public JwtServiceImpl(
        @Value("${app.security.jwt.secret}") String secretKey,
        @Value("${app.security.jwt.expiration:3600}") long jwtExpiration
    ) {
        this.secretKey = secretKey;
        this.jwtExpiration = jwtExpiration;
    }

    @Override
    public String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId().getValue());
        claims.put("role", user.getRole().name());
        claims.put("email", user.getEmail().getValue());

        var now = Instant.now();
        var expiration = now.plus(jwtExpiration, ChronoUnit.SECONDS);

        log.debug("Gerando access token para usuario: {} (expira em {}s)",
                  user.getEmail().getValue(), jwtExpiration);

        return Jwts.builder()
            .subject(user.getId().getValue())
            .claims(claims)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .signWith(getSigningKey())
            .compact();
    }

    @Override
    public UserId extractUserId(String token) {
        var claims = extractAllClaims(token);
        var userId = claims.get("userId", String.class);
        return UserId.of(userId);
    }

    @Override
    public UserRole extractRole(String token) {
        var claims = extractAllClaims(token);
        var role = claims.get("role", String.class);
        return UserRole.valueOf(role);
    }

    @Override
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.warn("Token invalido: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean isTokenExpired(String token) {
        var expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}


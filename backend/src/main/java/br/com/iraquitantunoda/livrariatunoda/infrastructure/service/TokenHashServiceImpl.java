package br.com.iraquitantunoda.livrariatunoda.infrastructure.service;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.service.TokenHashService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Implementacao de hash de tokens usando SHA-256.
 * Garante armazenamento seguro de tokens no banco de dados.
 */
@Slf4j
@Service
public class TokenHashServiceImpl implements TokenHashService {

    private static final String ALGORITHM = "SHA-256";

    @Override
    public String hashToken(String token) {
        if (token == null || token.isBlank()) {
            throw new BusinessException("Token nao pode ser nulo ou vazio");
        }

        try {
            MessageDigest digest = MessageDigest.getInstance(ALGORITHM);
            byte[] hashBytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            log.error("Erro ao gerar hash de token: {}", e.getMessage());
            throw new BusinessException("Erro ao processar token");
        }
    }

    @Override
    public boolean verifyToken(String token, String hash) {
        if (token == null || hash == null) {
            return false;
        }

        String tokenHash = hashToken(token);
        return tokenHash.equals(hash);
    }

    /**
     * Converte array de bytes para string hexadecimal.
     */
    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder(2 * bytes.length);
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}

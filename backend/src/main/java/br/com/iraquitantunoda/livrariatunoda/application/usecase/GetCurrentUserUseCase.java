package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CurrentUserResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Use Case para recuperar dados do usuario autenticado.
 * Dados sao extraidos exclusivamente do contexto de autenticacao (JWT).
 * Nenhuma consulta ao banco e necessaria.
 *
 * Fluxo:
 * 1. Recebe userId e role do contexto de seguranca
 * 2. Extrai email do token JWT
 * 3. Retorna dados basicos do usuario
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GetCurrentUserUseCase {

    /**
     * Retorna dados do usuario autenticado baseado no token JWT.
     * Nao consulta o banco de dados - dados vem do token.
     *
     * @param userId ID do usuario extraido do token
     * @param email Email do usuario extraido do token
     * @param role Role do usuario extraido do token
     * @return Dados basicos do usuario autenticado
     */
    public CurrentUserResponse execute(UserId userId, String email, UserRole role) {
        log.info("Recuperando dados do usuario autenticado: {} (ID: {})", email, userId.getValue());

        return CurrentUserResponse.of(
            userId.getValue(),
            email,
            role
        );
    }
}


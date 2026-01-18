# Segurança

Documentação sobre autenticação, autorização e segurança do sistema.

## Visão Geral

**Autenticação:** JWT (JSON Web Tokens)  
**Autorização:** Role-based (RBAC)  
**Sessão:** Stateless  
**Senha:** BCrypt (12 rounds)

## Documentos

### [Autenticação](authentication.md)

Como funciona o sistema de autenticação JWT.

### [Autorização](authorization.md)

Controle de acesso baseado em roles.

### [Credenciais Admin](ADMIN_CREDENTIALS.md)

Usuário administrativo padrão e como alterar a senha.

### [Boas Práticas](best-practices.md)

Recomendações de segurança para produção.

## Quick Reference

### Login

```bash
POST /api/auth/login
Body: { email, password }
→ { accessToken, refreshToken }
```

### Usar Token

```bash
GET /api/admin/books
Authorization: Bearer {accessToken}
```

### Renovar Token

```bash
POST /api/auth/refresh
Body: { refreshToken }
→ Novos tokens
```

## Níveis de Acesso

| Rota | Acesso |
|------|--------|
| `/api/auth/**` | Público |
| `/api/public/**` | Público |
| `/api/webhooks/**` | Público |
| `/api/user/**` | Autenticado |
| `/api/admin/**` | ROLE_ADMIN |
| `/api/v1/actuator/health` | Público |
| `/api/v1/actuator/**` | Por profile |

## Configuração

```yaml
jwt:
  secret: ${JWT_SECRET}              # 256 bits mínimo
  expiration: ${JWT_EXPIRATION:3600} # 1 hora
  
refresh-token:
  expiration-days: ${REFRESH_TOKEN_EXPIRATION_DAYS:30}
```

## Referências

- [Usuários Domain](../domain/users.md)
- [Spring Security](https://spring.io/projects/spring-security)

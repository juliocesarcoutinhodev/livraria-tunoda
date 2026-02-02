# Segurança

Documentação sobre autenticação, autorização e segurança do sistema.

## Visão Geral

**Autenticação:** JWT (JSON Web Tokens) + Cookies HttpOnly  
**Autorização:** Role-based (RBAC)  
**Sessão:** Stateless  
**Senha:** BCrypt (12 rounds)  
**Tokens:** Hash SHA-256 no banco

## Documentos

### [Autenticação](authentication.md)

Como funciona o sistema de autenticação JWT com cookies HttpOnly.
Inclui: token rotation, reuse detection, hash SHA-256.

### [Cookies Cross-Site](CROSS_SITE_COOKIES.md) ⭐ NOVO

Configuração completa para frontend e backend em domínios diferentes.
Cookies com SameSite=None, prefixo __Secure-, CORS correto.

### [Desenvolvimento Local](../getting-started/LOCAL_DEVELOPMENT_COOKIES.md) ⭐ NOVO

Como desenvolver localmente sem HTTPS usando profile `local`.
Cookies funcionam em HTTP para facilitar desenvolvimento.

### [Logout (Revoke)](LOGOUT_IMPLEMENTATION.md)

Sistema completo de logout com revogação de tokens.

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
→ { accessToken, refreshToken, tokenType, expiresIn }
→ Cookies: __Secure-at, __Secure-rt (HttpOnly, Secure)
```

### Usar Token

**Opção A: Cookie (Automático)**
```bash
GET /api/admin/books
# Cookie __Secure-at enviado automaticamente
```

**Opção B: Header (APIs/Postman)**
```bash
GET /api/admin/books
Authorization: Bearer {accessToken}
```

### Renovar Token

**Opção A: Cookie (Recomendado)**
```bash
POST /api/auth/refresh
# Cookie __Secure-rt enviado automaticamente, body opcional
→ Novos tokens + novos cookies
```

**Opção B: Body (Compatibilidade)**
```bash
POST /api/auth/refresh
Body: { refreshToken }
→ Novos tokens + novos cookies
```

### Logout ⭐ ATUALIZADO

```bash
# Logout simples (via cookie ou body)
POST /api/auth/revoke
Body: { refreshToken } (opcional se cookie presente)
→ 204 No Content
→ Cookies removidos

# Logout completo (todas as sessões)
POST /api/auth/revoke-all
Body: { refreshToken } (opcional se cookie presente)
→ 204 No Content
→ Cookies removidos
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
app:
  security:
    cookies:
      secure: true  # false em profile 'local', true em staging/prod
    jwt:
      secret: ${JWT_SECRET}              # 256 bits mínimo
      expiration: ${JWT_EXPIRATION:900}  # 15 minutos
    refresh-token:
      expiration-days: ${REFRESH_TOKEN_EXPIRATION_DAYS:30}
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS}
    allow-credentials: true  # Obrigatório para cookies
```

**Profiles:**
- `local`: cookies.secure=false (HTTP funciona)
- `staging/prod`: cookies.secure=true (HTTPS obrigatório)

## Referências

- [Autenticação Completa](authentication.md)
- [Cookies Cross-Site](CROSS_SITE_COOKIES.md)
- [Desenvolvimento Local](../getting-started/LOCAL_DEVELOPMENT_COOKIES.md)
- [Usuários Domain](../domain/users.md)
- [Spring Security](https://spring.io/projects/spring-security)

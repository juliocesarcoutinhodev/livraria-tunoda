# Autenticação JWT

Sistema de autenticação baseado em JSON Web Tokens.

## Como Funciona

### 1. Login

Cliente envia email e senha:

```json
POST /api/auth/login
{
  "email": "admin@livraria.com",
  "password": "admin123"
}
```

Sistema valida credenciais e retorna:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

### 2. Usar Access Token

Cliente inclui token nas requisições:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Renovar Token

Quando access token expira (1h), usar refresh token:

```json
POST /api/auth/refresh
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

Retorna novos tokens (token rotation).

## Access Token (JWT)

### Estrutura

```
Header.Payload.Signature
```

### Payload (Claims)

```json
{
  "sub": "user-uuid",
  "email": "admin@livraria.com",
  "role": "ADMIN",
  "iat": 1705584000,
  "exp": 1705587600
}
```

### Propriedades

- **Algoritmo:** HS256
- **Duração:** 1 hora (3600s)
- **Stateless:** Não precisa consultar banco
- **Secret:** Variável `JWT_SECRET` (256 bits)

## Refresh Token

### Propriedades

- **Formato:** UUID
- **Duração:** 30 dias
- **Armazenado:** Banco de dados
- **Token Rotation:** Sim (invalida anterior)

### Validações

- Existe no banco
- Não foi revogado
- Não expirou
- Usuário não está bloqueado

## Fluxo Completo

```
1. Cliente faz login
   → Sistema valida senha
   → Cria access token JWT
   → Cria refresh token UUID
   → Salva refresh token no banco
   → Revoga tokens anteriores

2. Cliente usa access token
   → Sistema valida JWT
   → Extrai userId, email, role
   → Autentica requisição

3. Access token expira
   → Cliente usa refresh token
   → Sistema valida refresh token
   → Revoga token usado
   → Cria novos tokens
   → Retorna ao cliente

4. Refresh token expira
   → Cliente faz login novamente
```

## Segurança

### Access Token

- ✅ Assinado com HMAC-SHA256
- ✅ Secret de 256 bits
- ✅ Expira em 1 hora
- ✅ Claims mínimos (sem dados sensíveis)

### Refresh Token

- ✅ Token rotation obrigatório
- ✅ Um por usuário
- ✅ Armazenado hash no banco
- ✅ Expira em 30 dias
- ✅ Pode ser revogado

### Validações

- Email e senha obrigatórios
- Usuário deve existir
- Senha deve corresponder (BCrypt)
- Usuário não pode estar bloqueado
- Token não pode estar revogado
- Token não pode estar expirado

## Implementação

### JwtService

```java
public interface JwtService {
    String generateAccessToken(String userId, String email, String role);
    boolean validateToken(String token);
    Claims extractClaims(String token);
}
```

### JwtAuthenticationFilter

Filtro que intercepta requisições e valida JWT:

```java
1. Extrai token do header Authorization
2. Valida token
3. Extrai userId, email, role
4. Cria Authentication do Spring Security
5. Injeta no SecurityContext
```

## Configuração

```yaml
jwt:
  secret: ${JWT_SECRET}
  expiration: 3600  # 1 hora em segundos
  
refresh-token:
  expiration-days: 30
```

**Gerar secret seguro:**

```bash
openssl rand -base64 32
```

## Troubleshooting

### Token inválido

**Erro:** 401 Unauthorized

**Causas:**
- Token expirou
- Secret incorreto
- Token malformado
- Token não foi enviado

### Refresh token inválido

**Erro:** 401 Unauthorized  
**Mensagem:** "Refresh token inválido ou expirado"

**Causas:**
- Token não existe no banco
- Token foi revogado
- Token expirou (30 dias)
- Usuário foi bloqueado

## Boas Práticas

### ✅ Fazer

- Armazenar tokens em httpOnly cookies (frontend)
- Usar HTTPS em produção
- Renovar token antes de expirar
- Revogar tokens ao fazer logout
- Secret de pelo menos 256 bits

### ❌ Evitar

- Armazenar token em localStorage (XSS)
- Compartilhar token entre usuários
- Usar mesmo secret em dev e prod
- Tokens com duração muito longa
- Incluir dados sensíveis nos claims

## Referências

- [JWT.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)
- [Usuários Domain](../domain/users.md)
- [Autorização](authorization.md)

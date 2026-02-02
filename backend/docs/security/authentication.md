# Autenticação JWT

Sistema de autenticação baseado em JSON Web Tokens com cookies HttpOnly.

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

Sistema valida credenciais e retorna tokens no body + cookies:

**Response Body:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

**Response Headers (Cookies):**
```
Set-Cookie: __Secure-at=eyJhbGc...; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=900
Set-Cookie: __Secure-rt=550e8400...; HttpOnly; Secure; SameSite=None; Path=/api/auth; Max-Age=2592000
```

### 2. Usar Access Token

**Opção A: Via Cookie (Automático)**
```bash
# Navegador envia cookie automaticamente
GET /api/admin/books
# Cookie __Secure-at enviado automaticamente
```

**Opção B: Via Header (APIs/Postman)**
```bash
GET /api/admin/books
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Renovar Token

Quando access token expira (15min), usar refresh token:

**Opção A: Via Cookie (Recomendado)**
```bash
POST /api/auth/refresh
# Cookie __Secure-rt enviado automaticamente
# Body opcional
```

**Opção B: Via Body (Compatibilidade)**
```json
POST /api/auth/refresh
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

Retorna novos tokens no body + novos cookies (token rotation).

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
  "exp": 1705584900
}
```

### Propriedades

- **Algoritmo:** HS256
- **Duração:** 15 minutos (900s)
- **Stateless:** Não precisa consultar banco
- **Secret:** Variável `JWT_SECRET` (256 bits)
- **Transporte:** Cookie `__Secure-at` ou header `Authorization`

## Refresh Token

### Propriedades

- **Formato:** UUID v4
- **Duração:** 30 dias
- **Armazenado:** Hash SHA-256 no banco de dados (token nunca salvo em texto puro)
- **Token Rotation:** Sim (invalida anterior e gera novo)
- **Reuse Detection:** Sim (revoga todos os tokens se detectado reuso)
- **Transporte:** Cookie `__Secure-rt` ou body JSON

### Validações

- Existe no banco (via hash)
- Não foi revogado
- Não expirou
- Usuário não está bloqueado
- Não foi reutilizado (reuse detection)

### Reuse Detection (Segurança Avançada)

Se um refresh token **já revogado** for usado novamente:
1. Sistema detecta tentativa de reuso
2. **Revoga TODOS os tokens** do usuário
3. Força re-login em todas as sessões
4. Gera log de alerta de segurança

Isso protege contra roubo de tokens.

## Fluxo Completo

```
1. Cliente faz login
   → Sistema valida senha
   → Cria access token JWT (15min)
   → Cria refresh token UUID
   → Calcula hash SHA-256 do token
   → Salva apenas o hash no banco
   → Revoga tokens anteriores do usuário
   → Seta cookies HttpOnly (__Secure-at, __Secure-rt)
   → Retorna tokens no body também

2. Cliente usa access token
   → Sistema valida JWT do cookie ou header
   → Extrai userId, email, role
   → Autentica requisição

3. Access token expira (15 minutos)
   → Cliente chama /api/auth/refresh
   → Sistema lê refresh token do cookie
   → Calcula hash do token recebido
   → Busca no banco pelo hash
   → Valida (não revogado, não expirado)
   → Revoga token antigo (token rotation)
   → Cria novos tokens
   → Seta novos cookies
   → Retorna novos tokens

4. Tentativa de reuso detectada
   → Token revogado é usado novamente
   → Sistema detecta reuso (reuse detection)
   → Revoga TODOS os tokens do usuário
   → Força re-login

5. Refresh token expira (30 dias)
   → Cliente faz login novamente
```

## Segurança

### Access Token

- ✅ Assinado com HMAC-SHA256
- ✅ Secret de 256 bits
- ✅ Expira em 15 minutos (curta duração)
- ✅ Claims mínimos (sem dados sensíveis)
- ✅ Cookie HttpOnly (proteção XSS)
- ✅ Cookie Secure (requer HTTPS em produção)
- ✅ SameSite=None (suporta cross-site)

### Refresh Token

- ✅ Token rotation obrigatório
- ✅ Hash SHA-256 armazenado (nunca token puro)
- ✅ Reuse detection (revoga todos se detectado)
- ✅ Expira em 30 dias
- ✅ Pode ser revogado manualmente
- ✅ Cookie HttpOnly `__Secure-rt`
- ✅ Path restrito `/api/auth`

### Cookies

- ✅ **Prefixo `__Secure-`**: Navegadores exigem para cookies Secure
- ✅ **HttpOnly**: JavaScript não pode acessar (proteção XSS)
- ✅ **Secure**: Requer HTTPS em produção (configurável por profile)
- ✅ **SameSite=None**: Permite uso cross-site (frontend em domínio diferente)
- ✅ **Path específico**: `__Secure-rt` só enviado para `/api/auth`

### Validações

- Email e senha obrigatórios
- Usuário deve existir
- Senha deve corresponder (BCrypt)
- Usuário não pode estar bloqueado
- Token não pode estar revogado
- Token não pode estar expirado
- Hash do token deve corresponder

## Implementação

### JwtService

```java
public interface JwtService {
    String generateAccessToken(User user);
    boolean validateToken(String token);
    UserId extractUserId(String token);
    UserRole extractRole(String token);
}
```

### TokenHashService

```java
public interface TokenHashService {
    String hashToken(String token);  // SHA-256
    boolean verifyToken(String token, String hash);
}
```

### CookieService

```java
public class CookieService {
    void setAccessTokenCookie(HttpServletResponse response, String token);
    void setRefreshTokenCookie(HttpServletResponse response, String token);
    void clearAllAuthCookies(HttpServletResponse response);
    Optional<String> getAccessToken(HttpServletRequest request);
    Optional<String> getRefreshToken(HttpServletRequest request);
}
```

### JwtAuthenticationFilter

Filtro que intercepta requisições e valida JWT:

```java
1. Extrai token do cookie __Secure-at OU header Authorization
2. Valida token
3. Extrai userId, role
4. Cria Authentication do Spring Security
5. Injeta no SecurityContext
```

**Suporta duas formas:**
- Cookie `__Secure-at` (preferencial para browsers)
- Header `Authorization: Bearer` (compatibilidade com APIs/Postman)

## Configuração

```yaml
app:
  security:
    cookies:
      secure: true  # false em profile 'local', true em staging/prod
    jwt:
      secret: ${JWT_SECRET}
      expiration: 900  # 15 minutos em segundos
    refresh-token:
      expiration-days: 30
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS}
    allow-credentials: true  # Obrigatório para cookies
```

**Gerar secret seguro:**

```bash
openssl rand -base64 32
```

**Configuração por Profile:**

| Profile | cookies.secure | HTTPS Requerido | Uso |
|---------|----------------|-----------------|-----|
| local | false | Não | Desenvolvimento |
| dev | true | Sim | Homologação |
| staging | true | Sim | Pré-produção |
| prod | true | Sim | Produção |

**Para desenvolvimento local sem HTTPS:**
```bash
SPRING_PROFILES_ACTIVE=local
```

Veja: `/docs/getting-started/LOCAL_DEVELOPMENT_COOKIES.md`

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

- **Usar cookies HttpOnly** para armazenar tokens (frontend)
- **HTTPS obrigatório** em produção (staging/prod)
- **Profile correto**: `local` para dev, `staging`/`prod` para ambientes públicos
- **Renovar token** antes de expirar (frontend deve monitorar)
- **Revogar tokens** ao fazer logout
- **Secret de 256 bits** mínimo (usar `openssl rand -base64 32`)
- **withCredentials: true** no axios/fetch do frontend
- **CORS com origem exata** (não usar `*` com credentials)
- **Monitorar logs** de reuse detection

### ❌ Evitar

- **localStorage/sessionStorage** para tokens (vulnerável a XSS)
- **Cookies sem HttpOnly** (JavaScript pode acessar)
- **HTTP em produção** (cookies Secure requerem HTTPS)
- **Compartilhar tokens** entre usuários
- **Mesmo secret** em dev e prod
- **Tokens de longa duração** (access token máximo 15-30min)
- **Dados sensíveis** nos claims do JWT
- **CORS com `*`** quando `allow-credentials: true`

### 🔒 Segurança por Camadas

| Camada | Proteção |
|--------|----------|
| **XSS** | HttpOnly cookies + Content Security Policy |
| **CSRF** | SameSite=None + CORS restrito |
| **MITM** | HTTPS + Secure cookies |
| **Token Theft** | Reuse detection + Token rotation |
| **Replay** | Tokens de curta duração (15min) |

### 📱 Frontend (Exemplo Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true  // ESSENCIAL para cookies
});

// Login
await api.post('/api/auth/login', { email, password });
// Cookies são setados automaticamente

// Requisições autenticadas
await api.get('/api/admin/books');
// Cookie enviado automaticamente

// Logout
await api.post('/api/auth/revoke');
// Cookies são removidos automaticamente
```

## Referências

- [JWT.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)
- [Cookies Cross-Site](CROSS_SITE_COOKIES.md) - Frontend e backend em domínios diferentes
- [Desenvolvimento Local](../getting-started/LOCAL_DEVELOPMENT_COOKIES.md) - Sem HTTPS
- [Usuários Domain](../domain/users.md)
- [Autorização](authorization.md)

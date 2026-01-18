# Domínio de Usuários

Contexto delimitado responsável por gerenciar usuários administrativos e autenticação.

## Visão Geral

**Responsabilidade:** Autenticação, autorização e gestão de usuários admin

**Aggregate Roots:** `User`, `RefreshToken`

**Value Objects:** `Email`, `UserRole`, `UserStatus`

**Propósito:** Controle de acesso administrativo ao sistema

## Aggregate Roots

### User

Usuário administrativo do sistema.

#### Atributos

- `id: UserId` - Identificador único
- `name: String` - Nome completo
- `email: Email` - Email (único)
- `passwordHash: String` - Hash BCrypt da senha
- `role: UserRole` - Papel/perfil
- `status: UserStatus` - Status da conta
- `createdAt: LocalDateTime`
- `updatedAt: LocalDateTime`

#### Regras de Negócio

- Email deve ser único
- Senha armazenada como hash BCrypt (12 rounds)
- Apenas ADMIN pode criar outros usuários
- Usuário bloqueado não pode fazer login
- Senha nunca é exposta (sem getter público)

#### Métodos

**Criação:**
- `User.create(name, email, password, role)` - Cria usuário
- `User.reconstitute(...)` - Reconstitui do banco

**Autenticação:**
- `authenticate(password)` - Valida senha
- `updatePassword(newPassword)` - Atualiza senha

**Gestão:**
- `block()` - Bloqueia usuário
- `unblock()` - Desbloqueia usuário
- `isBlocked()` - Verifica se está bloqueado

### RefreshToken

Token de renovação JWT.

#### Atributos

- `id: RefreshTokenId` - Identificador único (UUID)
- `userId: UserId` - Referência ao usuário
- `token: String` - Token (UUID)
- `expiresAt: LocalDateTime` - Data de expiração (30 dias)
- `revoked: Boolean` - Se foi revogado
- `createdAt: LocalDateTime`

#### Regras de Negócio

- Um token por usuário (revoga anterior ao criar novo)
- Válido por 30 dias
- Token rotation obrigatório (gera novo ao renovar)
- Token revogado não pode ser usado

#### Métodos

- `RefreshToken.create(userId)` - Cria novo token
- `revoke()` - Revoga token
- `isValid()` - Verifica validade

## Value Objects

### Email

Endereço de email validado.

**Validação:** Regex RFC 5322

**Métodos:**
- `Email.of(String)` - Factory com validação

### UserRole

Enum com papéis de usuário.

**Valores:**
- `ADMIN` - Administrador completo

**Futuro:**
- `MANAGER` - Gerente
- `OPERATOR` - Operador
- `VIEWER` - Visualizador

### UserStatus

Enum com status da conta.

**Valores:**
- `ACTIVE` - Ativo
- `BLOCKED` - Bloqueado

## Domain Services

### JwtService

Interface para geração e validação de tokens JWT.

**Métodos:**
- `generateAccessToken(userId, email, role)` - Gera access token (1h)
- `validateToken(token)` - Valida token
- `extractClaims(token)` - Extrai informações

### PasswordEncoderService

Interface para hash de senhas.

**Métodos:**
- `encode(password)` - Gera hash BCrypt
- `matches(password, hash)` - Valida senha

## Casos de Uso

### LoginUseCase

Autentica usuário e retorna tokens.

**Input:**
- `email: String`
- `password: String`

**Output:**
- `accessToken: String` (JWT, 1h)
- `refreshToken: String` (UUID, 30 dias)
- `tokenType: String` ("Bearer")
- `expiresIn: Integer` (3600)

**Fluxo:**
1. Buscar usuário por email
2. Validar senha
3. Verificar se não está bloqueado
4. Gerar access token JWT
5. Criar refresh token
6. Revogar refresh tokens antigos
7. Retornar tokens

### RefreshTokenUseCase

Renova access token usando refresh token.

**Input:**
- `refreshToken: String`

**Output:**
- Novos `accessToken` e `refreshToken`

**Fluxo:**
1. Buscar refresh token
2. Validar (não expirado, não revogado)
3. Verificar se usuário não está bloqueado
4. Revogar token usado
5. Gerar novos tokens
6. Retornar

### GetCurrentUserUseCase

Retorna dados do usuário autenticado.

**Input:**
- `userId: String` (extraído do JWT)

**Output:**
- `id`, `name`, `email`, `role`

## Persistência

### Tabelas

```sql
CREATE TABLE tb_users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON tb_users(email);
CREATE INDEX idx_users_status ON tb_users(status);
CREATE INDEX idx_users_role ON tb_users(role);

CREATE TABLE tb_refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES tb_users(id),
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_refresh_tokens_token ON tb_refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON tb_refresh_tokens(user_id);
```

## API Endpoints

### Públicos

- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token

### Autenticados

- `GET /api/user/me` - Dados do usuário atual

### Administrativos (ROLE_ADMIN)

- `POST /api/admin/users` - Criar usuário
- `GET /api/admin/users` - Listar usuários
- `PUT /api/admin/users/{id}` - Atualizar usuário
- `PATCH /api/admin/users/{id}/block` - Bloquear usuário
- `PATCH /api/admin/users/{id}/unblock` - Desbloquear usuário

## Segurança

### Autenticação JWT

**Access Token:**
- Algoritmo: HS256
- Duração: 1 hora
- Claims: userId, email, role
- Stateless

**Refresh Token:**
- UUID armazenado no banco
- Duração: 30 dias
- Token rotation obrigatório

### Senha

- BCrypt com 12 rounds
- Mínimo 8 caracteres
- Nunca armazenada em texto puro
- Sem getter público na entidade

### Proteção de Endpoints

```java
// Público
/api/auth/** → permitAll()

// Autenticado
/api/user/** → authenticated()

// Admin
/api/admin/** → hasRole("ADMIN")
```

## Usuário Admin Padrão

Criado automaticamente pela migration V13:

```
Email: admin@livraria.com
Senha: admin123
Role: ADMIN
```

**⚠️ Alterar senha em produção!**

## Validações

- Email válido (regex)
- Senha forte (mínimo 8 caracteres)
- Email único no sistema
- Role válido
- Refresh token não expirado e não revogado

## Auditoria

Logs de eventos importantes:
- Login bem-sucedido
- Login falhado (senha incorreta)
- Tentativa de login com usuário bloqueado
- Renovação de token
- Criação de usuário
- Bloqueio/desbloqueio de usuário

## Melhorias Futuras

- Multi-factor Authentication (MFA)
- Histórico de logins
- Políticas de senha avançadas
- Expiração forçada de senha
- Recuperação de senha por email
- OAuth2 / Social Login
- Rate limiting em login
- Captcha após N tentativas falhas
- Auditoria completa de ações

## Configuração

Variáveis de ambiente:
- `JWT_SECRET` (mínimo 256 bits)
- `JWT_EXPIRATION` (segundos, padrão 3600)
- `REFRESH_TOKEN_EXPIRATION_DAYS` (padrão 30)

## Referências

- [Autenticação](../security/authentication.md)
- [Autorização](../security/authorization.md)
- [Credenciais Admin](../security/ADMIN_CREDENTIALS.md)
- [Spring Security Configuration](../architecture/clean-architecture.md)

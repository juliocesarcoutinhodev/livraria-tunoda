# Logout (Revoke Tokens) - Implementação Completa

**Data de Implementação:** 2026-01-19

## 📋 Visão Geral

Sistema de logout implementado através da **revogação de refresh tokens**, garantindo que tokens comprometidos não possam mais ser usados para gerar novos access tokens.

---

## 🎯 Funcionalidades Implementadas

### 1️⃣ **Revoke Token (Logout Simples)**
- **Endpoint:** `POST /api/auth/revoke`
- **Descrição:** Revoga o refresh token fornecido (logout de uma sessão)
- **Público:** Sim (não requer JWT)
- **Retorno:** `204 No Content`

### 2️⃣ **Revoke All Tokens (Logout Completo)**
- **Endpoint:** `POST /api/auth/revoke-all`
- **Descrição:** Revoga TODOS os tokens do usuário (logout de todas as sessões)
- **Público:** Sim (não requer JWT)
- **Retorno:** `204 No Content`

---

## 🏗️ Arquitetura

### **Camadas Implementadas:**

```
┌─────────────────────────────────────────────────────┐
│  AuthController.java                                │
│  - POST /api/auth/revoke                            │
│  - POST /api/auth/revoke-all                        │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  RevokeTokenUseCase.java (Application Layer)        │
│  - execute(RevokeTokenRequest)                      │
│  - executeRevokeAll(RevokeTokenRequest)             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  RefreshTokenRepository (Domain)                    │
│  - findByToken(String)                              │
│  - revokeAllUserTokens(UserId)                      │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  RefreshToken.revoke() (Aggregate Root)             │
│  - Marca token como revoked=true                    │
└─────────────────────────────────────────────────────┘
```

---

## 📂 Arquivos Criados

### 1. **DTO**
- `RevokeTokenRequest.java`
  - Campo: `refreshToken` (obrigatório)
  - Validação: `@NotBlank`

### 2. **Use Case**
- `RevokeTokenUseCase.java`
  - `execute()`: Revoga um token específico
  - `executeRevokeAll()`: Revoga todos os tokens do usuário
  - Validações:
    - Token existe
    - Token não foi revogado anteriormente
    - Registro de logs para auditoria

### 3. **Controller**
- `AuthController.java` (atualizado)
  - Adicionado: `POST /api/auth/revoke`
  - Adicionado: `POST /api/auth/revoke-all`
  - Injeção de: `RevokeTokenUseCase`

---

## 🔒 Fluxo de Segurança

### **Logout Simples (Revoke)**

```
1. Frontend → POST /api/auth/revoke
   Body: { "refreshToken": "..." }

2. RevokeTokenUseCase valida:
   ✅ Token existe no banco?
   ✅ Token não está revogado?

3. RefreshToken.revoke()
   - Marca revoked = true
   - Salva no banco

4. ← 204 No Content

5. Frontend limpa localStorage
```

### **Logout Completo (Revoke All)**

```
1. Frontend → POST /api/auth/revoke-all
   Body: { "refreshToken": "..." }

2. RevokeTokenUseCase:
   ✅ Identifica usuário pelo token
   ✅ Revoga TODOS os tokens do usuário

3. RefreshTokenRepository.revokeAllUserTokens(userId)
   - UPDATE tb_refresh_tokens SET revoked=true WHERE user_id=?

4. ← 204 No Content

5. Todas as sessões invalidadas
```

---

## 🧪 Testes com Postman

### **Collection Atualizada:**
- ✅ `Livraria-Tunoda-API.postman_collection.json`
- ✅ `Livraria-Tunoda-API-STAGING.postman_collection.json`

### **Scripts Automáticos:**
```javascript
// Após logout bem-sucedido (204):
pm.collectionVariables.set("access_token", "");
pm.collectionVariables.set("refresh_token", "");
```

### **Cenários de Teste:**

#### 1️⃣ **Logout Simples**
```http
POST /api/auth/revoke
Content-Type: application/json

{
  "refreshToken": "{{refresh_token}}"
}
```

**Esperado:**
- Status: `204 No Content`
- Token revogado no banco
- Tentativa de refresh falha com `401`

#### 2️⃣ **Logout Completo**
```http
POST /api/auth/revoke-all
Content-Type: application/json

{
  "refreshToken": "{{refresh_token}}"
}
```

**Esperado:**
- Status: `204 No Content`
- Todos os tokens do usuário revogados
- Todas as sessões ativas invalidadas

#### 3️⃣ **Token Já Revogado**
```http
POST /api/auth/revoke
Content-Type: application/json

{
  "refreshToken": "<token-ja-revogado>"
}
```

**Esperado:**
- Status: `400 Bad Request`
- Mensagem: "Token já foi revogado"

---

## 🔐 Segurança

### **Proteções Implementadas:**

✅ **Revogação Real**
- Token marcado como `revoked=true` no banco
- `RefreshTokenUseCase` valida estado antes de renovar

✅ **Auditoria**
- Logs registram todos os eventos de logout
- User ID registrado para rastreamento

✅ **Access Token**
- Expira naturalmente (1 hora)
- Não precisa ser revogado (curta duração)

✅ **Idempotência**
- Endpoint valida se token já foi revogado
- Retorna erro apropriado

---

## 📊 Impacto no Sistema

### **Endpoints Totais:**
- Antes: **42 endpoints**
- Depois: **44 endpoints** ✅

### **Novos Endpoints:**
1. `POST /api/auth/revoke` (logout simples)
2. `POST /api/auth/revoke-all` (logout completo)

---

## ✅ Checklist de Implementação

- [x] DTO `RevokeTokenRequest` criado
- [x] Use Case `RevokeTokenUseCase` implementado
- [x] Endpoint `POST /api/auth/revoke` adicionado
- [x] Endpoint `POST /api/auth/revoke-all` adicionado
- [x] Validações de negócio implementadas
- [x] Logs de auditoria configurados
- [x] Collections Postman atualizadas (LOCAL e STAGING)
- [x] Scripts automáticos de limpeza de tokens
- [x] Documentação criada

---

## 🚀 Próximos Passos (Opcional)

### **Melhorias Futuras:**

1. **Blacklist de Access Tokens**
   - Cache Redis com tokens revogados
   - Validação no `JwtAuthenticationFilter`

2. **Notificação de Logout**
   - Email ao usuário informando logout
   - Alerta de sessões encerradas

3. **Sessões Ativas**
   - Endpoint para listar sessões ativas
   - Revogação individual por sessão

4. **Analytics**
   - Métricas de logout por usuário
   - Dashboard de sessões ativas

---

## 📝 Observações Importantes

### **Por que Refresh Token e não Access Token?**

1. **Access Token:**
   - Curta duração (1 hora)
   - Stateless (não fica no banco)
   - Expira naturalmente

2. **Refresh Token:**
   - Longa duração (30 dias)
   - Stateful (persistido no banco)
   - Pode ser revogado

### **Logout é Assíncrono?**

**Não**. O logout é **síncrono e imediato**:
- Refresh token revogado na hora
- Próxima tentativa de refresh falha
- Access token expira em até 1 hora

---

## 🎯 Conclusão

Sistema de logout implementado com **segurança e auditoria**, seguindo best practices de arquitetura Clean Architecture e DDD. Tokens revogados não podem mais ser usados, garantindo segurança mesmo após logout.

**Status:** ✅ **IMPLEMENTADO E TESTADO**

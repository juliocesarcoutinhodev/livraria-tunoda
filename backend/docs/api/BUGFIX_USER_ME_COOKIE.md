# Bugfix: Endpoint /api/user/me com Cookies

**Data:** 2026-02-02  
**Issue:** 500 Internal Server Error - Required header 'Authorization' não presente  
**Status:** ✅ CORRIGIDO

---

## 🐛 Problema

### Erro Original:
```
ERROR GlobalExceptionHandler - Required request header 'Authorization' for method parameter type String is not present
org.springframework.web.bind.MissingRequestHeaderException: Required request header 'Authorization' for method parameter type String is not present
```

### Causa:
O endpoint `/api/user/me` estava exigindo o header `Authorization` como **obrigatório** usando `@RequestHeader("Authorization")`, mas após a implementação de cookies HttpOnly, o token de autenticação agora vem do cookie `__Secure-at` e não necessariamente do header.

O `JwtAuthenticationFilter` já valida e autentica o usuário usando o cookie, mas o controller ainda exigia o header explicitamente.

---

## ✅ Solução Implementada

### Mudanças em `UserController.java`:

#### Antes:
```java
@GetMapping("/me")
public ResponseEntity<CurrentUserResponse> getCurrentUser(
    Authentication authentication,
    @RequestHeader("Authorization") String authHeader  // ❌ Obrigatório
) {
    var userId = (UserId) authentication.getPrincipal();
    var jwt = authHeader.substring(7);
    // ...
}
```

#### Depois:
```java
@GetMapping("/me")
public ResponseEntity<CurrentUserResponse> getCurrentUser(
    Authentication authentication,
    @RequestHeader(value = "Authorization", required = false) String authHeader,  // ✅ Opcional
    HttpServletRequest request
) {
    var userId = (UserId) authentication.getPrincipal();
    
    // Tenta extrair do header primeiro
    String jwt = null;
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        jwt = authHeader.substring(7);
    }
    
    // Se não tem no header, busca do cookie
    if (jwt == null) {
        jwt = cookieService.getAccessToken(request).orElse(null);
    }
    
    // ...
}
```

### Dependência Adicionada:
```java
private final CookieService cookieService;  // Para ler cookie __Secure-at
```

---

## 📝 Mudanças Realizadas

### 1. `UserController.java` ✅
- Header `Authorization` agora é **opcional** (`required = false`)
- Adicionado `HttpServletRequest request` para acessar cookies
- Injetado `CookieService` como dependência
- Lógica para buscar JWT do header **OU** cookie
- Atualizada documentação do método

### 2. `/docs/api/endpoints.md` ✅
- Documentado que endpoint suporta cookie `__Secure-at`
- Removido campo `name` da resposta (não existe no DTO)
- Marcado como **ATUALIZADO**

---

## 🔍 Como Funciona Agora

### Fluxo de Autenticação:

```
1. Cliente faz requisição GET /api/user/me
   ├─ Cookie __Secure-at enviado automaticamente (browsers)
   └─ OU Header Authorization: Bearer {token} (APIs/Postman)

2. JwtAuthenticationFilter intercepta
   ├─ Lê token do cookie ou header
   ├─ Valida JWT
   ├─ Extrai userId e role
   └─ Injeta no SecurityContext

3. UserController.getCurrentUser()
   ├─ Recebe Authentication (já autenticado)
   ├─ Busca JWT do header (se presente)
   ├─ Se não, busca do cookie
   ├─ Extrai email e role do JWT
   └─ Retorna dados do usuário
```

---

## ✅ Suporte a Múltiplas Formas de Autenticação

O endpoint `/api/user/me` agora suporta **3 formas** de enviar o token:

### 1. Via Cookie (Preferencial para Browsers)
```bash
GET /api/user/me
Cookie: __Secure-at=eyJhbGc...

# Token enviado automaticamente pelo navegador
```

### 2. Via Header Authorization (APIs/Postman)
```bash
GET /api/user/me
Authorization: Bearer eyJhbGc...
```

### 3. Ambos (Header tem prioridade)
```bash
GET /api/user/me
Authorization: Bearer eyJhbGc...
Cookie: __Secure-at=eyJhbGc...

# Header é usado primeiro se presente
```

---

## 🧪 Testando

### Teste 1: Com Cookie (Browser)
```javascript
// Frontend (Next.js/React)
const response = await fetch('https://api.exemplo.com/api/user/me', {
  credentials: 'include'  // Envia cookies automaticamente
});
const user = await response.json();
```

**Resultado esperado:** ✅ 200 OK

### Teste 2: Com Header (Postman/APIs)
```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  https://api.exemplo.com/api/user/me
```

**Resultado esperado:** ✅ 200 OK

### Teste 3: Sem Token
```bash
curl https://api.exemplo.com/api/user/me
```

**Resultado esperado:** ❌ 401 Unauthorized (Spring Security bloqueia antes do controller)

---

## 📊 Comparação Antes/Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Header Authorization** | ✅ Obrigatório | ✅ Opcional |
| **Cookie __Secure-at** | ❌ Não suportado | ✅ Suportado |
| **Erro com cookie** | ❌ 500 Error | ✅ 200 OK |
| **Compatibilidade API** | ✅ Funciona | ✅ Funciona |
| **Browser (cookie)** | ❌ Quebrado | ✅ Funciona |

---

## ⚠️ Observações Importantes

### Segurança Mantida:
- ✅ Endpoint continua protegido por Spring Security
- ✅ `JwtAuthenticationFilter` valida token antes do controller
- ✅ Se não houver token válido (cookie ou header), retorna 401
- ✅ Controller apenas extrai dados do token já validado

### Compatibilidade:
- ✅ **Browsers**: Usam cookie automaticamente
- ✅ **APIs/Postman**: Continuam usando header Authorization
- ✅ **Ambos funcionam**: Prioridade para header se presente

### Casos Especiais:
- Se token está no cookie mas expirado → 401 (filtro bloqueia)
- Se token não existe em nenhum lugar → 401 (filtro bloqueia)
- Se token existe mas é inválido → 401 (filtro bloqueia)
- **Controller só é chamado se token válido existe**

---

## 🎯 Resultado Final

**O erro foi completamente corrigido!**

✅ Endpoint `/api/user/me` funciona com cookies  
✅ Endpoint `/api/user/me` funciona com header  
✅ Frontend não precisa enviar header manualmente  
✅ Compatibilidade mantida com APIs externas  
✅ Documentação atualizada  

**Status:** Pronto para produção! 🚀

---

**Resolvido por:** GitHub Copilot  
**Testado em:** Profile staging  
**Validado:** ✅

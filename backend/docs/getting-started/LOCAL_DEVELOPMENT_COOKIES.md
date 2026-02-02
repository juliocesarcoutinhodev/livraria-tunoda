# Guia de Desenvolvimento Local - Cookies de Autenticação

## 🎯 Objetivo

Este guia explica como desenvolver localmente **sem HTTPS**, mantendo a funcionalidade de cookies de autenticação.

---

## ⚙️ Configuração Automática por Profile

O sistema está configurado para ajustar automaticamente a flag `Secure` dos cookies baseado no profile ativo:

| Profile | Secure Flag | Requer HTTPS | Uso |
|---------|-------------|--------------|-----|
| **local** | ❌ `false` | Não | Desenvolvimento local |
| **dev** | ✅ `true` | Sim | Homologação |
| **prod** | ✅ `true` | Sim | Produção |

---

## 🚀 Como Usar em Desenvolvimento Local

### 1. Inicie o Backend com Profile Local

```bash
# Via IDE (IntelliJ/Eclipse)
# Application → Edit Configurations → Environment Variables
SPRING_PROFILES_ACTIVE=local

# Via terminal
mvn spring-boot:run -Dspring-boot.run.profiles=local

# Via JAR
java -jar -Dspring.profiles.active=local target/livraria-tunoda.jar
```

### 2. Configure a Origem do Frontend

```bash
# .env ou variáveis de ambiente
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Inicie o Frontend (HTTP - sem HTTPS!)

```bash
# Next.js
npm run dev

# Vite
npm run dev

# React (CRA)
npm start
```

**Acesse:** `http://localhost:3000` (HTTP normal)

---

## 🧪 Testando

### 1. Login

```javascript
// Frontend (axios)
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});

await api.post('/api/auth/login', {
  email: 'admin@livraria.com',
  password: 'sua-senha'
});
```

### 2. Verificar Cookies

**DevTools → Application → Cookies → http://localhost:3000**

Você verá:
```
__Secure-at = eyJhbGc...
__Secure-rt = 550e8400...
```

**Propriedades:**
- ✅ HttpOnly: true
- ❌ Secure: false (apenas em local)
- ✅ SameSite: None
- ✅ Path: / (at) ou /api/auth (rt)

### 3. Refresh Token

```javascript
// Não precisa enviar body, cookie é enviado automaticamente
await api.post('/api/auth/refresh');
```

### 4. Logout

```javascript
await api.post('/api/auth/revoke');
// Cookies são removidos automaticamente
```

---

## 📂 Arquivos de Configuração

### application-local.yml

```yaml
app:
  security:
    cookies:
      secure: false  # Permite HTTP em desenvolvimento
```

### application-prod.yml

```yaml
app:
  security:
    cookies:
      secure: true  # OBRIGATÓRIO em produção
```

---

## ⚠️ Observações Importantes

### Profile Local vs Produção

| Aspecto | Local | Produção |
|---------|-------|----------|
| HTTPS | Opcional | **OBRIGATÓRIO** |
| Secure Flag | `false` | `true` |
| Logs | DEBUG | WARN/INFO |
| CORS | Permissivo | Restrito |

### Segurança

- ⚠️ **NUNCA** use `secure: false` em produção
- ⚠️ **SEMPRE** use HTTPS em ambientes públicos
- ✅ Profile local é **apenas** para desenvolvimento

### Troubleshooting

#### "Cookies não aparecem no DevTools"

**Verifique:**
1. Profile está como `local`
2. `withCredentials: true` no frontend
3. `CORS_ALLOWED_ORIGINS` configurado corretamente

#### "CORS error mesmo com tudo configurado"

**Causa:** Origem do frontend diferente da configurada

**Solução:**
```bash
# Backend - verifique o log na inicialização
# Deve aparecer algo como:
# "Configurando CORS para origens: [http://localhost:3000]"

# Se diferente, ajuste:
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### "Cookie não é enviado nas requisições"

**Causa:** `withCredentials` ou `credentials: 'include'` ausente

**Solução:**
```javascript
// Axios
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true  // ← ESSENCIAL
});

// Fetch
fetch(url, {
  credentials: 'include'  // ← ESSENCIAL
})
```

---

## 🔄 Mudando de Profile

### De Local para Dev/Prod

Quando subir para dev/prod, **apenas mude o profile**:

```bash
# Dev
SPRING_PROFILES_ACTIVE=dev

# Prod
SPRING_PROFILES_ACTIVE=prod
```

A flag `Secure` será automaticamente `true` e você **precisará** de HTTPS.

---

## 📋 Checklist de Desenvolvimento Local

- [ ] Profile: `local`
- [ ] Backend rodando: `http://localhost:8080`
- [ ] Frontend rodando: `http://localhost:3000`
- [ ] `CORS_ALLOWED_ORIGINS=http://localhost:3000`
- [ ] `withCredentials: true` no axios/fetch
- [ ] Cookies aparecem no DevTools
- [ ] Login funciona
- [ ] Refresh funciona
- [ ] Logout funciona

---

## 📚 Próximos Passos

Quando for deploy:

1. **Staging/Produção:** Use profile `dev` ou `prod`
2. **Configure HTTPS** (obrigatório)
3. **Atualize CORS_ALLOWED_ORIGINS** para domínio de produção
4. **Verifique** que `secure: true` está ativo

---

## 🆘 Suporte

Se tiver problemas:

1. Verifique o log do backend na inicialização
2. Confirme profile ativo: `Profile(s): [local]`
3. Verifique CORS: `Configurando CORS para origens: [...]`
4. Verifique cookies: `AVISO: Cookies com Secure=false`

Se ver esse aviso no log, significa que está tudo certo para desenvolvimento local! ✅

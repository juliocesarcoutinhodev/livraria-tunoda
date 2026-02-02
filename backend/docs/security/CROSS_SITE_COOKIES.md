# Cookies Cross-Site (Frontend e Backend em Domínios Diferentes)

## 📋 Configuração Implementada

### 1. Cookies com SameSite=None

Os cookies de autenticação agora usam:
- **Prefixo `__Secure-`**: Requerido por navegadores para cookies Secure
- **SameSite=None**: Permite envio em requisições cross-site
- **Secure=true**: Obrigatório quando SameSite=None (requer HTTPS)
- **HttpOnly=true**: Protege contra XSS

#### Cookies Criados:

```
Set-Cookie: __Secure-at=<access-token>; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=900
Set-Cookie: __Secure-rt=<refresh-token>; HttpOnly; Secure; SameSite=None; Path=/api/auth; Max-Age=2592000
```

### 2. CORS Configurado

O backend está configurado para aceitar requisições cross-origin com credenciais:

```yaml
app:
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS}
    allowed-methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
    allowed-headers: Authorization,Content-Type,Accept,Origin,X-Requested-With
    exposed-headers: Authorization
    allow-credentials: true
    max-age: 3600
```

**Headers de resposta:**
```
Access-Control-Allow-Origin: <origem-exata-do-frontend>
Access-Control-Allow-Credentials: true
```

### 3. Endpoints Atualizados

Todos os endpoints de autenticação suportam cookies:

- **POST /api/auth/login**: Retorna tokens no body + cookies
- **POST /api/auth/refresh**: Lê refresh token do cookie `__Secure-rt`
- **POST /api/auth/revoke**: Lê refresh token do cookie e limpa cookies
- **POST /api/auth/revoke-all**: Revoga todos os tokens e limpa cookies

---

## 🔧 Configuração por Ambiente

### Development (localhost)

**Opção 1: Profile Local (Recomendado) - HTTP Funciona!**

```bash
# .env ou variáveis de ambiente
SPRING_PROFILES_ACTIVE=local
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

O profile `local` automaticamente configura `cookies.secure=false`, permitindo desenvolvimento sem HTTPS.

**Cookies gerados:**
```
Set-Cookie: __Secure-at=...; HttpOnly; Secure=false; SameSite=None; Path=/; Max-Age=900
```

✅ **Frontend pode rodar em HTTP:** `http://localhost:3000`  
✅ **Backend pode rodar em HTTP:** `http://localhost:8080`

**Opção 2: HTTPS em localhost (se preferir testar com Secure=true)**

Use profile `dev` e configure HTTPS conforme seção "Testando Cross-Site" abaixo.

### Staging

```bash
CORS_ALLOWED_ORIGINS=https://staging-frontend.seudominio.com.br
```

### Production

```bash
CORS_ALLOWED_ORIGINS=https://www.seudominio.com.br,https://seudominio.com.br
```

**IMPORTANTE:** Nunca use `*` (wildcard) em produção quando `allow-credentials: true`.

---

## 🌐 Configuração do Frontend

### 1. Fetch API

```javascript
fetch('https://api.seudominio.com.br/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // ESSENCIAL para enviar/receber cookies
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'senha123'
  })
})
```

### 2. Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.seudominio.com.br',
  withCredentials: true // ESSENCIAL para cookies
});

// Login
await api.post('/api/auth/login', {
  email: 'admin@example.com',
  password: 'senha123'
});

// Refresh (não precisa enviar body, usa cookie automaticamente)
await api.post('/api/auth/refresh');

// Logout
await api.post('/api/auth/revoke');
```

### 3. Next.js (App Router)

```typescript
// app/api/auth/login/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  const response = await fetch('https://api.seudominio.com.br/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  
  // Repassa cookies do backend para o cliente
  const cookies = response.headers.get('set-cookie');
  const nextResponse = new Response(await response.text(), {
    status: response.status,
    headers: response.headers
  });
  
  return nextResponse;
}
```

---

## ✅ Checklist de Verificação

### Backend
- [x] Cookies com prefixo `__Secure-`
- [x] SameSite=None
- [x] Secure=true
- [x] HttpOnly=true
- [x] CORS com `allow-credentials: true`
- [x] `Access-Control-Allow-Origin` com origem exata (não `*`)
- [x] HTTPS em produção

### Frontend
- [ ] `credentials: 'include'` ou `withCredentials: true`
- [ ] Origem configurada no backend (`CORS_ALLOWED_ORIGINS`)
- [ ] HTTPS em produção (obrigatório para cookies Secure)
- [ ] Não tentar ler cookies via JavaScript (são HttpOnly)

---

## 🧪 Testando Cross-Site

### 1. Configurar Backend
```bash
# application.yml ou .env
CORS_ALLOWED_ORIGINS=https://localhost:3000
```

### 2. Iniciar Backend (HTTPS)
```bash
# Gerar certificado self-signed para testes
keytool -genkeypair -alias tomcat -keyalg RSA -keysize 2048 \
  -storetype PKCS12 -keystore keystore.p12 -validity 3650

# application.yml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: changeit
    key-store-type: PKCS12
```

### 3. Iniciar Frontend (HTTPS)
```bash
# Next.js
npm run dev -- --experimental-https

# Vite
npm run dev -- --https

# React (CRA)
HTTPS=true npm start
```

### 4. Testar Login
```javascript
// Console do navegador
fetch('https://localhost:8443/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'admin@livraria.com',
    password: 'sua-senha'
  })
})
.then(r => r.json())
.then(console.log)

// Verificar cookies no DevTools → Application → Cookies
// Deve ver: __Secure-at e __Secure-rt
```

---

## 🚨 Troubleshooting

### "Cookie não está sendo enviado"

**Causa:** `credentials: 'include'` ausente no frontend

**Solução:**
```javascript
fetch(url, { credentials: 'include' })
// ou
axios.create({ withCredentials: true })
```

### "CORS error: credentials mode is 'include'"

**Causa:** Backend está retornando `Access-Control-Allow-Origin: *`

**Solução:** Configure `CORS_ALLOWED_ORIGINS` com domínio exato:
```bash
CORS_ALLOWED_ORIGINS=https://meu-frontend.com
```

### "Cookie com Secure=true não funciona em HTTP"

**Causa:** Cookies Secure requerem HTTPS

**Solução (apenas desenvolvimento):**
- Use HTTPS em localhost (certificado self-signed)
- OU temporariamente remova flag Secure (NÃO fazer em produção)

### "Cookie não está acessível via document.cookie"

**Causa:** Cookies são HttpOnly (proposital para segurança)

**Solução:** Não tente acessar via JavaScript. O navegador envia automaticamente.

---

## 📚 Referências

- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Chrome: SameSite=None requires Secure](https://www.chromium.org/updates/same-site/)
- [MDN: CORS with credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)

# 🚀 Guia Simplificado - Deploy Staging

## 📋 SEU CENÁRIO:

- **Local:** Só banco no Docker, app na IDE
- **Staging:** App + Banco juntos no SaveInCloud
- **Produção:** (futuro) App e Banco separados

---

## 💻 DESENVOLVIMENTO LOCAL

### 1. Subir o Banco PostgreSQL

```bash
# Na pasta do projeto
cd /home/julio/GitHub/livraria-tunoda/backend

# Subir PostgreSQL
docker-compose up -d

# Verificar se está rodando
docker-compose ps

# Ver logs (se necessário)
docker-compose logs -f
```

### 2. Configurar a IDE

Seu `.env` deve ter:
```bash
POSTGRES_HOST=localhost  # ← Importante!
POSTGRES_PORT=5432
POSTGRES_DB=livraria_db
POSTGRES_USER=livraria_user
POSTGRES_PASSWORD=livraria_password
SPRING_PROFILES_ACTIVE=local
```

### 3. Rodar na IDE

- IntelliJ/Eclipse: Run `StartupApplication`
- A aplicação vai conectar no PostgreSQL do Docker
- Debug funcionando normalmente 🎉

---

## ☁️ STAGING (SaveInCloud)

### PASSO 1: Build e Push no Docker Hub (5 min)

```bash
# 1. Login no Docker Hub
docker login
# Digite: usuario e senha do hub.docker.com

# 2. Build da imagem (use SEU usuário do Docker Hub)
docker build -t SEU_USUARIO/livraria-tunoda:staging .
# Exemplo: docker build -t juliosilva/livraria-tunoda:staging .

# 3. Push
docker push SEU_USUARIO/livraria-tunoda:staging
```

✅ **Imagem agora está pública no Docker Hub!**

---

### PASSO 2: No SaveInCloud (10 min)

#### A. Criar Aplicação

1. **Dashboard SaveInCloud** → **"Nova Aplicação"**
2. **Tipo:** Selecione **"Docker Compose"** ou **"Multiple Containers"**
3. **Nome:** `livraria-staging`
4. **Região:** São Paulo

#### B. Colar o Docker Compose

Copie TODO o conteúdo de `docker-compose.staging.yml` e cole no campo de texto.

**OU** se não tiver campo de Docker Compose, crie 2 serviços manualmente:

**Serviço 1 - PostgreSQL:**
- Imagem: `postgres:17-alpine`
- Nome: `postgres`
- Variáveis:
  - `POSTGRES_USER=livraria_user`
  - `POSTGRES_PASSWORD=senha-segura-aqui`
  - `POSTGRES_DB=livraria_db`

**Serviço 2 - Aplicação:**
- Imagem: `SEU_USUARIO/livraria-tunoda:staging`
- Nome: `app`
- Porta: `8080`
- Depende de: `postgres`

#### C. Configurar Variáveis de Ambiente

**ESSENCIAIS (mínimo para funcionar):**

```bash
# Imagem Docker Hub
DOCKER_USERNAME=seu-usuario-dockerhub

# Banco (senha forte!)
POSTGRES_PASSWORD=senha-super-segura-123

# Security (gere com: openssl rand -base64 32)
JWT_SECRET=chave-gerada-muito-segura-aqui-32-caracteres

# Melhor Envio (token sandbox)
MELHOR_ENVIO_TOKEN=seu-token-aqui

# Mercado Pago (token sandbox)
MERCADO_PAGO_ACCESS_TOKEN=seu-token-aqui

# URLs (ajuste depois com domínio real)
MERCADO_PAGO_SUCCESS_URL=http://localhost:3000/payment/success
MERCADO_PAGO_FAILURE_URL=http://localhost:3000/payment/failure
MERCADO_PAGO_PENDING_URL=http://localhost:3000/payment/pending
MERCADO_PAGO_NOTIFICATION_URL=https://sua-url.saveincloud.app/api/webhooks/mercadopago
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### D. Deploy!

1. **Salve** todas as configurações
2. **Clique em "Deploy"** ou **"Iniciar"**
3. **Aguarde** 2-3 minutos

---

### PASSO 3: Validar (1 min)

```bash
# Pegar URL no dashboard (algo como):
# https://livraria-staging-xxx.saveincloud.app

# Testar health check
curl https://sua-url.saveincloud.app/api/v1/actuator/health

# Esperado: {"status":"UP"}
```

**No dashboard, veja os logs para confirmar:**
```
Application started successfully!
```

---

## 🔄 ATUALIZAR STAGING (próximas vezes)

Quando fizer mudanças no código:

```bash
# 1. Build nova versão
docker build -t SEU_USUARIO/livraria-tunoda:staging .

# 2. Push
docker push SEU_USUARIO/livraria-tunoda:staging

# 3. No SaveInCloud dashboard:
#    Clique em "Restart" ou "Redeploy"
#    (ele baixa a nova imagem automaticamente)
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Connection refused"
**Causa:** App não consegue conectar no banco

**Solução:**
- Verifique se `POSTGRES_HOST=postgres` (nome do serviço)
- Verifique se `POSTGRES_PASSWORD` está igual nos 2 serviços
- Veja logs do banco: procure por erros de inicialização

### Erro: "Image not found"
**Causa:** Imagem não está no Docker Hub

**Solução:**
```bash
# Verificar se existe
docker search SEU_USUARIO/livraria-tunoda

# Push novamente
docker push SEU_USUARIO/livraria-tunoda:staging
```

### Aplicação não inicia
**Solução:**
- Veja os logs no dashboard SaveInCloud
- Procure por erros de variáveis de ambiente faltando
- Confirme que todas as variáveis essenciais estão configuradas

---

## 💰 CUSTOS ESTIMADOS (SaveInCloud)

**Staging (app + banco juntos):**
- Instância: 1GB RAM + 0.5 CPU = ~R$ 30-50/mês
- Storage: 10GB = ~R$ 5/mês
- **Total:** ~R$ 35-55/mês

**Produção (separado - futuro):**
- App: 1GB RAM = ~R$ 30/mês
- Banco gerenciado: 1GB = ~R$ 50/mês
- Backup: ~R$ 10/mês
- **Total:** ~R$ 90/mês

---

## ✅ CHECKLIST RÁPIDO

**Local:**
- [ ] `docker-compose up -d` rodando
- [ ] App na IDE conecta no banco
- [ ] Consegue debugar normalmente

**Staging:**
- [ ] Imagem no Docker Hub
- [ ] Aplicação criada no SaveInCloud
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy feito
- [ ] Health check retorna `UP`
- [ ] API pública funciona

---

**🎉 Pronto! Agora você tem:**
- ✅ Desenvolvimento rápido (IDE + banco Docker)
- ✅ Staging funcional (tudo junto no SaveInCloud)
- ✅ Preparado para produção (quando quiser separar)


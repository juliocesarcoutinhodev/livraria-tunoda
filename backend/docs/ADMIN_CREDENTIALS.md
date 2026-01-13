# Credenciais de Desenvolvimento - Usuario Administrativo Inicial

## Usuario Administrativo Padrao

O sistema cria automaticamente um usuario administrativo inicial durante a execucao da migration V13.

### Credenciais de Desenvolvimento

```
Email: admin@livraria.com
Senha: admin123
```

### Detalhes do Usuario

- **ID:** `00000000-0000-0000-0000-000000000001`
- **Nome:** Administrador
- **Role:** ADMIN
- **Status:** ACTIVE

---

## Como Fazer Login

### 1. Via Postman/cURL

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@livraria.com",
    "password": "admin123"
  }'
```

### 2. Via Postman Collection

1. Abra a collection `Livraria-Tunoda-API.postman_collection.json`
2. Execute o endpoint: `POST /api/auth/login`
3. Body ja esta pre-preenchido com as credenciais
4. Tokens sao salvos automaticamente nas variaveis

---

## Seguranca

### Ambiente de Desenvolvimento

- Usuario admin criado automaticamente via migration
- Credenciais fixas para facilitar desenvolvimento
- Hash BCrypt da senha "admin123": `$2a$12$P0yvBoH9ucTiDfcUjG5T2uWsfyPLfRsJbpvsSOJ9Aqh1vWvdUOMtK`

### Ambiente de Producao

#### IMPORTANTE - ANTES DE DEPLOY EM PRODUCAO:

1. **ALTERAR SENHA IMEDIATAMENTE** apos primeiro acesso
2. **Considerar criar usuario com email corporativo**
3. **Nunca usar credenciais padrao em producao**
4. **Implementar politica de senha forte**
5. **Habilitar autenticacao de dois fatores (futuro)**

#### Opcoes para Producao:

**Opcao 1: Alterar senha via API (recomendado)**
- Fazer login com credenciais padrao
- Usar endpoint de alteracao de senha (quando implementado)
- Deletar usuario padrao e criar novo

**Opcao 2: Criar usuario via SQL direto no banco**
```sql
-- Gerar hash da senha segura
-- Usar BCrypt com 12+ rounds
INSERT INTO tb_users (id, name, email, password_hash, role, status, created_at, updated_at)
VALUES (
    UUID(),
    'Nome Admin Producao',
    'admin@empresa.com',
    'HASH_BCRYPT_AQUI',
    'ADMIN',
    'ACTIVE',
    NOW(),
    NOW()
);
```

**Opcao 3: Desabilitar migration V13 em producao**
- Adicionar profile check na migration
- Criar usuario manualmente no primeiro deploy

---

## Como Gerar Hash BCrypt

### Via Java

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

String senha = "minha-senha-segura";
String hash = new BCryptPasswordEncoder(12).encode(senha);
System.out.println(hash);
```

### Via Online Tool (desenvolvimento apenas)
- [bcrypt-generator.com](https://bcrypt-generator.com/)
- Usar 12 rounds
- NUNCA usar para producao (gerar hash localmente)

---

## Boas Praticas

### Para Desenvolvimento
✅ Usar credenciais padrao (admin@livraria.com / admin123)
✅ Compartilhar credenciais com time de dev
✅ Documentar claramente no README

### Para Producao
❌ NUNCA usar credenciais padrao
❌ NUNCA commitar credenciais reais
✅ Usar variaveis de ambiente
✅ Rotacionar senhas periodicamente
✅ Implementar auditoria de acessos
✅ Usar senhas fortes (12+ caracteres, misto)

---

## Troubleshooting

### Esqueci a senha de desenvolvimento
- Senha padrao: `admin123`
- Se alterou e esqueceu, execute migration novamente ou atualize direto no banco

### Usuario nao foi criado
- Verificar se migration V13 foi executada
- Verificar logs do Flyway
- Verificar se tabela tb_users existe

### Erro "Email already exists"
- Usuario ja foi criado
- Usar credenciais existentes ou deletar usuario do banco

### Login falha com credenciais corretas
- Verificar se senha foi alterada no banco
- Verificar se status do usuario e ACTIVE
- Verificar logs da aplicacao

---

## Referencias

- Migration: `V13__insert-admin-user.sql`
- Documentacao de Autenticacao: `README.md` (secao Autenticacao JWT)
- Postman Collection: `docs/Livraria-Tunoda-API.postman_collection.json`


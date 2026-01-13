# ✅ Token Configurado com Sucesso!

## 🎉 O que foi feito

### 1. Token adicionado ao arquivo `.env`

O token do Melhor Envio foi configurado em:
```
/home/julio/GitHub/livraria-tunoda/backend/.env
```

### 2. Variáveis configuradas

```bash
MELHOR_ENVIO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOi...
MELHOR_ENVIO_FROM_CEP=01310-100
```

### 3. Arquivo `.env.example` atualizado

Para que outros desenvolvedores saibam o que configurar (sem expor o token real).

### 4. Script de teste criado

Um script bash para testar toda a integração de forma automatizada.

---

## 🚀 Como Usar Agora

### Passo 1: Iniciar a Aplicação

```bash
cd /home/julio/GitHub/livraria-tunoda/backend
./mvnw spring-boot:run
```

**Aguarde ver:** `Started StartupApplication in X.XXX seconds`

### Passo 2: Testar a Integração

Em outro terminal:

```bash
cd /home/julio/GitHub/livraria-tunoda/backend
./test-melhor-envio.sh
```

Esse script vai:
1. ✅ Criar um carrinho
2. ✅ Buscar um livro disponível
3. ✅ Adicionar o livro ao carrinho
4. ✅ Criar uma cotação de frete
5. ✅ Calcular o frete com o Melhor Envio

### Passo 3: Ver as Opções de Frete

Se tudo funcionar, você verá algo como:

```json
{
  "id": "quote-uuid",
  "status": "CALCULATED",
  "options": [
    {
      "serviceCode": ".PACKAGE",
      "serviceName": "PAC",
      "company": {
        "name": "Correios",
        "picture": "https://..."
      },
      "price": 25.00,
      "deliveryDays": 10
    },
    {
      "serviceCode": "1",
      "serviceName": "SEDEX",
      "company": {
        "name": "Correios"
      },
      "price": 35.00,
      "deliveryDays": 5
    }
  ]
}
```

---

## 🧪 Testes Manuais (via Postman/Curl)

### 1. Criar Carrinho
```bash
curl -X POST http://localhost:8080/api/carts
```

### 2. Adicionar Livro
```bash
curl -X POST http://localhost:8080/api/carts/{cartId}/items \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "uuid-do-livro",
    "quantity": 1
  }'
```

### 3. Criar Cotação
```bash
curl -X POST "http://localhost:8080/api/shipping/quotes?cartId={cartId}"
```

### 4. Calcular Frete
```bash
curl -X POST http://localhost:8080/api/shipping/quotes/{quoteId}/calculate
```

---

## 📝 Informações do Token

### Validade
Seu token expira em: **2026-12-31** (aproximadamente 1 ano)

### Escopos Disponíveis
O token tem permissões para:
- ✅ Calcular frete (`shipping-calculate`)
- ✅ Gerar etiquetas (`shipping-generate`)
- ✅ Rastreamento (`shipping-tracking`)
- ✅ Checkout (`shipping-checkout`)
- ✅ Carrinho (`cart-read`, `cart-write`)
- E muitos outros...

### Ambiente
- 🟢 **Sandbox** - Ambiente de testes
- URL: `https://sandbox.melhorenvio.com.br`
- Crédito: R$ 10.000,00 (fictício)

---

## ⚠️ Segurança

### ✅ Configurações de Segurança Aplicadas

1. **`.env` está no `.gitignore`**
   - Seu token NÃO será commitado no Git
   - Seguro para trabalhar em equipe

2. **`.env.example` sem dados sensíveis**
   - Exemplo para outros desenvolvedores
   - Sem token real

3. **Token com validade limitada**
   - Expira automaticamente após 1 ano
   - Pode ser revogado no painel do Melhor Envio

---

## 🔧 Troubleshooting

### Se der erro "Token inválido" ou "Unauthorized"

1. Verifique se a aplicação está lendo o `.env`:
   ```bash
   # Reinicie a aplicação
   # O Spring Boot Devtools carrega o .env automaticamente
   ```

2. Verifique se o token está correto:
   ```bash
   cat .env | grep MELHOR_ENVIO_TOKEN
   ```

3. Se necessário, exporte manualmente:
   ```bash
   export MELHOR_ENVIO_TOKEN="seu-token-aqui"
   ./mvnw spring-boot:run
   ```

### Se o livro não tiver peso configurado

```bash
# O cálculo de frete precisa do peso do livro
# Certifique-se de que o livro tem o campo "weight" preenchido
```

### Se não houver livros cadastrados

1. Cadastre um autor primeiro:
```bash
curl -X POST http://localhost:8080/api/admin/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Robert C. Martin",
    "biography": "Software engineer and author",
    "photoUrl": "https://example.com/photo.jpg"
  }'
```

2. Depois cadastre um livro:
```bash
curl -X POST http://localhost:8080/api/admin/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "description": "A Handbook of Agile Software Craftsmanship",
    "price": 49.90,
    "weight": 0.5,
    "photoUrl": "https://example.com/book.jpg",
    "authorIds": ["author-id-aqui"]
  }'
```

---

## 📚 Documentação Adicional

- **MELHOR_ENVIO_QUICKSTART.md** - Guia rápido completo
- **MELHOR_ENVIO_INTEGRATION.md** - Documentação técnica
- **COMO_OBTER_TOKEN.md** - Como gerar novos tokens

---

## 🎯 Próximos Passos

Agora você pode:

1. ✅ Testar o cálculo de frete
2. ✅ Integrar com seu frontend (futuramente)
3. ✅ Adicionar mais transportadoras
4. ✅ Implementar seleção de frete no checkout
5. ✅ Gerar etiquetas (quando for para produção)

---

## 💬 Suporte

Se precisar de ajuda:
- 📖 Documentação oficial: https://docs.melhorenvio.com.br
- 💬 Suporte Melhor Envio: contato@melhorenvio.com.br

---

**Configuração concluída com sucesso!** 🚀

Execute `./test-melhor-envio.sh` para verificar se está tudo funcionando.


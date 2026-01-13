# Guia Rápido - Melhor Envio (Desenvolvimento de API)

Este guia é para desenvolvedores que estão construindo apenas a API backend, sem frontend ainda.

## 1. Obter Token de Desenvolvimento

### Opção 1: User Token (Mais Simples - Recomendado)

1. Acesse: https://sandbox.melhorenvio.com.br
2. Faça login ou crie uma conta gratuita
3. Vá no menu do usuário (canto superior direito)
4. Clique em **Gerenciar Tokens**
5. Clique em **Criar novo token**
6. Dê um nome para o token (ex: "Desenvolvimento API")
7. Copie o token gerado (só aparece uma vez!)

### Opção 2: Credito de Teste

O Melhor Envio oferece **R$ 10.000,00 em crédito fictício** no sandbox para você testar sem custo.

## 2. Configurar o Projeto

### 2.1 Criar variável de ambiente

**Linux/Mac:**
```bash
export MELHOR_ENVIO_TOKEN=seu-token-aqui
export MELHOR_ENVIO_FROM_CEP=01310-100
```

**Windows (PowerShell):**
```powershell
$env:MELHOR_ENVIO_TOKEN="seu-token-aqui"
$env:MELHOR_ENVIO_FROM_CEP="01310-100"
```

**IntelliJ IDEA:**
1. Run → Edit Configurations
2. Environment variables:
   ```
   MELHOR_ENVIO_TOKEN=seu-token-aqui;MELHOR_ENVIO_FROM_CEP=01310-100
   ```

### 2.2 Ou editar application-dev.yml

```yaml
melhor-envio:
  token: seu-token-aqui
  from-postal-code: 01310-100
```

## 3. Iniciar a Aplicação

```bash
./mvnw spring-boot:run
```

## 4. Testar a Integração

### 4.1 Criar um Carrinho
```bash
curl -X POST http://localhost:8080/api/carts
```

Resposta:
```json
{
  "cartId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "ACTIVE",
  "items": [],
  "total": 0.00
}
```

### 4.2 Adicionar um Livro
Primeiro, cadastre um livro (ou use um existente):
```bash
curl -X POST http://localhost:8080/api/admin/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "description": "A Handbook of Agile Software Craftsmanship",
    "price": 49.90,
    "weight": 0.5,
    "photoUrl": "https://example.com/clean-code.jpg",
    "authorIds": ["author-id-aqui"]
  }'
```

Depois adicione ao carrinho:
```bash
curl -X POST http://localhost:8080/api/carts/{cartId}/items \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "book-id-aqui",
    "quantity": 1
  }'
```

### 4.3 Criar Cotação de Frete
```bash
curl -X POST "http://localhost:8080/api/shipping/quotes?cartId={cartId}"
```

Resposta:
```json
{
  "id": "quote-id",
  "cartId": "cart-id",
  "status": "CREATED",
  "options": [
    {
      "serviceCode": "TEMP",
      "serviceName": "Temporario",
      "company": "Sistema",
      "price": 0.00,
      "deliveryDays": 0
    }
  ]
}
```

### 4.4 Calcular Frete Real
```bash
curl -X POST http://localhost:8080/api/shipping/quotes/{quoteId}/calculate
```

Resposta esperada:
```json
{
  "id": "quote-id",
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
        "name": "Correios",
        "picture": "https://..."
      },
      "price": 35.00,
      "deliveryDays": 5
    }
  ]
}
```

## Troubleshooting

### Erro 401 (Unauthorized)
- Token inválido ou expirado
- Verifique se copiou o token corretamente
- Gere um novo token se necessário

### Erro 400 (Bad Request)
- CEP inválido
- Peso do livro não configurado
- Verifique os dados enviados

### Erro 500 (Internal Server Error)
- Verifique os logs da aplicação
- Certifique-se de que o token está configurado
- Verifique se o Melhor Envio está online

### Erro de Conexão
- Verifique sua conexão com a internet
- Sandbox do Melhor Envio pode estar em manutenção
- Tente novamente em alguns minutos

## Próximos Passos

### Para Produção (quando tiver frontend):
1. Implementar OAuth2 completo
2. Usar ambiente de produção: `https://melhorenvio.com.br`
3. Obter credenciais de produção
4. Implementar webhook para rastreamento

### Documentação Oficial:
- API Docs: https://docs.melhorenvio.com.br
- Calculadora: https://docs.melhorenvio.com.br/reference/calculo-de-frete

## Limites do Sandbox

- ✅ Cálculo de frete ilimitado
- ✅ R$ 10.000 de crédito fictício
- ✅ Todos os serviços disponíveis
- ❌ Não gera etiquetas reais
- ❌ Não realiza postagem real
- ❌ Rastreamento simulado


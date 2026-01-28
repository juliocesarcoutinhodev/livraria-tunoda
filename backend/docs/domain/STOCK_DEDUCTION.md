# Baixa Automática de Estoque

## 📋 Visão Geral

Implementação de baixa automática de estoque quando um pedido é confirmado após aprovação do pagamento pelo Mercado Pago.

## 🎯 Objetivo

Garantir que o estoque dos livros seja atualizado automaticamente quando o pagamento for aprovado, evitando vendas de produtos sem estoque disponível.

## 🏗️ Arquitetura

### Componentes Criados

#### 1. DeductStockFromOrderUseCase

**Responsabilidade:** Deduzir estoque dos livros quando um pedido é confirmado.

**Localização:** `application/usecase/DeductStockFromOrderUseCase.java`

**Funcionamento:**
- Recebe um `Order` confirmado
- Para cada `OrderItem`:
  - Busca o `Book` correspondente
  - Valida se existe estoque suficiente
  - Chama `book.removeStock(quantity)`
  - Salva o livro atualizado
- Registra logs detalhados de auditoria
- Alerta quando estoque fica baixo (< 5 unidades)
- Alerta quando livro fica esgotado

**Transação:** `@Transactional` - Garante atomicidade

**Exceções:**
- `ResourceNotFoundException`: Livro não encontrado
- `BusinessException`: Estoque insuficiente

### 2. Integração no ProcessMercadoPagoWebhookUseCase

**Modificações:**
- Injeta `DeductStockFromOrderUseCase`
- Após `order.confirm()`, chama `deductStockFromOrderUseCase.execute(order)`
- Tratamento de erro com reversão: se falhar a baixa de estoque, o pedido é expirado

## 🔄 Fluxo Completo

```
1. Mercado Pago envia webhook → /api/webhooks/mercadopago
2. ProcessMercadoPagoWebhookUseCase processa
3. Se status = "approved":
   a. payment.approve()
   b. deductStockFromOrderUseCase.execute(order)
      - Para cada item do pedido:
        * Busca livro
        * Valida estoque
        * book.removeStock(quantidade)
        * Salva livro
   c. order.confirm() (só confirma após estoque deduzido com sucesso)
   d. Salva payment e order
4. Se falhar dedução de estoque:
   - order.expire() (pedido ainda está PENDING)
   - Lança BusinessException
   - Transação é revertida
```

## 🔒 Garantias

### Atomicidade
- ✅ Toda operação está em `@Transactional`
- ✅ Se falhar em qualquer ponto, toda transação é revertida
- ✅ Não há risco de pedido confirmado com estoque não deduzido

### Validações
- ✅ Valida existência do livro
- ✅ Valida estoque suficiente antes de deduzir
- ✅ Impede estoque negativo (validação no domínio `Book`)

### Auditoria
- ✅ Logs detalhados de cada operação
- ✅ Log de estoque antes e depois
- ✅ Alertas de estoque baixo
- ✅ Alertas de produto esgotado

## 📊 Logs Gerados

### Sucesso
```
INFO  Iniciando deducao de estoque para order: {orderId}
DEBUG Processando item: Book {bookId} (Clean Code), Quantidade: 2
INFO  Estoque deduzido com sucesso. Livro: Clean Code | Antes: 10 | Deduzido: 2 | Depois: 8
INFO  Deducao de estoque concluida com sucesso. Order: {orderId} | Itens processados: 3 | Quantidade total deduzida: 5
```

### Estoque Baixo
```
WARN  ALERTA: Estoque baixo para livro 'Clean Code'. Estoque atual: 3
```

### Esgotado
```
WARN  ALERTA: Livro 'Design Patterns' ESGOTADO apos deducao
```

### Erro
```
ERROR Livro nao encontrado ao deduzir estoque. BookId: {bookId}, Order: {orderId}
ERROR Estoque insuficiente para livro Clean Code. Disponivel: 1, Solicitado: 2
ERROR Erro ao deduzir estoque para order: {orderId}. Erro: Estoque insuficiente
```

## 🧪 Testes

### DeductStockFromOrderUseCaseTest

- ✅ Dedução com sucesso
- ✅ Livro não encontrado
- ✅ Estoque insuficiente
- ✅ Pedido vazio
- ✅ Alerta de estoque baixo
- ✅ Alerta de estoque zerado
- ✅ Pedido com item único

### ProcessMercadoPagoWebhookUseCaseTest

- ✅ Webhook aprovado (com dedução de estoque)
- ✅ Reversão quando dedução falha

**Total:** 9 testes cobrindo casos principais e edge cases

## 🚨 Cenários de Erro

### 1. Livro Deletado/Não Existe
- **Erro:** `ResourceNotFoundException`
- **Ação:** Transação revertida, pedido não confirmado
- **Mensagem:** "Livro não encontrado: {título}"

### 2. Estoque Insuficiente
- **Erro:** `BusinessException`
- **Ação:** Transação revertida, pedido expirado
- **Mensagem:** "Estoque insuficiente para o livro '{título}'. Disponível: X, Necessário: Y"

### 3. Erro Genérico
- **Erro:** `BusinessException`
- **Ação:** Transação revertida, pedido expirado
- **Mensagem:** "Erro ao deduzir estoque: {mensagem original}"

## 🔧 Configuração

Nenhuma configuração adicional necessária. A funcionalidade está integrada ao fluxo existente de webhook do Mercado Pago.

## 📝 Próximas Melhorias (Opcional)

1. **Notificação de Estoque Baixo**
   - Enviar email/notificação para admin quando estoque < 5

2. **Dashboard de Estoque**
   - Métricas de produtos mais vendidos
   - Alertas visuais de estoque crítico

3. **Histórico de Movimentação**
   - Tabela de auditoria de estoque
   - Rastreabilidade completa

4. **Reserva de Estoque**
   - Reservar estoque ao criar pedido (antes do pagamento)
   - Liberar se pagamento não for aprovado em X horas

## 📚 Referências

- `domain/model/Book.java` - Métodos de estoque
- `domain/model/Order.java` - Entidade de pedido
- `docs/domain/orders.md` - Documentação do domínio de pedidos
- `docs/integrations/WEBHOOK_MERCADO_PAGO.md` - Webhook do Mercado Pago

# Stories Implementadas - Carrinho de Compras

## 📋 Story #1: Representar Carrinho de Compras no Domínio

### Objetivo
Criar um modelo de domínio sólido para o carrinho de compras, com regras claras de consistência, preparado para evolução futura sem acoplamento com pagamento, frete ou comunicação.

### Implementação

#### Entidades e Value Objects Criados

**1. CartId** - `domain/model/CartId.java`
- Identidade tipada para o carrinho
- Métodos: `of()` e `generate()`
- Validação de nulidade

**2. CartStatus** - `domain/model/vo/CartStatus.java`
- Enum com estados: `ACTIVE`, `EXPIRED`, `CONVERTED`
- Controla o ciclo de vida do carrinho

**3. Cart** - `domain/model/Cart.java` (Aggregate Root)
- **Atributos:**
  - `id: CartId` - Identificador único
  - `items: List<CartItem>` - Lista de itens
  - `createdAt: LocalDateTime` - Data de criação
  - `updatedAt: LocalDateTime` - Data de atualização
  - `status: CartStatus` - Status do carrinho

- **Métodos Principais:**
  - `create()` - Cria carrinho vazio com status ACTIVE
  - `reconstitute()` - Reconstitui carrinho existente
  - `addItem()` - Adiciona item (incrementa se já existir)
  - `updateItem()` - Atualiza quantidade de item
  - `removeItem()` - Remove item do carrinho
  - `calculateSubtotal()` - Calcula subtotal dos itens
  - `calculateTotal()` - Calcula total
  - `isValid()` - Verifica se carrinho é válido
  - `markAsExpired()` - Marca como expirado
  - `markAsConverted()` - Marca como convertido em pedido

- **Regras de Negócio:**
  - Carrinho inicia sempre com status ACTIVE
  - Carrinho não pode ser alterado se EXPIRED ou CONVERTED
  - Carrinho vazio não é válido
  - Ao adicionar mesmo livro, incrementa quantidade
  - Carrinho expirado não pode ser convertido
  - Carrinho convertido não pode ser expirado novamente

---

## 📋 Story #2: Representar Item do Carrinho

### Objetivo
Criar um modelo de domínio para os itens do carrinho, garantindo consistência de valores, isolamento do catálogo e previsibilidade financeira ao longo do fluxo de compra.

### Implementação

#### Entidade Criada

**1. CartItemId** - `domain/model/CartItemId.java`
- Identidade tipada para cada item do carrinho
- Métodos: `of()` e `generate()`

**2. CartItem** - `domain/model/vo/CartItem.java` (Entidade)
- **Atributos:**
  - `id: CartItemId` - Identificador interno do item
  - `bookId: BookId` - Referência ao livro
  - `bookTitle: String` - Título do livro armazenado (histórico consistente)
  - `quantity: int` - Quantidade (mutável)
  - `unitPrice: Money` - Preço unitário congelado (final, imutável)

- **Métodos:**
  - `create()` - Cria novo item com ID gerado
  - `reconstitute()` - Reconstitui item existente
  - `updateQuantity()` - Atualiza quantidade
  - `incrementQuantity()` - Incrementa quantidade
  - `getSubtotal()` - Calcula subtotal (preço × quantidade)
  - `isForBook()` - Verifica se item é para determinado livro

- **Regras de Negócio:**
  - Quantidade mínima igual a 1
  - Quantidade deve ser inteiro positivo
  - Preço unitário não pode ser alterado (campo final)
  - Subtotal sempre consistente (preço × quantidade)
  - Item não pode existir sem BookId válido
  - Item não pode existir sem título do livro

### Decisões Importantes

1. **Título do livro armazenado no item**
   - Evita dependência de leitura futura do catálogo
   - Garante histórico consistente

2. **Preço congelado no item**
   - Campo `final` garante imutabilidade
   - Alterações de preço não afetam carrinhos já iniciados

3. **Subtotal calculado dinamicamente**
   - Nunca persistido manualmente
   - Evita inconsistências financeiras

4. **CartItem como Entidade (não Value Object)**
   - Possui identidade própria
   - Permite rastreamento individual
   - Quantidade é mutável

---

## 🧪 Testes Implementados

### Testes Unitários

**CartTest** - 20 testes
- Criação de carrinho
- Adição, atualização e remoção de itens
- Cálculos de subtotal e total
- Validação de status
- Transições de estado (ACTIVE → EXPIRED/CONVERTED)
- Regras de modificação por status

**CartItemTest** - 16 testes
- Criação e validação de item
- Atualização e incremento de quantidade
- Cálculo de subtotal
- Verificação de imutabilidade do preço
- Validações de negócio
- Identificação de livro

**Total: 36 testes - 100% passando ✅**

### Configuração de Testes de Integração

**Problema Resolvido:**
- `StartupApplicationTests` falhava ao tentar conectar ao MySQL

**Solução Implementada:**
- H2 Database em memória para testes
- Configuração isolada em `src/test/resources/application.yml`
- Hibernate com `create-drop` (cria/remove schema automaticamente)
- Flyway desabilitado para testes (usa JPA)

**Arquivos Criados:**
- `pom.xml` - Dependência H2 com escopo test
- `src/test/resources/application.yml` - Configuração de testes
- `src/test/README.md` - Documentação de testes

---

## ✅ Critérios de Aceite Atendidos

### Story #1 - Carrinho
- ✅ Entidade Cart como Aggregate Root
- ✅ Identificador único (CartId)
- ✅ Lista de itens do carrinho
- ✅ Datas de criação e atualização
- ✅ Status (ACTIVE, EXPIRED, CONVERTED)
- ✅ Regras de transição de status
- ✅ Métodos explícitos para operações
- ✅ Validação de estado
- ✅ Cálculos de subtotal e total

### Story #2 - CartItem
- ✅ Entidade CartItem criada
- ✅ Identificador interno (CartItemId)
- ✅ Referência ao livro (BookId)
- ✅ Título do livro armazenado
- ✅ Quantidade mutável
- ✅ Preço unitário imutável (congelado)
- ✅ Subtotal calculado dinamicamente
- ✅ Métodos de atualização de quantidade
- ✅ Validações completas

---

## 🎯 Características Técnicas

- ✅ Domínio puro (sem anotações JPA)
- ✅ Uso de Value Objects (Money, CartStatus)
- ✅ Identidades tipadas
- ✅ Validações centralizadas no domínio
- ✅ Métodos explícitos (não setters genéricos)
- ✅ Imutabilidade onde faz sentido
- ✅ Código limpo e autoexplicativo
- ✅ Testes com alta cobertura
- ✅ Comentários como se fosse o desenvolvedor

---

## 🚫 Fora do Escopo (Próximas Stories)

- Persistência do carrinho
- Cálculo de frete
- Integração com pagamento
- Cupons de desconto
- Autenticação/usuário
- Estoque
- Impostos

---

## 📝 Observações

- O domínio está pronto para persistência (próxima story)
- Arquitetura preparada para evolução
- Baixo acoplamento entre agregados
- Regras de negócio protegidas
- Fácil manutenção e teste

---

**Desenvolvido seguindo:**
- Domain-Driven Design (DDD)
- Clean Architecture
- SOLID Principles
- Test-Driven Development (TDD)


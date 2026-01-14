# 📊 COMPARAÇÃO: MySQL vs PostgreSQL - Livraria Tunoda

## 🎯 Tabela de Equivalências

### Tipos de Dados

| Feature | MySQL | PostgreSQL | Status | Observação |
|---------|-------|------------|--------|------------|
| String curta | VARCHAR(n) | VARCHAR(n) | ✅ Compatível | Sem mudança |
| String longa | TEXT | TEXT | ✅ Compatível | Sem mudança |
| Inteiro | INT | INTEGER | ✅ Compatível | Alias INT funciona |
| Decimal | DECIMAL(p,s) | DECIMAL(p,s) | ✅ Compatível | Sem mudança |
| Booleano | BOOLEAN | BOOLEAN | ✅ Compatível | Sem mudança |
| Data/Hora | TIMESTAMP | TIMESTAMP | ✅ Compatível | Preferir NOW() |
| JSON | JSON | JSONB | ⚠️ Trocar | JSONB é mais performático |
| UUID | VARCHAR(36) | VARCHAR(36) ou UUID | ✅ OK | Manter VARCHAR(36) |

### Constraints e Índices

| Feature | MySQL | PostgreSQL | Status |
|---------|-------|------------|--------|
| PRIMARY KEY | ✅ | ✅ | Compatível |
| FOREIGN KEY | ✅ | ✅ | Compatível |
| UNIQUE | ✅ | ✅ | Compatível |
| CHECK | ✅ | ✅ | Compatível |
| INDEX | ✅ | ✅ | Compatível |
| ON DELETE CASCADE | ✅ | ✅ | Compatível |
| ON DELETE RESTRICT | ✅ | ✅ | Compatível |

### Funções e Defaults

| Feature | MySQL | PostgreSQL | Status | Ação |
|---------|-------|------------|--------|------|
| Timestamp atual | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP ou NOW() | ✅ | Usar NOW() |
| Auto-update timestamp | ON UPDATE CURRENT_TIMESTAMP | ❌ Não tem | ⚠️ | Usar @PreUpdate JPA |
| Comentários | COMMENT 'texto' | COMMENT ON ... IS 'texto' | ⚠️ | Reescrever |

---

## 📋 MAPEAMENTO POR TABELA

### tb_books (V1)

| Coluna | Tipo MySQL | Tipo PostgreSQL | Mudança? |
|--------|-----------|----------------|----------|
| id | VARCHAR(36) | VARCHAR(36) | ✅ OK |
| title | VARCHAR(300) | VARCHAR(300) | ✅ OK |
| description | TEXT | TEXT | ✅ OK |
| photo_url | VARCHAR(500) | VARCHAR(500) | ✅ OK |
| isbn | VARCHAR(20) | VARCHAR(20) | ✅ OK |
| price_amount | DECIMAL(10,2) | DECIMAL(10,2) | ✅ OK |
| price_currency | VARCHAR(3) | VARCHAR(3) | ✅ OK |
| weight_value | DECIMAL(10,3) | DECIMAL(10,3) | ✅ OK |
| weight_unit | VARCHAR(20) | VARCHAR(20) | ✅ OK |
| status | VARCHAR(20) | VARCHAR(20) | ✅ OK |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | TIMESTAMP DEFAULT NOW() | ⚠️ Trocar |
| updated_at | TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | TIMESTAMP DEFAULT NOW() | ⚠️ Remover ON UPDATE |

### tb_authors (V1)

| Coluna | Tipo MySQL | Tipo PostgreSQL | Mudança? |
|--------|-----------|----------------|----------|
| id | VARCHAR(36) | VARCHAR(36) | ✅ OK |
| name | VARCHAR(200) | VARCHAR(200) | ✅ OK |
| biography | TEXT | TEXT | ✅ OK |
| photo_url | VARCHAR(500) | VARCHAR(500) | ✅ OK |
| status | VARCHAR(20) | VARCHAR(20) | ✅ OK |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | TIMESTAMP DEFAULT NOW() | ⚠️ Trocar |
| updated_at | TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | TIMESTAMP DEFAULT NOW() | ⚠️ Remover ON UPDATE |

### tb_shipping_payloads (V7)

| Coluna | Tipo MySQL | Tipo PostgreSQL | Mudança? |
|--------|-----------|----------------|----------|
| id | VARCHAR(36) | VARCHAR(36) | ✅ OK |
| shipping_quote_id | VARCHAR(36) | VARCHAR(36) | ✅ OK |
| provider | VARCHAR(50) | VARCHAR(50) | ✅ OK |
| raw_payload | **JSON** | **JSONB** | ⚠️ **TROCAR** |
| created_at | TIMESTAMP | TIMESTAMP | ✅ OK |

### tb_users (V11)

| Coluna | Tipo MySQL | Tipo PostgreSQL | Mudança? |
|--------|-----------|----------------|----------|
| id | VARCHAR(36) COMMENT '...' | VARCHAR(36) | ⚠️ Remover COMMENT |
| name | VARCHAR(200) COMMENT '...' | VARCHAR(200) | ⚠️ Remover COMMENT |
| email | VARCHAR(255) COMMENT '...' | VARCHAR(255) | ⚠️ Remover COMMENT |
| password_hash | VARCHAR(255) COMMENT '...' | VARCHAR(255) | ⚠️ Remover COMMENT |
| role | VARCHAR(20) COMMENT '...' | VARCHAR(20) | ⚠️ Remover COMMENT |
| status | VARCHAR(20) COMMENT '...' | VARCHAR(20) | ⚠️ Remover COMMENT |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '...' | TIMESTAMP DEFAULT NOW() | ⚠️ Trocar + remover COMMENT |
| updated_at | TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '...' | TIMESTAMP DEFAULT NOW() | ⚠️ Trocar + remover ON UPDATE + remover COMMENT |

### tb_refresh_tokens (V12)

| Coluna | Tipo MySQL | Tipo PostgreSQL | Mudança? |
|--------|-----------|----------------|----------|
| id | VARCHAR(36) COMMENT '...' | VARCHAR(36) | ⚠️ Remover COMMENT |
| user_id | VARCHAR(36) COMMENT '...' | VARCHAR(36) | ⚠️ Remover COMMENT |
| token | VARCHAR(36) COMMENT '...' | VARCHAR(36) | ⚠️ Remover COMMENT |
| created_at | TIMESTAMP COMMENT '...' | TIMESTAMP | ⚠️ Remover COMMENT |
| expires_at | TIMESTAMP COMMENT '...' | TIMESTAMP | ⚠️ Remover COMMENT |
| revoked | BOOLEAN COMMENT '...' | BOOLEAN | ⚠️ Remover COMMENT |

---

## 🔄 SINTAXE SQL: MySQL vs PostgreSQL

### 1. CREATE TABLE

#### ✅ Compatível (sem mudança)
```sql
CREATE TABLE tb_example (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    CONSTRAINT uk_name UNIQUE (name)
);
```

#### ⚠️ Incompatível (precisa mudança)

**MySQL:**
```sql
CREATE TABLE tb_users (
    id VARCHAR(36) PRIMARY KEY COMMENT 'Identificador',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT 'Tabela de usuários';
```

**PostgreSQL:**
```sql
CREATE TABLE tb_users (
    id VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE tb_users IS 'Tabela de usuários';
COMMENT ON COLUMN tb_users.id IS 'Identificador';
```

---

### 2. ALTER TABLE

#### ✅ Compatível
```sql
-- Adicionar coluna
ALTER TABLE tb_orders ADD COLUMN total DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Adicionar constraint
ALTER TABLE tb_orders ADD CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES tb_carts(id);

-- Drop default
ALTER TABLE tb_orders ALTER COLUMN total DROP DEFAULT;
```

#### ⚠️ Incompatível

**MySQL:**
```sql
ALTER TABLE tb_orders
    MODIFY COLUMN total DECIMAL(10,2) NOT NULL COMMENT 'Total do pedido';
```

**PostgreSQL:**
```sql
-- MODIFY não existe, mas não precisamos alterar tipo (já está correto)
-- Apenas adicionar comentário:
COMMENT ON COLUMN tb_orders.total IS 'Total do pedido';
```

---

### 3. INDEX

#### ✅ Ambas as sintaxes funcionam no PostgreSQL

**MySQL (inline):**
```sql
CREATE TABLE tb_books (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    INDEX idx_title (title)
);
```

**PostgreSQL (preferível - separado):**
```sql
CREATE TABLE tb_books (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(300) NOT NULL
);

CREATE INDEX idx_title ON tb_books(title);
```

---

### 4. JSON

**MySQL:**
```sql
CREATE TABLE tb_payloads (
    data JSON NOT NULL
);
```

**PostgreSQL (MELHOR):**
```sql
CREATE TABLE tb_payloads (
    data JSONB NOT NULL  -- Mais performático, suporta índices
);
```

**Operações JSONB (extra):**
```sql
-- Buscar dentro do JSON (PostgreSQL)
SELECT * FROM tb_payloads WHERE data->>'provider' = 'CORREIOS';

-- Criar índice em campo JSON (PostgreSQL)
CREATE INDEX idx_payloads_provider ON tb_payloads((data->>'provider'));
```

---

## 🚀 FEATURES EXCLUSIVAS DO POSTGRESQL

### 1. JSONB com Índices
```sql
-- Criar índice GIN para buscas em JSONB
CREATE INDEX idx_shipping_payloads_gin ON tb_shipping_payloads USING GIN (raw_payload);

-- Buscar dentro do JSON
SELECT * FROM tb_shipping_payloads
WHERE raw_payload @> '{"provider": "CORREIOS"}';
```

### 2. Array Types
```sql
-- Armazenar array de strings
CREATE TABLE tb_tags (
    id VARCHAR(36),
    tags TEXT[]
);

-- Buscar
SELECT * FROM tb_tags WHERE 'romance' = ANY(tags);
```

### 3. Full Text Search
```sql
-- Busca textual nativa
SELECT * FROM tb_books
WHERE to_tsvector('portuguese', title || ' ' || description)
      @@ to_tsquery('portuguese', 'java');
```

### 4. UUID Nativo (opcional para o futuro)
```sql
-- Tipo UUID nativo (mais eficiente que VARCHAR(36))
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tb_example (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);
```

---

## 📊 PERFORMANCE: MySQL vs PostgreSQL

### Queries Simples
| Operação | MySQL | PostgreSQL | Vencedor |
|----------|-------|------------|----------|
| SELECT por PK | Rápido | Rápido | Empate |
| INSERT simples | Rápido | Rápido | Empate |
| UPDATE simples | Rápido | Rápido | Empate |

### Queries Complexas
| Operação | MySQL | PostgreSQL | Vencedor |
|----------|-------|------------|----------|
| JOINs múltiplos | Bom | Melhor | PostgreSQL |
| Subconsultas | Bom | Melhor | PostgreSQL |
| Window Functions | Limitado | Completo | PostgreSQL |
| CTEs (WITH) | Sim | Sim + Recursivas | PostgreSQL |

### JSON
| Operação | MySQL | PostgreSQL | Vencedor |
|----------|-------|------------|----------|
| Armazenar JSON | JSON | JSONB | PostgreSQL |
| Buscar em JSON | Lento | Rápido (com índice) | PostgreSQL |
| Índices em JSON | Não | Sim (GIN/GiST) | PostgreSQL |
| Manipular JSON | Limitado | Completo | PostgreSQL |

---

## 🔒 CONCORRÊNCIA E LOCKS

| Feature | MySQL (InnoDB) | PostgreSQL | Observação |
|---------|---------------|------------|------------|
| MVCC | ✅ | ✅ | Ambos suportam |
| Row-level locks | ✅ | ✅ | Ambos |
| Table-level locks | ✅ | Menos usado | PostgreSQL evita |
| Deadlock detection | ✅ | ✅ | Ambos |
| Lock granularity | Bom | Melhor | PostgreSQL mais granular |

---

## 🎯 RECOMENDAÇÕES PARA O PROJETO

### Mudanças Obrigatórias (Incompatibilidades)
1. ✅ **JSONB** ao invés de JSON
2. ✅ Remover **ON UPDATE CURRENT_TIMESTAMP**
3. ✅ Trocar **COMMENT** inline por **COMMENT ON**
4. ✅ Trocar **CURRENT_TIMESTAMP** por **NOW()**

### Otimizações Futuras (Opcionais)
1. 🔮 Criar índice GIN em `tb_shipping_payloads.raw_payload`
2. 🔮 Implementar Full Text Search em livros
3. 🔮 Considerar tipo UUID nativo (migração futura)
4. 🔮 Usar window functions para rankings/paginação
5. 🔮 Implementar CTEs recursivas (se precisar de hierarquias)

### Mantém Igual (Boas Práticas)
- ✅ UUIDs como VARCHAR(36) (funciona bem)
- ✅ DECIMAL para valores monetários
- ✅ VARCHAR ao invés de CHAR
- ✅ Constraints FOREIGN KEY com CASCADE
- ✅ Índices em colunas de busca frequente

---

## 🧪 TESTES DE COMPATIBILIDADE

### Hibernate/JPA
| Feature | Compatibilidade | Observação |
|---------|----------------|------------|
| @Entity | ✅ 100% | Funciona igual |
| @Column | ✅ 100% | Funciona igual |
| @JoinColumn | ✅ 100% | Funciona igual |
| @Enumerated | ✅ 100% | Funciona igual |
| @PrePersist | ✅ 100% | Funciona igual |
| @PreUpdate | ✅ 100% | Substitui ON UPDATE |
| columnDefinition="JSON" | ⚠️ Trocar | Usar JSONB |

### Spring Data JPA
| Feature | Compatibilidade |
|---------|----------------|
| JpaRepository | ✅ 100% |
| Query methods | ✅ 100% |
| @Query JPQL | ✅ 100% |
| @Query native SQL | ⚠️ Verificar sintaxe |
| Paginação | ✅ 100% |
| Specifications | ✅ 100% |

---

## 📈 VANTAGENS DA MIGRAÇÃO

### Performance
- ⚡ Melhor em queries complexas com JOINs
- ⚡ JSONB mais rápido que JSON
- ⚡ Índices GIN para JSON/arrays
- ⚡ Melhor otimizador de queries

### Features
- 🎯 Full Text Search nativo
- 🎯 Window Functions completas
- 🎯 CTEs recursivas
- 🎯 Array types
- 🎯 Melhores tipos de dados (UUID, JSONB, etc.)

### Confiabilidade
- 🔒 ACID mais rigoroso
- 🔒 Melhor isolamento de transações
- 🔒 Menos problemas de lock

### Custo
- 💰 100% Open Source (licença MIT)
- 💰 Sem cusas comerciais (como MySQL Enterprise)
- 💰 Comunidade muito ativa

---

## ⚠️ DESVANTAGENS/CUIDADOS

### Mudanças Necessárias
- ⚠️ 7 migrations SQL precisam ajustes
- ⚠️ Sintaxe COMMENT diferente
- ⚠️ Não tem ON UPDATE CURRENT_TIMESTAMP

### Aprendizado
- 📚 Precisa aprender sintaxe PostgreSQL
- 📚 Ferramentas de admin diferentes (pgAdmin vs MySQL Workbench)
- 📚 Comandos psql diferentes de mysql

### Performance
- 🐢 Pode ser mais lento em workloads de escrita intensiva
- 🐢 Consome mais memória (MVCC)

---

## ✅ CONCLUSÃO

### Para o projeto Livraria Tunoda:
- ✅ **Vale a pena migrar?** SIM
- ✅ **É difícil?** NÃO (baixa complexidade)
- ✅ **Vai quebrar algo?** NÃO (se seguir o guia)
- ✅ **Tempo necessário?** 5-8 horas
- ✅ **Benefícios?** Muitos (performance, features, open source)

### Principais Ganhos:
1. JSONB para payloads de frete/pagamento
2. Melhor performance em queries complexas
3. Full Text Search nativo (futuro)
4. Licença mais permissiva
5. Comunidade e suporte

### Riscos:
- ❌ **Baixo:** Arquitetura bem desacoplada
- ❌ **Mitigado:** Guia completo de migração
- ❌ **Testável:** Fácil testar antes de deploy

---

**Recomendação Final: MIGRAR PARA POSTGRESQL ✅**


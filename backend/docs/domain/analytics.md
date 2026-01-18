# Domínio de Analytics

Contexto delimitado responsável por rastrear eventos de interação do usuário com livros.

## Visão Geral

**Responsabilidade:** Rastrear eventos de interação (visualizações, cliques)

**Aggregate Roots:** `BookMetric`

**Propósito:** Observabilidade e análise de comportamento do usuário

## Aggregate Root

### BookMetric

Aggregate Root que representa um evento de interação do usuário com um livro.

#### Atributos

- `id: BookMetricId` - Identificador único da métrica
- `bookId: BookId` - Referência ao livro
- `eventType: EventType` - Tipo de evento (VIEW, CLICK)
- `timestamp: LocalDateTime` - Data/hora do evento

#### Regras de Negócio

- Cada interação gera um novo registro
- Eventos são imutáveis (não podem ser alterados)
- bookId deve referenciar livro existente
- timestamp é gerado automaticamente

#### Métodos

**Criação:**
- `BookMetric.record(bookId, eventType)` - Registra novo evento

## Value Objects

### EventType

Enum que representa o tipo de evento de interação.

#### Valores

- `VIEW` - Usuário visualizou detalhes do livro
- `CLICK` - Usuário clicou no livro

## Casos de Uso

### RecordBookMetricUseCase

Registra evento de interação do usuário.

**Input:**
- `bookId: String`
- `eventType: String` (VIEW ou CLICK)

**Output:**
- Void (evento registrado com sucesso)

**Fluxo:**
1. Validar se bookId existe
2. Criar BookMetric com timestamp atual
3. Persistir no repositório

## Consultas

### Top Livros Mais Visualizados

Retorna livros com mais eventos do tipo VIEW.

**Endpoint:** `GET /api/public/books/most-viewed`

**Query:**
```sql
SELECT book_id, COUNT(*) as views
FROM tb_book_metrics
WHERE event_type = 'VIEW'
GROUP BY book_id
ORDER BY views DESC
LIMIT 10
```

### Top Livros Mais Clicados

Retorna livros com mais eventos do tipo CLICK.

**Endpoint:** `GET /api/public/books/most-clicked`

**Query:**
```sql
SELECT book_id, COUNT(*) as clicks
FROM tb_book_metrics
WHERE event_type = 'CLICK'
GROUP BY book_id
ORDER BY clicks DESC
LIMIT 10
```

## Persistência

### Entidade JPA

- `BookMetricEntity` - Representação JPA do BookMetric

### Repository

- `BookMetricRepository` - Interface no domínio
- `BookMetricRepositoryAdapter` - Implementação na infraestrutura

### Tabela

```sql
CREATE TABLE tb_book_metrics (
    id UUID PRIMARY KEY,
    book_id UUID NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP NOT NULL
);

CREATE INDEX idx_book_metrics_book_id ON tb_book_metrics(book_id);
CREATE INDEX idx_book_metrics_event_type ON tb_book_metrics(event_type);
```

## API Endpoints

### Públicos

- `POST /api/public/books/{id}/metrics` - Registrar evento
- `GET /api/public/books/most-viewed` - Top mais visualizados
- `GET /api/public/books/most-clicked` - Top mais clicados

### Administrativos

- `GET /api/admin/books/{id}/metrics` - Ver métricas de um livro específico

## Características

### Imutabilidade

Eventos de métricas são imutáveis. Uma vez criados, não podem ser alterados ou excluídos.

### Performance

Índices criados em `book_id` e `event_type` para consultas rápidas.

### Escalabilidade

Pronto para migrar para soluções de analytics dedicadas:
- Google Analytics
- Elasticsearch
- Apache Kafka + Data Lake

## Casos de Uso Futuros

- Métricas por período (dia, semana, mês)
- Análise de funil de conversão
- Recomendações baseadas em comportamento
- A/B Testing
- Heatmaps de navegação

## Integrações

### Com Catálogo

BookMetric referencia Book via `bookId`. Não há dependência direta.

### Com Recomendações (Futuro)

Métricas podem alimentar sistema de recomendações.

## Referências

- [Modelo de Domínio](../architecture/domain-model.md)
- [Catálogo](catalog.md)
- [API Endpoints](../api/endpoints.md)

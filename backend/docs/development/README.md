# Development

Guias para desenvolvedores contribuírem com o projeto.

## Documentos

### [Como Contribuir](contributing.md)
Processo para contribuir com código.

### [Convenções de Código](coding-conventions.md)
Padrões de código e boas práticas.

### [Testes](testing.md)
Estratégia e guia de testes.

### [Ferramentas](tools.md)
IDEs e ferramentas recomendadas.

## Quick Start

```bash
# 1. Clone
git clone <repo>
cd backend

# 2. Configure
export JWT_SECRET="..."
export MELHOR_ENVIO_TOKEN="..."
export MERCADO_PAGO_ACCESS_TOKEN="..."

# 3. Rode banco
docker-compose up -d

# 4. Execute
./mvnw spring-boot:run

# 5. Teste
./mvnw test
```

## Stack

- Java 25
- Spring Boot 3.5.9
- PostgreSQL 17
- Maven
- Docker

## Estrutura

```
src/
├── main/java/br/com/iraquitantunoda/livrariatunoda/
│   ├── domain/          # Regras de negócio
│   ├── application/     # Casos de uso
│   └── infrastructure/  # Adaptadores
└── test/java/
    └── ...              # Testes
```

## Princípios

- Clean Architecture
- Domain-Driven Design
- SOLID
- Clean Code
- TDD (recomendado)

## Referências

- [Arquitetura](../architecture/clean-architecture.md)
- [Domínios](../domain/README.md)

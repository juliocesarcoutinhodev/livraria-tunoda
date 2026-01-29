# Livraria Tunoda - Sistema de E-commerce

[![Java](https://img.shields.io/badge/Java-25-orange?logo=java)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.9-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)](https://www.postgresql.org/)

Sistema completo de e-commerce para venda de livros cristãos do Pastor Iraquitan Tunoda, desenvolvido como monorepositório com backend em Spring Boot e frontend em Next.js.

## 📋 Visão Geral

Este monorepositório contém dois projetos independentes mas integrados:

- **Backend** - API REST construída com Clean Architecture e Domain-Driven Design
- **Frontend** - Aplicação web construída com Next.js 16 (App Router) e Tailwind CSS

### Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  Next.js 16 | React 19 | Tailwind CSS | React Query         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Pages: Home | Catálogo | Detalhes | Carrinho |    │    │
│  │         Checkout | Admin Dashboard                 │    │
│  │                                                     │    │
│  │  State: Zustand (Auth, Cart, UI)                   │    │
│  │  Data Fetching: TanStack Query                     │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST (JSON)
                            │ JWT Authentication
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│  Spring Boot 3.5.9 | Java 25 | PostgreSQL 17               │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Clean Architecture + DDD                          │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │ Domain Layer (Aggregates, Value Objects) │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │ Application Layer (Use Cases, DTOs)      │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │ Infrastructure (JPA, Security, REST)     │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    ▼               ▼
            ┌──────────────┐  ┌──────────────┐
            │ Melhor Envio │  │ Mercado Pago │
            │   (Frete)    │  │ (Pagamento)  │
            └──────────────┘  └──────────────┘
```

## 🏗️ Estrutura do Monorepositório

```
livraria-tunoda/
├── backend/              # API REST (Spring Boot + PostgreSQL)
│   ├── src/
│   │   ├── main/java/.../livrariatunoda/
│   │   │   ├── domain/           # Camada de Domínio (DDD)
│   │   │   │   ├── model/        # Aggregate Roots (Book, Author)
│   │   │   │   ├── cart/         # Contexto: Carrinho
│   │   │   │   ├── order/        # Contexto: Pedidos
│   │   │   │   ├── payment/      # Contexto: Pagamentos
│   │   │   │   ├── shipping/     # Contexto: Frete
│   │   │   │   ├── user/         # Contexto: Usuários
│   │   │   │   └── repository/   # Interfaces (Ports)
│   │   │   ├── application/      # Use Cases, DTOs, Mappers
│   │   │   └── infrastructure/   # Adapters, JPA, REST, Security
│   │   └── test/
│   ├── docs/                     # Documentação completa
│   ├── docker-compose.yml
│   └── pom.xml
│
├── frontend/             # Aplicação Web (Next.js + Tailwind)
│   ├── src/
│   │   ├── app/                  # App Router (Next.js 16)
│   │   │   ├── page.tsx          # Home
│   │   │   ├── livros/           # Catálogo e Detalhes
│   │   │   ├── carrinho/         # Carrinho
│   │   │   ├── checkout/         # Checkout
│   │   │   └── admin/            # Dashboard Admin
│   │   ├── components/           # Componentes React
│   │   ├── hooks/                # Custom Hooks (React Query)
│   │   ├── store/                # Zustand Stores
│   │   ├── services/             # API Services (Axios)
│   │   ├── lib/                  # Utils e Configurações
│   │   └── types/                # TypeScript Types
│   ├── docs/                     # Documentação específica
│   └── package.json
│
└── README.md                     # Este arquivo
```

## 🚀 Tecnologias Principais

### Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Java | 25 (LTS) | Linguagem principal |
| Spring Boot | 3.5.9 | Framework web e DI |
| PostgreSQL | 17 | Banco de dados |
| Flyway | Latest | Migrations |
| JWT | Latest | Autenticação |
| MapStruct | 1.6.3 | Mapeamento DTO ↔ Entity |
| Lombok | Latest | Redução de boilerplate |
| Docker | Latest | Containerização |

**Integrações Externas:**
- **Melhor Envio** - Cálculo de frete
- **Mercado Pago** - Processamento de pagamentos

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Next.js | 16 | Framework React (App Router) |
| React | 19 | Biblioteca UI |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 4 | Estilização |
| TanStack Query | 5.90 | Data fetching e cache |
| Zustand | 5 | Gerenciamento de estado |
| Axios | 1.13 | Cliente HTTP |
| React Hot Toast | 2.6 | Notificações |

## ⚡ Quick Start

### Pré-requisitos

- **Backend:** Java 25, Maven 3.9+, Docker (para PostgreSQL)
- **Frontend:** Node.js 20+, npm/yarn/pnpm
- **Ambiente:** Git, VS Code (recomendado)

### 1. Backend (Spring Boot)

```bash
cd backend

# Configure variáveis de ambiente
export JWT_SECRET="your-256-bit-secret"
export MELHOR_ENVIO_TOKEN="your-token"
export MERCADO_PAGO_ACCESS_TOKEN="your-token"

# Suba o PostgreSQL
docker-compose up -d

# Execute a aplicação
./mvnw spring-boot:run
```

**API disponível em:** `http://localhost:8080`  
**Health Check:** `http://localhost:8080/api/v1/actuator/health`

### 2. Frontend (Next.js)

```bash
cd frontend

# Instale dependências
npm install

# Configure variável de ambiente (opcional)
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local

# Execute em modo desenvolvimento
npm run dev
```

**Aplicação disponível em:** `http://localhost:3000`

## 📚 Documentação Completa

### Backend

A documentação completa do backend está em [`/backend/docs`](./backend/docs/):

- **[Getting Started](./backend/docs/getting-started/)** - Setup e configuração inicial
- **[Arquitetura](./backend/docs/architecture/)** - Clean Architecture e DDD
- **[Domínios](./backend/docs/domain/)** - Bounded Contexts (Catálogo, Carrinho, Pedidos, etc.)
- **[API](./backend/docs/api/)** - Endpoints REST e collections Postman
- **[Segurança](./backend/docs/security/)** - JWT, autenticação e autorização
- **[Deployment](./backend/docs/deployment/)** - Docker, produção e troubleshooting
- **[Banco de Dados](./backend/docs/database/)** - Schema, migrations e PostgreSQL

**Índice completo:** [`/backend/docs/INDEX.md`](./backend/docs/INDEX.md)

### Frontend

A documentação completa do frontend está em [`/frontend`](./frontend/):

- **[README Principal](./frontend/README.md)** - Visão geral e funcionalidades
- **[Zustand Stores](./frontend/docs/ZUSTAND_STORES.md)** - Gerenciamento de estado
- **[Query Keys](./frontend/docs/QUERY_KEYS.md)** - React Query configuration

## 🔄 Fluxo de Integração

### Autenticação

1. Frontend envia credenciais para `POST /api/v1/auth/login`
2. Backend valida e retorna `accessToken` + `refreshToken` (JWT)
3. Frontend armazena tokens (Zustand + localStorage)
4. Todas as requisições incluem `Authorization: Bearer {accessToken}`
5. Refresh automático quando token expira

### Carrinho de Compras

1. **Criação:** Frontend gera `cartId` UUID ao adicionar primeiro item
2. **Sincronização:** Cada operação (add/update/remove) chama backend
3. **Persistência:** Backend mantém carrinho em PostgreSQL
4. **Snapshot:** Frontend mantém cópia local para UI otimista
5. **Validação:** Estoque validado no checkout

### Checkout e Pagamento

1. **Identificação:** Captura email/telefone
2. **Endereço:** CEP lookup + formulário de entrega
3. **Frete:** Cálculo via Melhor Envio com opções PAC/SEDEX
4. **Revisão:** Confirmação de itens + totais
5. **Pagamento:** Criação de preferência no Mercado Pago
6. **Webhook:** Backend recebe notificação e atualiza status do pedido

## 🔐 Segurança

- **Autenticação:** JWT com access token (15min) e refresh token (7 dias)
- **Autorização:** Role-based (ADMIN)
- **CORS:** Configurado para frontend em `http://localhost:3000`
- **SQL Injection:** Prevenido via JPA/Hibernate
- **XSS:** Sanitização automática do React
- **CSRF:** Proteção via tokens JWT stateless

## 📊 Contextos de Domínio (DDD)

O backend está organizado em **bounded contexts** independentes:

| Contexto | Aggregate Roots | Responsabilidade |
|----------|-----------------|------------------|
| **Catálogo** | `Book`, `Author` | Gerenciar livros e autores |
| **Analytics** | `BookMetric` | Rastrear visualizações e cliques |
| **Carrinho** | `Cart` | Gerenciar itens pré-checkout |
| **Pedidos** | `Order` | Processar pedidos finalizados |
| **Frete** | `ShippingQuote` | Calcular opções de frete |
| **Pagamentos** | `Payment` | Processar transações |
| **Usuários** | `User` | Autenticação e autorização |

## 🧪 Testes

### Backend
```bash
cd backend
./mvnw test                    # Testes unitários
./mvnw verify                  # Testes de integração
```

### Frontend
```bash
cd frontend
npm run test                   # Testes (quando disponíveis)
npm run type-check            # Verificação TypeScript
npm run lint                  # ESLint
```

## 📦 Build para Produção

### Backend
```bash
cd backend
./mvnw clean package
docker build -t livraria-tunoda-backend .
```

### Frontend
```bash
cd frontend
npm run build
npm start                     # Servidor de produção
```

## 🤝 Contribuindo

1. Leia as documentações específicas de cada projeto
2. Siga os padrões estabelecidos (Clean Code, SOLID, DDD)
3. **Backend:** Código em inglês, mensagens de API em português
4. **Frontend:** TypeScript strict mode, componentes funcionais
5. Commits semânticos: `feat:`, `fix:`, `docs:`, `refactor:`

## 📄 Licença

Este projeto é proprietário e de uso interno.

---

**Desenvolvido para o Pastor Iraquitan Tunoda** | [Instagram](https://www.instagram.com/iraquitantunoda/)

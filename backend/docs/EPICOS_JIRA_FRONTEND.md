# Épicos e User Stories - Frontend Livraria Tunoda

> **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS, React Query, Zustand  
> **Backend**: Spring Boot com Clean Architecture + DDD  
> **Data**: 18/01/2026

---

## 📋 Estrutura dos Épicos

1. **EPIC-01**: Configuração e Arquitetura do Frontend
2. **EPIC-02**: Autenticação e Autorização
3. **EPIC-03**: Painel Administrativo - Gestão de Autores
4. **EPIC-04**: Painel Administrativo - Gestão de Livros
5. **EPIC-05**: Catálogo Público e E-commerce
6. **EPIC-06**: Carrinho e Checkout
7. **EPIC-07**: Integração de Pagamentos

---

## EPIC-01: Configuração e Arquitetura do Frontend

**Objetivo**: Estruturar o projeto Next.js com arquitetura sólida, camadas bem definidas e integração com o backend Spring Boot.

**Valor de Negócio**: Base técnica robusta que permite escalabilidade e manutenibilidade.

**Prioridade**: 🔴 CRÍTICA (Bloqueante para todos os outros épicos)

---

### US-01.1: Configurar Projeto Next.js com TypeScript

**Como** desenvolvedor  
**Quero** um projeto Next.js 16 configurado com TypeScript e Tailwind CSS  
**Para** ter uma base moderna e tipada segura

#### Critérios de Aceite
- [ ] Next.js 16 instalado com App Router habilitado
- [ ] TypeScript configurado com `strict: true`
- [ ] Tailwind CSS instalado e configurado
- [ ] ESLint + Prettier configurados
- [ ] Estrutura de pastas seguindo padrão enterprise:
  ```
  src/
  ├── app/              # App Router (páginas)
  ├── components/       # Componentes reutilizáveis
  │   ├── ui/          # Componentes UI genéricos
  │   ├── layout/      # Layouts (header, footer, sidebar)
  │   └── features/    # Componentes específicos de domínio
  ├── services/         # Integração com APIs
  ├── hooks/            # Custom React Hooks
  ├── lib/              # Utilitários e configurações
  ├── types/            # TypeScript interfaces/types
  ├── store/            # Estado global (Zustand)
  └── constants/        # Constantes da aplicação
  ```
- [ ] `.env.local.example` criado com variáveis necessárias

#### Definition of Done (DoD)
- [ ] Build produção executando sem erros
- [ ] Nenhum erro TypeScript
- [ ] ESLint sem warnings críticos
- [ ] README.md atualizado com instruções de setup

**Estimativa**: 3 pontos (4h)  
**Labels**: `setup`, `architecture`, `typescript`

---

### US-01.2: Criar Camada de Services para APIs

**Como** desenvolvedor  
**Quero** uma camada de services bem estruturada  
**Para** centralizar a comunicação com o backend Spring Boot

#### Critérios de Aceite
- [ ] Axios configurado com interceptors
- [ ] Instância base do Axios com `baseURL` do backend
- [ ] Interceptor para adicionar JWT automaticamente
- [ ] Interceptor para tratamento de erros global
- [ ] Services criados:
  - `authService.ts` → `/api/auth/**`
  - `authorService.ts` → `/api/admin/authors/**`
  - `bookService.ts` → `/api/admin/books/**` e `/api/public/books/**`
  - `cartService.ts` → `/api/carts/**`
  - `orderService.ts` → `/api/orders/**`
- [ ] Tipagem TypeScript espelhando DTOs do backend
- [ ] Tratamento de refresh token automático

#### Exemplo de Código (authService.ts)
```typescript
import { apiClient } from '@/lib/api-client';
import type { LoginRequest, AuthenticationResponse } from '@/types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthenticationResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  
  refresh: async (refreshToken: string): Promise<AuthenticationResponse> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/user/me');
    return response.data;
  }
};
```

#### DoD
- [ ] Todas as services com tipagem completa
- [ ] Testes unitários das funções de service (cobertura >80%)
- [ ] Documentação JSDoc em cada service
- [ ] Variáveis de ambiente configuradas (`.env.local`)

**Estimativa**: 5 pontos (8h)  
**Labels**: `architecture`, `api`, `typescript`

---

### US-01.3: Configurar React Query para Cache de Dados

**Como** desenvolvedor  
**Quero** React Query configurado  
**Para** gerenciar cache de dados do backend eficientemente

#### Critérios de Aceite
- [ ] @tanstack/react-query instalado
- [ ] QueryClient configurado no `app/layout.tsx`
- [ ] Devtools do React Query habilitadas (apenas dev)
- [ ] Custom hooks criados:
  - `useBooks()` - Lista de livros
  - `useBookDetail(id)` - Detalhes de um livro
  - `useAuthors()` - Lista de autores
  - `useAuth()` - Estado de autenticação
- [ ] Configuração de stale time e cache time
- [ ] Otimistic updates configurados para mutations

#### Exemplo de Hook
```typescript
export function useBooks(filters?: BookFilters) {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => bookService.getPublicBooks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookService.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });
}
```

#### DoD
- [ ] Query keys bem definidas e documentadas
- [ ] Invalidação de cache funcionando
- [ ] Loading e error states tratados
- [ ] Prefetch configurado onde necessário

**Estimativa**: 5 pontos (8h)  
**Labels**: `architecture`, `react-query`, `performance`

---

### US-01.4: Configurar Zustand para Estado Global

**Como** desenvolvedor  
**Quero** Zustand configurado para estado UI  
**Para** gerenciar modais, sidebar, notificações e estado não-persistido

#### Critérios de Aceite
- [ ] Zustand instalado
- [ ] Stores criados:
  - `useAuthStore` - JWT, user info, isAuthenticated
  - `useCartStore` - Carrinho temporário (antes de sincronizar)
  - `useUIStore` - Sidebar aberta, modals, notifications
- [ ] Persistência no localStorage para authStore
- [ ] Middleware de logging (apenas dev)
- [ ] Devtools do Zustand configuradas

#### Exemplo de Store
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: CurrentUserResponse | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: CurrentUserResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

#### DoD
- [ ] Stores testadas unitariamente
- [ ] Persistência funcionando
- [ ] Sem re-renders desnecessários (uso de selectors)
- [ ] Documentação de cada store

**Estimativa**: 3 pontos (5h)  
**Labels**: `architecture`, `state-management`

---

### US-01.5: Criar TypeScript Interfaces Espelhando Backend

**Como** desenvolvedor  
**Quero** tipos TypeScript que espelham os DTOs do backend  
**Para** ter type-safety completo na integração

#### Critérios de Aceite
- [ ] Arquivo `src/types/models.ts` criado
- [ ] Interfaces criadas:
  ```typescript
  // Author
  interface Author {
    id: string;
    name: string;
    biography: string;
    photoUrl: string | null;
    status: 'ACTIVE' | 'INACTIVE';
  }
  
  // Book
  interface Book {
    id: string;
    title: string;
    description: string;
    photoUrl: string | null;
    isbn: string | null;
    price: number;
    currency: string;
    weight: number;
    weightUnit: 'KG' | 'G';
    stock: number;
    status: 'ACTIVE' | 'INACTIVE';
    authors: AuthorSummary[];
  }
  
  // Request DTOs
  interface CreateAuthorRequest {
    name: string;
    biography: string;
    photoUrl?: string;
  }
  
  interface CreateBookRequest {
    title: string;
    description: string;
    photoUrl?: string;
    isbn?: string;
    price: number;
    currency?: string;
    weight: number;
    weightUnit: string;
    authorIds: string[];
  }
  ```
- [ ] Tipos de resposta de API (com paginação)
- [ ] Enums criados para Status, Role, EventType, etc.

#### DoD
- [ ] Todos os DTOs do backend espelhados
- [ ] Nenhum `any` no código
- [ ] Comentários JSDoc explicando cada tipo
- [ ] Tipos exportados e reutilizados em services

**Estimativa**: 3 pontos (4h)  
**Labels**: `typescript`, `types`, `documentation`

---

## EPIC-02: Autenticação e Autorização

**Objetivo**: Implementar fluxo completo de autenticação JWT, login, logout e proteção de rotas.

**Valor de Negócio**: Segurança da aplicação e controle de acesso ao painel admin.

**Prioridade**: 🔴 CRÍTICA (Bloqueante para painel admin)

---

### US-02.1: Criar Página de Login

**Como** administrador  
**Quero** fazer login com email e senha  
**Para** acessar o painel administrativo

#### Critérios de Aceite
- [ ] Página `/login` criada
- [ ] Formulário com validação:
  - Email obrigatório e formato válido
  - Senha obrigatória (min 8 caracteres)
- [ ] Botão "Entrar" com loading state
- [ ] Integração com `POST /api/auth/login`
- [ ] Armazenamento do token no Zustand + localStorage
- [ ] Redirect para `/admin/dashboard` após login
- [ ] Mensagens de erro amigáveis:
  - "Credenciais inválidas"
  - "Usuário inativo"
  - Erros de rede
- [ ] Design consistente com identidade visual (paleta cristã)

#### Validações de Segurança
- [ ] Senha não visível por padrão (input type password)
- [ ] Botão de toggle para mostrar/ocultar senha
- [ ] Rate limiting no frontend (máx 5 tentativas/min)
- [ ] HTTPS obrigatório em produção

#### DoD
- [ ] Login funcional com admin padrão (admin@livraria.com / admin123)
- [ ] Testes E2E do fluxo de login
- [ ] Responsivo (mobile-first)
- [ ] Acessibilidade (A11y) validada

**Estimativa**: 5 pontos (8h)  
**Labels**: `authentication`, `frontend`, `security`

---

### US-02.2: Implementar Proteção de Rotas (Route Guards)

**Como** desenvolvedor  
**Quero** proteger rotas administrativas  
**Para** impedir acesso não autorizado

#### Critérios de Aceite
- [ ] Middleware criado `src/middleware.ts`
- [ ] Rotas protegidas:
  - `/admin/**` → Requer ROLE_ADMIN
  - `/checkout` → Requer autenticação (futuro)
- [ ] Redirect para `/login` se não autenticado
- [ ] Query param `?redirect=/admin/books` para retornar após login
- [ ] Validação de token JWT expirado
- [ ] Refresh token automático se expirado mas válido

#### Exemplo de Middleware
```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
    
    try {
      const decoded = verifyJWT(token);
      if (decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/403', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}
```

#### DoD
- [ ] Tentativa de acesso direto a `/admin` redireciona
- [ ] Refresh token funcionando automaticamente
- [ ] Testes unitários do middleware
- [ ] Página 403 (Acesso Negado) criada

**Estimativa**: 5 pontos (8h)  
**Labels**: `authentication`, `security`, `middleware`

---

### US-02.3: Implementar Logout e Gestão de Sessão

**Como** administrador  
**Quero** fazer logout com segurança  
**Para** encerrar minha sessão

#### Critérios de Aceite
- [ ] Botão "Sair" no header admin
- [ ] Confirmação via modal antes de logout
- [ ] Limpeza completa:
  - Token removido do store
  - localStorage limpo
  - Cookies limpos
  - Cache do React Query invalidado
- [ ] Redirect para `/login` após logout
- [ ] Revogação do refresh token no backend (chamada a API)
- [ ] Auto-logout após 1h de inatividade

#### DoD
- [ ] Logout funcional
- [ ] Sessão expirada mostra modal amigável
- [ ] Nenhum dado sensível permanece no navegador
- [ ] Testes E2E do fluxo de logout

**Estimativa**: 3 pontos (5h)  
**Labels**: `authentication`, `security`

---

## EPIC-03: Painel Administrativo - Gestão de Autores

**Objetivo**: CRUD completo de autores no painel admin.

**Valor de Negócio**: Permitir cadastro e gestão dos autores dos livros (ex: Pastor Iraquitan Tunoda).

**Prioridade**: 🔴 ALTA (Necessário antes de cadastrar livros)

---

### US-03.1: Criar Página de Listagem de Autores

**Como** administrador  
**Quero** visualizar todos os autores cadastrados  
**Para** gerenciar o catálogo

#### Critérios de Aceite
- [ ] Página `/admin/authors` criada
- [ ] Tabela responsiva com colunas:
  - Foto (thumbnail)
  - Nome
  - Status (badge: ATIVO/INATIVO)
  - Ações (Editar, Ativar/Desativar)
- [ ] Integração com `GET /api/admin/authors`
- [ ] Loading skeleton durante carregamento
- [ ] Estado vazio (nenhum autor cadastrado) com CTA "Adicionar Autor"
- [ ] Busca por nome (client-side)
- [ ] Filtro por status (Todos, Ativos, Inativos)
- [ ] Ordenação por nome (asc/desc)
- [ ] Botão "Novo Autor" no topo

#### Design
- [ ] Sidebar de navegação admin à esquerda
- [ ] Header com breadcrumb: "Dashboard > Autores"
- [ ] Cards no mobile, tabela no desktop

#### DoD
- [ ] Listagem funcional
- [ ] Responsiva em todos os breakpoints
- [ ] Performance: paginação se >50 autores
- [ ] Testes E2E da listagem

**Estimativa**: 5 pontos (8h)  
**Labels**: `admin`, `authors`, `crud`, `frontend`

---

### US-03.2: Criar Formulário de Cadastro de Autor

**Como** administrador  
**Quero** cadastrar um novo autor  
**Para** associá-lo aos livros

#### Critérios de Aceite
- [ ] Modal ou página `/admin/authors/new`
- [ ] Formulário com validação:
  - **Nome** (obrigatório, máx 200 caracteres)
  - **Biografia** (obrigatório, textarea)
  - **URL da Foto** (opcional, validação de URL)
- [ ] Preview da foto quando URL informada
- [ ] Integração com `POST /api/admin/authors`
- [ ] Mensagens de sucesso/erro:
  - "Autor criado com sucesso!"
  - Exibir erros de validação do backend
- [ ] Loading no botão "Salvar"
- [ ] Botão "Cancelar" volta para listagem

#### Validações Frontend
- [ ] Nome: required, maxLength 200
- [ ] Biografia: required, minLength 20
- [ ] URL: regex de URL válida (se preenchida)

#### DoD
- [ ] Autor criado aparece imediatamente na listagem (invalidação cache)
- [ ] Formulário limpa após sucesso
- [ ] Acessibilidade (labels, aria-labels)
- [ ] Testes unitários do formulário

**Estimativa**: 5 pontos (8h)  
**Labels**: `admin`, `authors`, `crud`, `forms`

---

### US-03.3: Criar Formulário de Edição de Autor

**Como** administrador  
**Quero** editar dados de um autor  
**Para** corrigir informações ou atualizar biografia

#### Critérios de Aceite
- [ ] Página ou modal `/admin/authors/[id]/edit`
- [ ] Formulário pré-preenchido com dados do autor
- [ ] Integração com `PUT /api/admin/authors/{id}`
- [ ] Mesmas validações do cadastro
- [ ] Botão "Salvar Alterações"
- [ ] Confirmação antes de salvar alterações críticas
- [ ] Atualização otimista (UI atualiza antes da resposta)

#### DoD
- [ ] Edição funcional
- [ ] Cache invalidado após sucesso
- [ ] Histórico de navegação funcional (botão voltar)
- [ ] Testes E2E de edição

**Estimativa**: 5 pontos (8h)  
**Labels**: `admin`, `authors`, `crud`, `forms`

---

### US-03.4: Implementar Ativação/Desativação de Autor

**Como** administrador  
**Quero** ativar ou desativar um autor  
**Para** remover temporariamente sem deletar

#### Critérios de Aceite
- [ ] Toggle ou botão na listagem
- [ ] Confirmação via modal:
  - "Desativar autor X? Ele não aparecerá mais no catálogo público."
- [ ] Integração com `PATCH /api/admin/authors/{id}/status`
- [ ] Badge de status atualiza imediatamente
- [ ] Autores inativos aparecem esmaecidos na tabela
- [ ] Filtro de status funcional

#### Regras de Negócio
- [ ] Não permitir desativar autor se houver livros ativos vinculados (validar com backend)
- [ ] Mensagem de erro explicativa se houver bloqueio

#### DoD
- [ ] Status altera corretamente
- [ ] Atualização otimista
- [ ] Testes E2E de ativação/desativação

**Estimativa**: 3 pontos (5h)  
**Labels**: `admin`, `authors`, `crud`

---

## EPIC-04: Painel Administrativo - Gestão de Livros

**Objetivo**: CRUD completo de livros no painel admin com vinculação de autores.

**Valor de Negócio**: Gerenciar o catálogo de produtos da loja.

**Prioridade**: 🔴 ALTA

---

### US-04.1: Criar Página de Listagem de Livros

**Como** administrador  
**Quero** visualizar todos os livros cadastrados  
**Para** gerenciar o catálogo

#### Critérios de Aceite
- [ ] Página `/admin/books` criada
- [ ] Tabela/Grid responsivo com:
  - Imagem da capa (thumbnail)
  - Título
  - Autor(es) (lista)
  - Preço (formatado R$)
  - Estoque (badge: estoque baixo <5 em vermelho)
  - Status (ATIVO/INATIVO)
  - Ações (Editar, Ver Métricas, Ativar/Desativar)
- [ ] Integração com `GET /api/admin/books` (paginado)
- [ ] Paginação funcional (10, 25, 50 itens/página)
- [ ] Busca por título (debounced)
- [ ] Filtros:
  - Por status (Todos, Ativos, Inativos)
  - Por autor (dropdown com autores ativos)
  - Estoque baixo (<5)
- [ ] Ordenação por: Título, Preço, Data de criação
- [ ] Botão "Novo Livro" no topo

#### Design
- [ ] Cards no mobile com imagem destacada
- [ ] Tabela compacta no desktop
- [ ] Loading skeleton

#### DoD
- [ ] Listagem funcional com paginação
- [ ] Performance otimizada (virtualização se >100 itens)
- [ ] Filtros funcionando
- [ ] Responsiva

**Estimativa**: 8 pontos (13h)  
**Labels**: `admin`, `books`, `crud`, `frontend`

---

### US-04.2: Criar Formulário de Cadastro de Livro

**Como** administrador  
**Quero** cadastrar um novo livro  
**Para** disponibilizá-lo na loja

#### Critérios de Aceite
- [ ] Página `/admin/books/new`
- [ ] Formulário multi-step ou abas:
  
  **Informações Básicas**
  - Título (obrigatório, máx 300 caracteres)
  - Descrição (obrigatório, textarea)
  - URL da Foto da Capa (opcional)
  - ISBN (opcional, validação de formato)
  
  **Preço e Estoque**
  - Preço (obrigatório, número > 0, formatação R$)
  - Moeda (default: BRL)
  - Estoque inicial (obrigatório, número >= 0)
  
  **Dimensões**
  - Peso (obrigatório, número > 0)
  - Unidade (dropdown: KG, G)
  
  **Autores**
  - Seleção múltipla de autores (mínimo 1)
  - Autocomplete/Multiselect com busca
  - Preview dos autores selecionados

- [ ] Preview do livro no lado direito (como aparecerá no catálogo)
- [ ] Validação em tempo real
- [ ] Integração com `POST /api/admin/books`
- [ ] Upload de imagem (opcional - v2.0)

#### Validações Frontend
- [ ] Título: required, maxLength 300
- [ ] Descrição: required, minLength 50
- [ ] Preço: required, positive, format currency
- [ ] Peso: required, positive
- [ ] AutorIds: required, minLength 1

#### DoD
- [ ] Livro criado aparece na listagem
- [ ] Validações do backend tratadas
- [ ] Formulário responsivo
- [ ] Testes E2E de cadastro

**Estimativa**: 13 pontos (21h)  
**Labels**: `admin`, `books`, `crud`, `forms`, `complex`

---

### US-04.3: Criar Formulário de Edição de Livro

**Como** administrador  
**Quero** editar informações de um livro  
**Para** corrigir dados ou atualizar preço/estoque

#### Critérios de Aceite
- [ ] Página `/admin/books/[id]/edit`
- [ ] Formulário idêntico ao de cadastro, pré-preenchido
- [ ] Integração com `PUT /api/admin/books/{id}`
- [ ] Mesmas validações
- [ ] Histórico de alterações (opcional - v2.0)
- [ ] Atualização otimista

#### DoD
- [ ] Edição funcional
- [ ] Cache invalidado
- [ ] Testes E2E

**Estimativa**: 8 pontos (13h)  
**Labels**: `admin`, `books`, `crud`, `forms`

---

### US-04.4: Implementar Gestão de Estoque

**Como** administrador  
**Quero** ajustar o estoque de um livro  
**Para** refletir compras e reposições

#### Critérios de Aceite
- [ ] Modal "Ajustar Estoque" na listagem
- [ ] Campos:
  - Estoque atual (exibido, não editável)
  - Operação (dropdown: Adicionar, Remover, Definir)
  - Quantidade (número)
  - Motivo (opcional, textarea)
- [ ] Cálculo em tempo real do novo estoque
- [ ] Integração com `PATCH /api/admin/books/{id}/stock`
- [ ] Validação: não permitir estoque negativo
- [ ] Histórico de movimentações (opcional - v2.0)

#### DoD
- [ ] Estoque atualiza corretamente
- [ ] Badge "Estoque Baixo" aparece quando <5
- [ ] Testes E2E

**Estimativa**: 5 pontos (8h)  
**Labels**: `admin`, `books`, `inventory`

---

### US-04.5: Visualizar Métricas do Livro

**Como** administrador  
**Quero** ver métricas de um livro  
**Para** entender seu desempenho

#### Critérios de Aceite
- [ ] Página ou modal `/admin/books/[id]/metrics`
- [ ] Integração com `GET /api/admin/books/{id}/metrics`
- [ ] Métricas exibidas:
  - Total de visualizações
  - Total de cliques em "Adicionar ao Carrinho"
  - Total de unidades vendidas
  - Receita total gerada
- [ ] Gráfico de visualizações (últimos 30 dias)
- [ ] Comparativo com média do catálogo

#### DoD
- [ ] Métricas carregando corretamente
- [ ] Gráficos responsivos
- [ ] Dados atualizados (cache de 5min)

**Estimativa**: 5 pontos (8h)  
**Labels**: `admin`, `books`, `analytics`, `charts`

---

## EPIC-05: Catálogo Público e E-commerce

**Objetivo**: Implementar o catálogo público de livros com busca, filtros e página de detalhes.

**Valor de Negócio**: Permitir que clientes naveguem e conheçam os livros.

**Prioridade**: 🟡 MÉDIA

---

### US-05.1: Criar Página Home com Hero Section

**Como** visitante  
**Quero** ver uma página inicial impactante  
**Para** conhecer a história do Pastor Iraquitan Tunoda

#### Critérios de Aceite
- [ ] Página `/` (home)
- [ ] Hero Section:
  - Foto do Pastor Iraquitan Tunoda
  - Headline emocional: "25 anos transformando vidas através da palavra"
  - Subtítulo com história de missionário no Japão
  - CTA "Ver Livros" (scroll suave para catálogo)
- [ ] Seção "Sobre o Autor" (reutilizar do projeto existente)
- [ ] Seção "Livros em Destaque" (top 6 mais visualizados)
- [ ] Footer com links e redes sociais

#### Design
- [ ] Paleta de cores cristã (azul #2F5D8C, verde #3A7D44, dourado #C9A44C)
- [ ] Tipografia: Playfair Display (títulos), Inter (corpo)
- [ ] Animações sutis (fade-in, parallax leve)
- [ ] Responsiva mobile-first

#### DoD
- [ ] SEO otimizado (meta tags, structured data)
- [ ] Performance >90 no Lighthouse
- [ ] Acessibilidade A11y validada
- [ ] Testes E2E da navegação

**Estimativa**: 8 pontos (13h)  
**Labels**: `frontend`, `public`, `hero`, `landing-page`

---

### US-05.2: Criar Catálogo de Livros com Filtros

**Como** visitante  
**Quero** navegar pelo catálogo de livros  
**Para** encontrar livros do meu interesse

#### Critérios de Aceite
- [ ] Seção ou página `/livros`
- [ ] Grid de livros (3 colunas desktop, 1 mobile)
- [ ] Card de livro:
  - Imagem da capa
  - Título
  - Autor(es)
  - Preço formatado (R$)
  - Botão "Ver Detalhes"
- [ ] Integração com `GET /api/public/books` (paginado)
- [ ] Paginação ou infinite scroll
- [ ] Filtros:
  - Busca por título (debounced)
  - Por autor (dropdown)
  - Faixa de preço (slider)
- [ ] Ordenação:
  - Mais relevantes (default)
  - Menor preço
  - Maior preço
  - Mais recentes
- [ ] Loading skeleton durante carregamento
- [ ] Estado vazio: "Nenhum livro encontrado"

#### DoD
- [ ] Catálogo funcional
- [ ] Filtros aplicam corretamente
- [ ] Performance otimizada (lazy load imagens)
- [ ] Responsivo

**Estimativa**: 13 pontos (21h)  
**Labels**: `frontend`, `public`, `catalog`, `e-commerce`

---

### US-05.3: Criar Página de Detalhes do Livro

**Como** visitante  
**Quero** ver todos os detalhes de um livro  
**Para** decidir se quero comprá-lo

#### Critérios de Aceite
- [ ] Página `/livros/[id]`
- [ ] Integração com `GET /api/public/books/{id}`
- [ ] Layout:
  - **Esquerda**: Imagem da capa (zoom ao passar mouse)
  - **Direita**:
    - Título
    - Autor(es) com biografia resumida
    - Preço destacado (R$)
    - Descrição completa
    - Especificações (ISBN, peso, páginas - se disponível)
    - Botão "Adicionar ao Carrinho" (destaque dourado)
    - Botão "Comprar Agora" (direto checkout)
- [ ] Seção "Sobre o(s) Autor(es)" expansível
- [ ] Seção "Livros Relacionados" (mesmo autor)
- [ ] Breadcrumb: Home > Livros > [Título]
- [ ] Integração de métricas: `POST /api/public/books/{id}/metrics` (VIEW)

#### Interações
- [ ] Clicar em autor leva para filtro por autor
- [ ] Adicionar ao carrinho mostra feedback visual
- [ ] Toast de confirmação: "Livro adicionado ao carrinho"

#### DoD
- [ ] Página funcional com todos os dados
- [ ] SEO otimizado (Open Graph, Twitter Cards)
- [ ] Schema.org/Book structured data
- [ ] Responsiva
- [ ] Testes E2E

**Estimativa**: 8 pontos (13h)  
**Labels**: `frontend`, `public`, `product-detail`, `e-commerce`

---

## EPIC-06: Carrinho e Checkout

**Objetivo**: Implementar carrinho de compras e fluxo de checkout.

**Valor de Negócio**: Permitir que clientes finalizem compras.

**Prioridade**: 🟡 MÉDIA-ALTA

---

### US-06.1: Implementar Carrinho de Compras

**Como** visitante  
**Quero** adicionar livros ao carrinho  
**Para** comprá-los posteriormente

#### Critérios de Aceite
- [ ] Integração com Context API + Backend
- [ ] Sincronização híbrida:
  - **Não autenticado**: Carrinho em localStorage + sessão backend
  - **Autenticado**: Carrinho persistido no backend
- [ ] Funcionalidades:
  - Adicionar item (integração com `POST /api/carts/{id}/items`)
  - Remover item (`DELETE /api/carts/{id}/items/{itemId}`)
  - Atualizar quantidade (`PUT /api/carts/{id}/items/{itemId}`)
  - Limpar carrinho
- [ ] Ícone de carrinho no header com contador de itens
- [ ] Dropdown do carrinho ao hover (mini-cart)
- [ ] Página `/carrinho` completa
- [ ] Cálculo automático de totais
- [ ] Validação de estoque em tempo real

#### DoD
- [ ] Carrinho sincroniza com backend
- [ ] Persistência funciona entre sessões
- [ ] Atualização otimista (UI rápida)
- [ ] Testes E2E do carrinho

**Estimativa**: 13 pontos (21h)  
**Labels**: `frontend`, `cart`, `e-commerce`, `complex`

---

### US-06.2: Criar Página de Checkout

**Como** cliente  
**Quero** finalizar minha compra  
**Para** receber os livros

#### Critérios de Aceite
- [ ] Página `/checkout` protegida (requer auth futura ou dados básicos)
- [ ] Layout multi-step:
  
  **Step 1: Identificação**
  - Nome completo
  - Email
  - Telefone
  
  **Step 2: Endereço de Entrega**
  - CEP (com busca via ViaCEP)
  - Rua, número, complemento
  - Bairro, cidade, estado
  - Cálculo de frete (integração `POST /api/shipping/calculate`)
  - Seleção de transportadora (Melhor Envio)
  
  **Step 3: Revisão**
  - Resumo do pedido
  - Itens do carrinho
  - Subtotal
  - Frete
  - Total
  
  **Step 4: Pagamento** (EPIC-07)

- [ ] Validação de cada step antes de avançar
- [ ] Breadcrumb de progresso (1/4, 2/4, etc)
- [ ] Botão "Voltar" funcional
- [ ] Integração com `POST /api/orders` ao finalizar

#### DoD
- [ ] Checkout funcional até revisão
- [ ] Cálculo de frete funciona
- [ ] Validações rigorosas
- [ ] Responsivo

**Estimativa**: 13 pontos (21h)  
**Labels**: `frontend`, `checkout`, `e-commerce`, `complex`

---

## EPIC-07: Integração de Pagamentos

**Objetivo**: Integrar Mercado Pago para processar pagamentos.

**Valor de Negócio**: Monetização da loja.

**Prioridade**: 🟢 BAIXA (Após checkout funcional)

---

### US-07.1: Integrar Mercado Pago Brick

**Como** cliente  
**Quero** pagar com cartão ou PIX  
**Para** concluir minha compra

#### Critérios de Aceite
- [ ] SDK do Mercado Pago instalado
- [ ] Brick de pagamento renderizado no Step 4 do checkout
- [ ] Métodos aceitos: Cartão de Crédito, PIX
- [ ] Integração com `POST /api/orders/{id}/payments`
- [ ] Processamento assíncrono via webhooks
- [ ] Página de confirmação `/pedido/[id]/confirmacao`
- [ ] Status de pagamento em tempo real

#### Fluxo
1. Cliente preenche checkout
2. Cria pedido (status PENDING)
3. Seleciona forma de pagamento
4. Mercado Pago processa
5. Webhook atualiza pedido (PAID/FAILED)
6. Email de confirmação enviado (backend)

#### DoD
- [ ] Pagamento com cartão funciona
- [ ] PIX gera QR Code e Pix Copia e Cola
- [ ] Webhooks recebidos e processados
- [ ] Testes em sandbox

**Estimativa**: 13 pontos (21h)  
**Labels**: `frontend`, `payment`, `mercado-pago`, `integration`, `complex`

---

## 📊 Resumo de Estimativas

| Épico | User Stories | Story Points | Horas Estimadas |
|-------|--------------|--------------|-----------------|
| EPIC-01: Arquitetura | 5 | 19 | 29h |
| EPIC-02: Autenticação | 3 | 13 | 21h |
| EPIC-03: Admin Autores | 4 | 18 | 29h |
| EPIC-04: Admin Livros | 5 | 39 | 63h |
| EPIC-05: Catálogo Público | 3 | 29 | 47h |
| EPIC-06: Carrinho e Checkout | 2 | 26 | 42h |
| EPIC-07: Pagamento | 1 | 13 | 21h |
| **TOTAL** | **23** | **157** | **252h** |

---

## 🎯 Priorização Recomendada (Sprint Planning)

### Sprint 1 (2 semanas) - Fundação
- EPIC-01: Arquitetura completa
- EPIC-02: Autenticação
- **Entrega**: Login funcional + estrutura sólida

### Sprint 2 (2 semanas) - Painel Admin
- EPIC-03: Gestão de Autores (completo)
- EPIC-04: Gestão de Livros (US-04.1 e US-04.2)
- **Entrega**: Admin pode cadastrar autores e livros

### Sprint 3 (2 semanas) - CRUD Completo
- EPIC-04: Gestão de Livros (US-04.3, US-04.4, US-04.5)
- **Entrega**: CRUD completo de livros + métricas

### Sprint 4 (2 semanas) - E-commerce
- EPIC-05: Catálogo Público (completo)
- **Entrega**: Site público funcionando

### Sprint 5 (2 semanas) - Carrinho
- EPIC-06: Carrinho e Checkout (completo)
- **Entrega**: Checkout funcional (sem pagamento)

### Sprint 6 (2 semanas) - Pagamento
- EPIC-07: Integração Mercado Pago
- **Entrega**: Loja 100% funcional

---

## 📝 Template de User Story no Jira

```
Título: [US-XX.X] Nome da User Story

Tipo: Story
Épico: [EPIC-XX]
Prioridade: Alta/Média/Baixa
Story Points: X

Descrição:
Como [persona]
Quero [funcionalidade]
Para [benefício]

Critérios de Aceite:
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

Definition of Done:
- [ ] Código revisado e mergeado
- [ ] Testes passando (cobertura >80%)
- [ ] Documentação atualizada
- [ ] Deploy em staging validado
- [ ] Aprovado pelo PO (você)

Dependências:
- Bloqueada por: [US-XX]
- Bloqueia: [US-YY]

Labels: frontend, admin, crud, typescript
```

---

## 🛠️ Stack Técnico Confirmado

**Frontend:**
- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- React Query (cache de API)
- Zustand (estado global)
- Axios (HTTP client)
- React Hook Form (formulários)
- Zod (validação)
- Recharts (gráficos)
- Lucide Icons

**Backend (já existente):**
- Spring Boot 3.4+
- Java 21 LTS
- PostgreSQL
- Clean Architecture + DDD
- JWT Authentication
- Mercado Pago
- Melhor Envio

---

## ✅ Próximos Passos

1. **Revisar este documento** e ajustar prioridades se necessário
2. **Importar épicos e stories no Jira**
3. **Começar pela Sprint 1** (EPIC-01 + EPIC-02)
4. **Daily de 15min** para acompanhar progresso
5. **Review ao final de cada sprint** (demo + retrospectiva)

---

**Criado em**: 18/01/2026  
**Versão**: 1.0  
**Autor**: Equipe Livraria Tunoda

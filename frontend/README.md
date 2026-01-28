# Loja de Livros Cristãos - Pastor Iraquitan Tunoda

Uma página de vendas completa e profissional para livros cristãos do Pastor Iraquitan Tunoda, missionário que dedicou mais de 20 anos propagando o evangelho no Japão. Desenvolvida com Next.js 16, App Router, Tailwind CSS e funcionalidades avançadas de e-commerce.

## 🎯 Objetivo

Criar uma experiência que transmita **paz**, **fé**, **esperança**, **confiança** e **alegria** através de um design limpo, emocional e focado em conversão, apresentando a trajetória única do Pastor Iraquitan Tunoda como missionário internacional.

## 👨‍🏫 Sobre o Pastor Iraquitan Tunoda

**Pastor Missionário e Escritor** com trajetória inspiradora:

- ✅ **25+ anos de ministério cristão**
- ✅ **20+ anos como missionário no Japão**
- ✅ **50k+ vidas impactadas**
- ✅ **12 livros publicados**
- ✅ Perspectiva intercultural única adquirida no Oriente
- ✅ Instagram: [@iraquitantunoda](https://www.instagram.com/iraquitantunoda/)

## 🎨 Design e Cores

### Paleta de Cores Cristã

- **Azul principal**: `#2F5D8C` - Transmite confiança e serenidade
- **Verde secundário**: `#3A7D44` - Representa esperança e crescimento
- **Dourado (CTA)**: `#C9A44C` - Destaca ações importantes
- **Background**: `#F7F6F2` - Suavidade e elegância
- **Texto**: `#2E2E2E` - Legibilidade otimizada

### Tipografia

- **Títulos**: Playfair Display (elegante e impactante)
- **Texto**: Inter (legibilidade e clareza)

## 🏗️ Funcionalidades Implementadas

### ✅ **Navegação Funcional**

- Menu fixo com scroll suave para seções
- **Início** → Hero Section
- **Livros** → Seção de produtos
- **Sobre** → História do pastor
- Carrinho com contador de itens + mini-cart no hover (desktop)
- Design responsivo com menu mobile

### ✅ **Seção Hero Refinada**

- Layout responsivo (2 colunas desktop, empilhado mobile)
- Foto real do Pastor Iraquitan Tunoda
- Botão "Adquirir livros" com scroll suave funcional
- Animações sutis de entrada
- Headline emocional impactante

### ✅ **Catálogo de Livros**

- **3 livros em destaque** na home (limitado)
- Catálogo completo com paginação
- Fotos reais das capas
- Descrições inspiradoras
- Preços formatados em R$
- Botão "Adicionar ao carrinho" com feedback visual
- Hover effects e animações elegantes

### ✅ **Detalhes do Livro (/livros/[id])**

- Breadcrumbs: Home > Livros > Título
- Imagem com zoom no hover
- Autores com biografia resumida e link para filtro
- Descrição completa + especificações (ISBN, peso, páginas)
- Botões “Adicionar ao Carrinho” e “Comprar Agora”
- Seção expansível “Sobre o(s) Autor(es)”
- “Livros Relacionados” pelo mesmo autor
- Métricas: VIEW ao entrar na página; CLICK nos botões de compra

### ✅ **Sistema de Carrinho Completo**

- **Context API** com sincronização híbrida (localStorage + backend)
- Persistência entre sessões via `cartId` + snapshot local (`cartSnapshot`)
- Adição/remoção/atualização com UI otimista
- Cálculo automático de totais + contador global
- Validação de estoque via backend (carrinho e checkout)

### ✅ **Página do Carrinho (/carrinho)**

- Lista completa dos itens
- Gerenciamento de quantidades
- Resumo financeiro detalhado
- Benefícios destacados (frete grátis, etc.)
- Estado vazio com CTA para compras
- Validação de estoque em tempo real
- Bloqueio de checkout quando estoque inválido

### ✅ **Página de Checkout (/checkout)**

- Fluxo multi-step (Identificação, Endereço, Revisão, Pagamento)
- Validação por etapa + estoque antes de avançar
- Busca de endereço por CEP (consulta automática)
- Cálculo e seleção de frete (Melhor Envio) com recálculo
- Resumo do pedido com subtotal, frete e total
- Breadcrumb de progresso + botão voltar funcional
- Checkout cria pedido (POST `/carts/checkout`) com frete selecionado
- Pagamento via Mercado Pago (Cartão/PIX) no Step 4
- Status do pagamento em tempo real + webhook atualizado
- Página de confirmação `/pedido/[id]/confirmacao`

### ✅ **Seção Sobre o Autor**

- História completa do Pastor Iraquitan
- Experiência missionária no Japão destacada
- Estatísticas impressionantes
- Valores cristãos em destaque
- Links para redes sociais
- Animações baseadas em scroll

### ✅ **Imagens Reais**

- Fotos autênticas do Pastor Iraquitan Tunoda
- Capas personalizadas dos livros
- Otimização de carregamento (lazy loading)
- Responsividade em todos os breakpoints

## 🚀 Setup e Instalação

### Pré-requisitos

- **Node.js** 20+ (recomendado)
- **npm** ou **yarn**

### Passos de Instalação

```bash
# 1. Clonar o repositório
git clone [url-do-repositorio]
cd frontend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite o arquivo .env.local com suas configurações

# 4. Executar em desenvolvimento
npm run dev

# 5. Acessar no navegador
# Local: http://localhost:3000
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (Turbopack)

# Build
npm run build            # Cria build otimizado para produção
npm start                # Inicia servidor de produção

# Qualidade de Código
npm run lint             # Executa ESLint
npm run format           # Formata código com Prettier
npm run format:check     # Verifica formatação sem alterar
npm run type-check       # Verifica erros TypeScript

# Combinado (recomendado antes de commit)
npm run lint && npm run type-check && npm run format:check
```

## 📱 Características Técnicas

### **Responsividade Total**

- **Mobile-first** approach
- Breakpoints otimizados
- Menu hamburger funcional
- Grid adaptativo para livros
- Imagens responsivas

### **Performance Otimizada**

- Next.js 16 com Turbopack
- Fontes Google otimizadas (`display: 'swap'`)
- Lazy loading de imagens
- Build otimizado para produção
- Carregamento progressivo

### **Acessibilidade (A11y)**

- ARIA labels descritivos
- Alt texts detalhados
- Focus states bem definidos
- Contraste adequado (WCAG)
- Navegação por teclado
- Reduced motion support

### **SEO Otimizado**

- Meta tags completas
- Open Graph e Twitter Cards na página de detalhes
- HTML semântico
- Structured data (Schema.org/Book) na página de detalhes
- Lang="pt-BR"
- URLs amigáveis

## 🛒 Fluxo de Compra

1. **Navegação** → Usuário explora a página
2. **Seleção** → Adiciona livros ao carrinho
3. **Carrinho** → Revisa itens e quantidades
4. **Checkout** → Identificação, endereço e frete
5. **Pagamento** → Mercado Pago (Cartão/PIX) + webhook de status

## 📂 Estrutura do Projeto (Enterprise Pattern)

```
src/
├── app/                      # Next.js 16 App Router
│   ├── layout.tsx            # Layout raiz + Providers (ReactQuery, Cart)
│   ├── page.tsx              # Página principal
│   ├── login/page.tsx        # ✨ Página de autenticação (NOVO)
│   ├── admin/
│   │   └── dashboard/page.tsx  # ✨ Dashboard admin (NOVO)
│   ├── cart/page.tsx         # Página do carrinho (base)
│   ├── carrinho/page.tsx     # Alias pt-BR para /carrinho
│   ├── checkout/page.tsx     # Página de checkout (pagamento MP)
│   ├── pedido/[id]/confirmacao/page.tsx # Confirmação do pedido
│   └── globals.css           # Estilos globais + Tailwind
├── components/
│   ├── ui/                   # Componentes UI genéricos
│   │   ├── Button.tsx        # Botão reutilizável
│   │   └── index.ts          # Barrel export
│   ├── layout/               # Componentes de layout
│   │   └── Navigation.tsx    # Header/Menu principal
│   └── features/             # Componentes de domínio
│       ├── Hero.tsx          # Seção hero
│       ├── Books.tsx         # Catálogo de livros
│       └── About.tsx         # Sobre o autor
├── contexts/                 # React Context API
│   └── CartContext.tsx       # Carrinho híbrido (localStorage + backend)
├── services/                 # ✨ API Services (NOVO)
│   ├── authService.ts        # Autenticação (login, refresh, logout)
│   ├── authorService.ts      # CRUD autores (ADMIN)
│   ├── bookService.ts        # Livros (público + ADMIN)
│   ├── cartService.ts        # Carrinho de compras
│   ├── shippingService.ts    # Cálculo de frete
│   ├── orderService.ts       # Pedidos
│   └── paymentService.ts     # Pagamentos (Mercado Pago)
├── lib/                      # Utilitários e configurações
│   ├── api-client.ts         # ✨ Axios configurado + interceptors
│   └── auth-storage.ts       # ✨ Gerenciamento de tokens
├── types/                    # ✨ TypeScript Types (REFINADO)
│   ├── api.ts                # Tipos comuns + enums (Currency, WeightUnit)
│   ├── auth.ts               # Autenticação e usuário
│   ├── author.ts             # Author + AuthorSummary
│   ├── book.ts               # Book completo com currency/weightUnit
│   ├── cart.ts               # Carrinho de compras
│   ├── shipping.ts           # Cálculo de frete
│   ├── order.ts              # Pedidos
│   ├── payment.ts            # Pagamentos (Mercado Pago)
│   └── index.ts              # Barrel export (50+ types)
├── hooks/                    # Custom React Hooks
├── store/                    # ✨ Zustand Stores (NOVO)
│   ├── useAuthStore.ts       # Auth + persistência
│   ├── useCartStore.ts       # Carrinho temporário
│   ├── useUIStore.ts         # UI (modais, sidebar, notifications)
│   ├── middleware/
│   │   └── logger.ts         # Logger dev only
│   └── index.ts              # Barrel export
├── constants/                # Constantes da aplicação
└── public/
    └── img/                  # Imagens estáticas
```

## 🛠️ Stack Tecnológica

### Core
- **Next.js 16.1.1** - Framework React com App Router e Turbopack
- **React 19.2.3** - Biblioteca UI
- **TypeScript 5** - Tipagem estática (strict mode)

### Styling
- **Tailwind CSS 4** - Framework CSS utility-first
- **@tailwindcss/postcss** - Integração PostCSS

### Estado e Dados
- **React Context API** - Carrinho sincronizado (localStorage + backend)
- **Zustand 5.0.10** - Estado global (Auth, UI, cart store experimental)
- **Persist Middleware** - Persistência automática no localStorage
- **React Query (TanStack Query)** - Cache de servidor, mutations, invalidações

### API & HTTP
- **Axios** - Cliente HTTP com interceptors
- **JWT** - Autenticação via tokens (localStorage)
- **API Client** - Refresh token automático

### Qualidade de Código
- **ESLint 9** - Linter (eslint-config-next)
- **Prettier 3.4.2** - Formatação de código
- **TypeScript 5** - Type checking com strict mode (zero `any`)
- **50+ interfaces** - DTOs que espelham backend Spring Boot

### UI & Feedback
- **React Hot Toast** - Notificações toast elegantes e acessíveis
- **Framer Motion** - Animações suaves (futuro)

### Otimização
- **next/image** - Otimização automática de imagens
- **Turbopack** - Bundler ultra-rápido
- **Fontes Google** - Otimizadas com `display: 'swap'`

## 🔐 Autenticação e Painel Administrativo

Sistema completo de login e dashboard para administradores com segurança reforçada.

### **Página de Login** (`/login`)

Interface de autenticação com design moderno e paleta cristã.

#### **Features:**

**Validação Frontend (apenas campos obrigatórios):**
- ✅ Email obrigatório (não vazio)
- ✅ Senha obrigatória (não vazio)
- ✅ Limpeza de erros em tempo real ao digitar

**Validação Backend (formato e regras de negócio):**
- ✅ Formato de email válido
- ✅ Regras de senha (comprimento, complexidade, etc.)
- ✅ Credenciais corretas
- ✅ Status do usuário (ativo/inativo)
- ✅ Erros retornados em formato estruturado
- ✅ Mensagens específicas por campo

**Segurança:**
- ✅ **Rate Limiting**: Máximo 5 tentativas por minuto
- ✅ **Password Toggle**: Botão para mostrar/ocultar senha
- ✅ **Input type password** por padrão
- ✅ **JWT Storage**: Token armazenado via Zustand + localStorage
- ✅ **HTTPS obrigatório** em produção

**Experiência do Usuário:**
- ✅ **Loading state** durante autenticação
- ✅ **Spinner animado** no botão "Entrar"
- ✅ **Contador de tentativas** restantes
- ✅ **Timer de reset** quando limite atingido
- ✅ **Redirect automático** para `/admin/dashboard` após sucesso
- ✅ **Responsivo** (mobile-first)
- ✅ **Acessibilidade** (aria-labels, role="alert", etc.)

**Tratamento de Erros do Backend:**

O backend retorna erros no formato:
```json
{
  "timestamp": "2026-01-19T08:35:10.229763802",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validação",
  "path": "/api/auth/login",
  "correlationId": "a548d09c-186a-4a89-9223-815d9f53404d",
  "errors": [
    {
      "field": "email",
      "message": "Email invalido"
    }
  ]
}
```

**O frontend:**
- ✅ Exibe erros de campo abaixo de cada input correspondente
- ✅ Exibe erros gerais no topo do formulário
- ✅ Mensagens vêm direto do backend (i18n centralizado)
- ✅ Suporta múltiplos erros simultâneos
- ✅ Trata erros de rede com mensagens amigáveis

**Estratégia de Validação:**

Frontend valida **apenas campos obrigatórios** (não vazios).  
Backend valida **formato, regras de negócio e segurança**.

**Benefícios:**
- 🔒 **Segurança**: Validação JS pode ser bypassada no browser
- 🎯 **Fonte única**: Regras centralizadas no backend
- 🌐 **Consistência**: Mesmas regras para web, mobile, API
- 🗣️ **i18n**: Mensagens centralizadas

**Credenciais de Teste (Development):**
```
Email: admin@livraria.com
Senha: admin123
```

---

### **Dashboard Administrativo** (`/admin/dashboard`)

Painel centralizado para gerenciamento da livraria com **métricas em tempo real** integradas ao backend.

#### **Features Implementadas:**

**Autenticação e Segurança:**
- ✅ **Autenticação requerida** (redirect se não autenticado)
- ✅ **Auto-logout por inatividade** (1 hora)
- ✅ **Proteção de rota** via middleware
- ✅ **Informações do usuário** no header
- ✅ **Botão de logout** com confirmação modal
- ✅ **Layout responsivo** com Tailwind CSS

**Métricas em Tempo Real:**

| Card | Métrica | Endpoint | Status |
|------|---------|----------|--------|
| 📚 | **Total de Livros** | `GET /admin/books` | ✅ Implementado |
| 👥 | **Total de Autores** | `GET /admin/authors` | ✅ Implementado |
| ⚠️ | **Livros com Estoque Baixo** | `GET /admin/books?lowStock=true` | ✅ Implementado |
| 👁️ | **Top 5 Mais Visualizados** | `GET /public/books/most-viewed` | ✅ Implementado |
| 🖱️ | **Top 5 Mais Clicados** | `GET /public/books/most-clicked` | ✅ Implementado |

#### **Componentes Visuais:**

**1. Cards de Métricas Principais**

Três cards destacados no topo do dashboard:

- **Total de Livros**: Contador com ícone de livro (azul)
- **Total de Autores**: Contador com ícone de pessoas (verde)
- **Livros com Estoque Baixo**: Contador com alerta visual (âmbar/vermelho)

**Design:**
- Fundo branco com sombra sutil
- Ícones em círculos coloridos
- Números grandes e legíveis
- Loading skeleton durante carregamento
- Formatação de números em pt-BR

**2. Alerta de Estoque Baixo** (Refinado)

Componente visual elegante que lista livros com menos de 10 unidades:

**Visual:**
- ✅ **Borda esquerda âmbar** (2px) - acento sutil
- ✅ **Fundo branco** - profissional e limpo
- ✅ **Header separado** - ícone + título + descrição
- ✅ **Ícone neutro** - fundo cinza claro (não vermelho)
- ✅ **Cards de livros** - borda cinza, hover suave
- ✅ **Vermelho apenas nos números** - foco no dado crítico
- ✅ **Botão "Repor"** - outline azul (identidade visual)
- ✅ **Espaçamento generoso** - respiro visual

**Antes vs Depois:**
```diff
- Fundo vermelho agressivo
- Borda 4px vermelha
- Ícone com fundo vermelho
- Botão vermelho sólido
+ Fundo branco profissional
+ Borda 2px âmbar sutil
+ Ícone com fundo cinza neutro
+ Botão outline azul elegante
```

**Dados exibidos:**
- Título do livro
- Estoque atual (em vermelho)
- Botão de ação "Repor"

**3. Top 5 Livros Mais Visualizados**

Tabela limpa com ranking dos livros mais vistos:

**Features:**
- Badge numerado (1-5) em azul
- Título do livro
- Total de visualizações formatado
- Hover states suaves
- Loading skeleton animado
- Empty state amigável

**Estrutura de Dados:**
```typescript
interface TopBook {
  id: string;
  title: string;
  photoUrl: string | null;
  totalMetrics: number; // Total de visualizações
}
```

**4. Top 5 Livros Mais Clicados**

Tabela similar aos mais visualizados, destacando cliques:

**Features:**
- Badge numerado (1-5) em verde
- Título do livro
- Total de cliques formatado
- Hover states suaves
- Loading skeleton animado
- Empty state amigável

**Cor diferenciada** (verde) para distinguir de visualizações (azul).

#### **Hooks Personalizados:**

O dashboard utiliza hooks especializados para buscar métricas:

```typescript
import {
  useDashboardStats,
  useMostViewedBooks,
  useMostClickedBooks,
  useLowStockBooks,
} from "@/hooks/useDashboard";

// Estatísticas gerais
const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
// Retorna: { totalBooks, totalAuthors, lowStockBooks }

// Top 5 mais visualizados
const { data: mostViewed, isLoading: isLoadingViewed } = useMostViewedBooks(5);

// Top 5 mais clicados
const { data: mostClicked, isLoading: isLoadingClicked } = useMostClickedBooks(5);

// Livros com estoque baixo
const { data: lowStock, isLoading: isLoadingLowStock } = useLowStockBooks();
```

#### **Integração com Backend:**

**Endpoints Utilizados:**

| Métrica | Endpoint | Método | Parâmetros |
|---------|----------|--------|------------|
| Total Livros | `/admin/books` | GET | `page=0&size=1` |
| Total Autores | `/admin/authors` | GET | `page=0&size=1` |
| Estoque Baixo | `/admin/books` | GET | `lowStock=true&size=10` |
| Mais Visualizados | `/public/books/most-viewed` | GET | `limit=5` |
| Mais Clicados | `/public/books/most-clicked` | GET | `limit=5` |

**Resposta do Backend (Top Books):**
```json
{
  "books": [
    {
      "id": "uuid",
      "title": "Título do Livro",
      "photoUrl": "https://...",
      "totalMetrics": 123
    }
  ],
  "generatedAt": "2026-01-19T12:12:26..."
}
```

**Mapeamento Frontend:**
- O `bookService` extrai apenas o array `books` da resposta
- Frontend usa `id` e `totalMetrics` (alinhado com backend)
- Type safety completo com interface `TopBook`

#### **Cache e Performance:**

**React Query Configuration:**
- ✅ **Stale Time**: 2-5 minutos (dependendo da métrica)
- ✅ **Cache**: Dados mantidos em cache para navegação rápida
- ✅ **Refetch**: Automático ao focar na aba
- ✅ **Loading States**: Skeletons durante carregamento
- ✅ **Error Handling**: Mensagens amigáveis em caso de erro

**Query Keys:**
```typescript
queryKeys.dashboard.stats()           // ['dashboard', 'stats']
queryKeys.books.mostViewed(5)         // ['books', 'most-viewed', 5]
queryKeys.books.mostClicked(5)        // ['books', 'most-clicked', 5]
queryKeys.books.lowStock()            // ['books', 'low-stock']
```

#### **Responsividade:**

**Desktop (>1024px):**
- Grid de 3 colunas para cards de métricas
- Grid de 2 colunas para Top 5 (lado a lado)
- Alerta de estoque em largura total
- Sidebar fixa

**Tablet (768px-1024px):**
- Grid de 2 colunas para cards de métricas
- Grid de 2 colunas para Top 5
- Alerta de estoque em largura total

**Mobile (<768px):**
- Cards empilhados verticalmente (1 coluna)
- Top 5 empilhados
- Menu hamburger para sidebar
- Espaçamento otimizado

#### **Design System:**

**Paleta de Cores:**
- **Azul (`christian-blue`)**: Total de Livros, Mais Visualizados, Botões principais
- **Verde (`christian-green`)**: Total de Autores, Mais Clicados
- **Âmbar (`amber-500/600`)**: Alerta de estoque (borda e ícone)
- **Vermelho (`red-600`)**: Números críticos de estoque
- **Cinza (`gray-50/200`)**: Fundos neutros, ícones secundários

**Tipografia:**
- **Títulos**: Playfair Display (elegante)
- **Números grandes**: Bold, 3xl
- **Texto corpo**: Inter, regular
- **Métricas**: Formatadas com `toLocaleString("pt-BR")`

#### **Exemplo de Uso:**

```typescript
// Página do Dashboard
export default function DashboardPage() {
  const { user } = useAuthStore();
  useAutoLogoutAfterInactivity(); // Auto-logout

  // Buscar métricas
  const { data: stats } = useDashboardStats();
  const { data: mostViewed } = useMostViewedBooks(5);
  const { data: mostClicked } = useMostClickedBooks(5);
  const { data: lowStock } = useLowStockBooks();

  return (
    <div className="dashboard">
      {/* Cards de métricas */}
      <MetricsCards stats={stats} />
      
      {/* Alerta de estoque baixo */}
      {lowStock?.content.length > 0 && (
        <LowStockAlert books={lowStock.content} />
      )}
      
      {/* Top 5 tabelas */}
      <TopBooksGrid 
        mostViewed={mostViewed} 
        mostClicked={mostClicked} 
      />
    </div>
  );
}
```

#### **Acessibilidade:**

- ✅ **ARIA labels** em todos os ícones
- ✅ **Semantic HTML** (main, section, article)
- ✅ **Color contrast** (WCAG AA)
- ✅ **Keyboard navigation** funcional
- ✅ **Screen reader** friendly
- ✅ **Focus states** visíveis

---

### **🔧 Correções Implementadas**

#### **1. Botão "Entrar" Invisível**
**Problema:** Botão estava funcionalmente presente mas visualmente invisível (classes Tailwind não aplicadas).

**Solução:** Substituídas classes CSS por estilos inline com cores hex diretas:
```tsx
style={{
  backgroundColor: disabled ? "#9CA3AF" : "#2F5D8C",  // Azul ou cinza
}}
```

#### **2. Redirect Após Login**
**Problema:** Login bem-sucedido mas não redirecionava para dashboard (Zustand não era atualizado).

**Solução:** `authService` agora atualiza **AMBOS** localStorage E Zustand:
```typescript
// Salva no localStorage
saveAuthData(accessToken, refreshToken, user);

// TAMBÉM atualiza o Zustand!
useAuthStore.getState().setAuth(accessToken, refreshToken, user);
```

#### **3. Scroll Horizontal no Desktop**
**Problema:** Elementos decorativos causavam overflow horizontal.

**Solução:**
- Removidos elementos decorativos problemáticos
- Adicionado `overflow-x: hidden` no CSS global

#### **4. Conteúdo Oculto no Mobile**
**Problema:** Seção "Sobre o Autor" ficava invisível no mobile.

**Solução:**
- IntersectionObserver threshold reduzido (0.3 → 0.1)
- Adicionado `rootMargin: "50px"` para detecção antecipada

---

## 📚 **Gestão de Autores (Admin)**

Sistema completo de listagem e gerenciamento de autores no painel administrativo.

### **Funcionalidades Implementadas**

#### **1. Sidebar de Navegação Admin**

Menu lateral responsivo com navegação entre páginas administrativas.

**Features:**
- Logo + Nome do painel
- Links para Dashboard, Autores, Livros, Pedidos
- Indicador visual de página ativa
- Informações do usuário logado
- Botão de logout com confirmação
- Drawer mobile (menu hamburger)
- Backdrop com blur no mobile
- Posição fixa no desktop

#### **2. Breadcrumb**

Navegação hierárquica exibindo o caminho atual.

**Exemplo:**
```
Dashboard > Autores
```

#### **3. Página de Listagem** (`/admin/authors`)

Interface completa para visualizar e gerenciar autores.

**Layout:**
- ✅ **Desktop**: Tabela com 3 colunas (Autor, Status, Ações)
- ✅ **Mobile**: Cards responsivos com todas as informações
- ✅ **Sidebar**: Navegação fixa à esquerda
- ✅ **Header**: Título + Botão "Novo Autor"

**Colunas da Tabela:**
- **Autor**: Foto (thumbnail circular) + Nome
- **Status**: Badge colorido (Verde = Ativo, Cinza = Inativo)
- **Ações**: Botões "Editar" e "Ativar/Desativar"

#### **4. Filtros e Busca (Server-Side)**

Painel de filtros acima da tabela com integração completa ao backend:

**Busca por Nome:**
- Campo de texto com busca server-side
- Busca parcial e case-insensitive
- Parâmetro API: `name`
- Reset automático para página 1 ao buscar

**Filtro por Status:**
- Dropdown com opções: Todos, Ativos, Inativos
- Filtro server-side via API
- Parâmetro API: `status`
- Reset automático para página 1 ao filtrar

**Ordenação:**
- Dropdown: A-Z (asc) ou Z-A (desc)
- Ordenação server-side via API
- Parâmetros API: `sortBy=name` e `sortDirection=asc|desc`
- Reset automático para página 1 ao ordenar

#### **5. Paginação Server-Side**

Sistema completo de paginação integrado ao backend:

**Features:**
- **5 registros por página** (configurável via `size`)
- **Botões de navegação**: Anterior e Próxima
- **Informações visuais**: "Exibindo X de Y autores - Página N de M"
- **Controles inteligentes**: Botões desabilitados nas extremidades
- **Reset automático**: Volta para página 1 ao mudar filtros
- **Performance**: Carrega apenas dados necessários

**Parâmetros API:**
```typescript
{
  page: 0,        // Página atual (zero-based)
  size: 5,        // Registros por página
  sortBy: "name", // Campo de ordenação
  sortDirection: "asc", // Direção (asc/desc)
  status: "ACTIVE",     // Filtro opcional
  name: "Martin"        // Busca opcional
}
```

**Exemplo de Requisição:**
```
GET /api/admin/authors?page=0&size=5&sortBy=name&sortDirection=asc&status=ACTIVE&name=Martin
```

**Resposta do Backend:**
```json
{
  "content": [...],      // Array de autores
  "page": 0,             // Página atual
  "size": 5,             // Tamanho da página
  "totalElements": 23,   // Total de registros
  "totalPages": 5        // Total de páginas
}
```

#### **6. Loading Skeleton**

Placeholders animados durante carregamento:

**Desktop:**
- Skeleton de linhas de tabela
- 5 linhas por padrão

**Mobile:**
- Skeleton de cards
- 5 cards por padrão

#### **7. Estado Vazio**

Tela especial quando não há autores cadastrados:

**Features:**
- Ícone grande de usuários (azul)
- Título: "Nenhum autor encontrado"
- Mensagem contextual (depende se há filtros ativos)
- Botão CTA: "Adicionar Primeiro Autor"
- Design centralizado e convidativo

**Mensagens:**
- Sem filtros: "Comece adicionando o primeiro autor ao catálogo"
- Com filtros: "Tente ajustar os filtros de busca"

#### **8. Ações Inline**

Botões de ação em cada linha/card:

**Editar:**
- Botão azul
- Redireciona para `/admin/authors/{id}/edit`

**Ativar/Desativar:**
- Botão verde (Ativar) ou cinza (Desativar)
- Loading state durante mutação
- Atualização optimistic via React Query
- Toast de confirmação (futuro)

#### **9. Avatar Inteligente**

**Com Foto:**
- Image do Next.js (otimizada)
- Circular, object-cover
- 40x40px (desktop) / 64x64px (mobile)

**Sem Foto:**
- Círculo com inicial do nome
- Cor de fundo: azul claro
- Texto: primeira letra maiúscula

#### **10. Responsividade Completa**

**Mobile (<768px):**
- Sidebar vira drawer (menu hamburger)
- Tabela vira cards
- Filtros empilhados verticalmente
- Botões ocupam largura total

**Tablet (768px-1024px):**
- Sidebar visível
- Tabela compacta
- Filtros em grid 3 colunas

**Desktop (>1024px):**
- Layout completo com sidebar fixa
- Tabela espaçada
- Todos os elementos visíveis

#### **11. Criar Novo Autor** (`/admin/authors/new`)

Página dedicada para cadastro de novos autores com formulário completo.

**Features:**
- ✅ **Formulário validado** com feedback em tempo real
- ✅ **Validação progressiva** (erros aparecem apenas após interação)
- ✅ **Contador de caracteres** para Nome (max 200) e Biografia
- ✅ **Preview de imagem** ao digitar URL da foto
- ✅ **Textos de ajuda neutros** (não intimidantes)
- ✅ **Loading state** no botão "Salvar Autor"
- ✅ **Notificações toast** de sucesso/erro
- ✅ **Redirect automático** para listagem após sucesso
- ✅ **Layout compacto** (~720px, sem scroll vertical excessivo)
- ✅ **Campo de Biografia convidativo** (5 rows, placeholder detalhado)
- ✅ **Botão Cancelar** discreto, "Salvar" como primário

**Campos do Formulário:**
- **Nome** (obrigatório, max 200 caracteres)
- **Biografia** (obrigatório, mínimo 20 caracteres, textarea com 5 linhas)
- **URL da Foto** (opcional, validação de URL, preview ao digitar)

**Validações:**
```typescript
// Frontend
- Nome: required, maxLength: 200
- Biografia: required, minLength: 20
- URL: formato válido (se preenchido)

// Backend (validação completa)
- Formato de URL
- Duplicação de nome
- Regras de negócio específicas
```

**Experiência UX Refinada:**
- ✅ **Erros progressivos**: Só aparecem após usuário tocar no campo (`onBlur`)
- ✅ **Help texts neutros**: "Nome completo do autor", "Mínimo de 20 caracteres"
- ✅ **Biografia convidativa**: Height otimizada + placeholder com exemplo real
- ✅ **Hierarquia visual clara**: Título grande, descrição, campos organizados
- ✅ **Botão primário destacado**: "Salvar Autor" com shadow, "Cancelar" discreto
- ✅ **Layout mobile-first**: Botões empilhados no mobile, lado a lado no desktop

**Integração Backend:**
- Endpoint: `POST /api/admin/authors`
- Hook: `useCreateAuthor()`
- Invalidação automática de cache da listagem

---

#### **12. Editar Autor** (`/admin/authors/[id]/edit`)

Página para edição de autores existentes com formulário pré-preenchido.

**Features:**
- ✅ **Busca automática** dos dados do autor via `useAuthorDetail(id)`
- ✅ **Formulário pré-preenchido** com dados atuais
- ✅ **Mesmas validações** da criação
- ✅ **Campo Status** adicional (Ativo/Inativo)
- ✅ **Botão "Salvar Alterações"** com loading state
- ✅ **Notificações toast** de sucesso/erro
- ✅ **Atualização otimista** via React Query
- ✅ **Redirect automático** para listagem após sucesso
- ✅ **Loading skeleton** enquanto carrega dados
- ✅ **Erro 404** se autor não existir

**Campos do Formulário:**
- Nome (obrigatório)
- Biografia (obrigatório)
- URL da Foto (opcional)
- **Status** (obrigatório: Ativo/Inativo) - Campo adicional

**Diferenças da Criação:**
```diff
+ Campo Status (dropdown: Ativo/Inativo)
+ Botão "Salvar Alterações" em vez de "Salvar Autor"
+ Loading inicial enquanto busca dados do autor
+ Estado de "Autor não encontrado"
```

**Integração Backend:**
- Busca: `GET /api/admin/authors/{id}`
- Atualização: `PUT /api/admin/authors/{id}`
- Hook de busca: `useAuthorDetail(id)`
- Hook de atualização: `useUpdateAuthor()`
- Invalidação automática de cache (listagem + detalhe)

**Fluxo Completo:**
```
1. Admin clica em "Editar" na listagem
2. Redireciona para /admin/authors/{id}/edit
3. useAuthorDetail() busca dados do autor
4. Skeleton exibido durante carregamento
5. Formulário é pré-preenchido
6. Admin edita campos
7. Clica em "Salvar Alterações"
8. useUpdateAuthor() envia PUT ao backend
9. Cache do React Query é atualizado
10. Toast de sucesso aparece
11. Redireciona para /admin/authors
```

---

#### **13. Ativar/Desativar Autor**

Funcionalidade para alterar o status de um autor sem deletá-lo.

**Features:**
- ✅ **Botão toggle** em cada linha da tabela/card
- ✅ **Modal de confirmação** com mensagem contextual
- ✅ **Notificações toast** após sucesso/erro
- ✅ **Atualização otimista** do status
- ✅ **Badge muda de cor** imediatamente (verde ↔ cinza)
- ✅ **Autor inativo fica esmaecido** (`opacity-60`)
- ✅ **Validação de negócio**: Não pode desativar autor com livros ativos
- ✅ **Mensagem de erro** explicativa no modal

**Modal de Confirmação:**
```typescript
// Desativar
title: "Desativar Autor?"
message: "O autor {Nome} será marcado como inativo e não aparecerá mais..."
type: "warning"
buttons: ["Cancelar", "Desativar"]

// Ativar
title: "Ativar Autor?"
message: "O autor {Nome} será marcado como ativo e voltará a aparecer..."
type: "info"
buttons: ["Cancelar", "Ativar"]
```

**Notificações Toast:**
```typescript
// Sucesso ao ativar
toast.success("Autor ativado com sucesso!", {
  icon: "✅"
});

// Sucesso ao desativar
toast.success("Autor desativado com sucesso!", {
  icon: "🚫"
});

// Erro (ex: autor tem livros ativos)
toast.error("Erro ao desativar autor", {
  duration: 4000
});
```

**Validações Backend:**
- ✅ Autor existe?
- ✅ Autor tem livros ativos? (bloqueia desativação)
- ✅ Status é válido? (ACTIVE/INACTIVE)

**Integração:**
- Endpoint: `PUT /api/admin/authors/{id}/status`
- Hook: `useUpdateAuthorStatus()`
- Payload: `{ status: "ACTIVE" | "INACTIVE" }`

**Comportamento Visual:**
```
✅ ATIVO:
- Badge verde com texto "Ativo"
- Linha normal (sem opacidade)
- Botão: "Desativar" (cinza)

🚫 INATIVO:
- Badge cinza com texto "Inativo"
- Linha esmaecida (opacity-60)
- Botão: "Ativar" (verde)
```

---

#### **14. Notificações Toast** (`react-hot-toast`)

Sistema de notificações elegante e não intrusivo para feedback ao usuário.

**Biblioteca:**
- `react-hot-toast` (3KB gzipped)
- Instalação: `npm install react-hot-toast`

**Configuração Global** (`src/app/layout.tsx`):
```tsx
import { Toaster } from "react-hot-toast";

<Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,  // 3 segundos
    style: {
      background: "#fff",
      color: "#363636",
      padding: "16px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    success: {
      iconTheme: {
        primary: "#10b981",  // Verde
        secondary: "#fff",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444",  // Vermelho
        secondary: "#fff",
      },
    },
  }}
/>
```

**Uso nas Páginas:**
```typescript
import toast from "react-hot-toast";

// Sucesso
toast.success("Autor ativado com sucesso!", {
  icon: "✅",
});

// Erro
toast.error("Erro ao desativar autor", {
  duration: 4000,
});

// Carregando
const toastId = toast.loading("Salvando autor...");
// Depois atualizar:
toast.success("Autor criado!", { id: toastId });
```

**Features:**
- ✅ **Posição top-right** (não intrusivo)
- ✅ **Auto-dismiss** após 3 segundos
- ✅ **Hover pause** - pausa ao passar o mouse
- ✅ **Animações suaves** - slide in/out
- ✅ **Empilhamento** - múltiplos toasts organizados
- ✅ **Personalização por tipo** (success, error, loading)
- ✅ **Ícones customizáveis** (✅, 🚫, ❌, etc.)
- ✅ **Acessível** - ARIA announcements
- ✅ **Responsivo** - adapta em mobile

**Casos de Uso Implementados:**
- ✅ Criar autor: "Autor criado com sucesso!"
- ✅ Editar autor: "Autor atualizado com sucesso!"
- ✅ Ativar autor: "Autor ativado com sucesso!" ✅
- ✅ Desativar autor: "Autor desativado com sucesso!" 🚫
- ✅ Erro ao criar: "Erro ao criar autor"
- ✅ Erro ao editar: "Erro ao atualizar autor"
- ✅ Erro ao ativar/desativar: "Erro ao ativar/desativar autor"

---

### **Arquitetura**

```
src/
├── app/
│   ├── layout.tsx            # ✨ Toaster global
│   └── admin/authors/
│       ├── page.tsx          # Listagem + Ativar/Desativar
│       ├── new/
│       │   └── page.tsx      # ✨ Criar novo autor
│       └── [id]/
│           └── edit/
│               └── page.tsx  # ✨ Editar autor
├── components/
│   ├── layout/
│   │   ├── AdminSidebar.tsx  # Sidebar de navegação
│   │   └── Breadcrumb.tsx    # Navegação hierárquica
│   └── ui/
│       ├── Skeleton.tsx      # Loading skeletons
│       └── Modal.tsx         # ✨ Modal de confirmação
├── hooks/
│   └── useAuthors.ts         # ✨ React Query hooks (5 hooks)
├── services/
│   └── authorService.ts      # ✨ API integration (5 métodos)
└── types/
    └── author.ts             # ✨ TypeScript types completos
```

### **Hooks Disponíveis**

O arquivo `src/hooks/useAuthors.ts` exporta **5 hooks React Query** para gerenciamento completo de autores:

#### **1. useAuthors() - Listagem Paginada**

```typescript
import { useAuthors } from "@/hooks";

// Listagem com paginação e filtros
const { data, isLoading, error } = useAuthors({
  page: 0,              // Página atual (zero-based)
  size: 5,              // 5 registros por página
  sortBy: "name",       // Campo de ordenação
  sortDirection: "asc", // Direção: "asc" ou "desc"
  status: "ACTIVE",     // Filtro opcional por status
  name: "Martin"        // Busca opcional por nome
});

// Acessar dados paginados
const authors = data?.content || [];
const totalPages = data ? Math.ceil(data.totalElements / 5) : 0;
const totalAuthors = data?.totalElements || 0;
```

**Features:**
- ✅ Paginação server-side
- ✅ Filtros server-side (status, name)
- ✅ Ordenação server-side (sortBy, sortDirection)
- ✅ Cache inteligente (5 min stale time)
- ✅ Refetch automático ao focar na aba

---

#### **2. useAuthorDetail(id) - Buscar Autor por ID**

```typescript
import { useAuthorDetail } from "@/hooks";

// Buscar autor específico
const { data: author, isLoading, error } = useAuthorDetail(authorId);

if (isLoading) return <Skeleton />;
if (!author) return <NotFound />;

// Usar dados
console.log(author.name);        // Nome do autor
console.log(author.biography);   // Biografia completa
console.log(author.status);      // "ACTIVE" | "INACTIVE"
```

**Usado em:**
- ✅ Formulário de edição (pré-preencher campos)
- ✅ Página de detalhes do autor
- ✅ Preview no modal

---

#### **3. useCreateAuthor() - Criar Novo Autor**

```typescript
import { useCreateAuthor } from "@/hooks";
import toast from "react-hot-toast";

const createAuthor = useCreateAuthor();

const handleSubmit = async (formData: CreateAuthorRequest) => {
  try {
    await createAuthor.mutateAsync(formData);
    toast.success("Autor criado com sucesso!");
    router.push("/admin/authors");
  } catch (error) {
    toast.error("Erro ao criar autor");
  }
};

// Loading state
if (createAuthor.isPending) {
  return <button disabled>Salvando...</button>;
}
```

**Features:**
- ✅ Invalidação automática de cache da listagem
- ✅ Tratamento de erros de validação
- ✅ Loading state
- ✅ TypeScript completo

---

#### **4. useUpdateAuthor() - Editar Autor**

```typescript
import { useUpdateAuthor } from "@/hooks";

const updateAuthor = useUpdateAuthor();

const handleUpdate = async () => {
  await updateAuthor.mutateAsync({
    id: authorId,
    data: {
      name: "Nome Atualizado",
      biography: "Nova biografia...",
      photoUrl: "https://...",
      status: "ACTIVE"
    }
  });
  
  toast.success("Autor atualizado com sucesso!");
};
```

**Features:**
- ✅ Atualização otimista (UI muda antes da resposta)
- ✅ Invalidação de cache (listagem + detalhe)
- ✅ Rollback automático em caso de erro
- ✅ TypeScript completo

---

#### **5. useUpdateAuthorStatus() - Ativar/Desativar**

```typescript
import { useUpdateAuthorStatus } from "@/hooks";

const updateStatus = useUpdateAuthorStatus();

// Ativar ou desativar
const handleToggleStatus = async (author: Author) => {
  const newStatus = author.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  
  try {
    await updateStatus.mutateAsync({
      id: author.id,
      status: newStatus
    });
    
    toast.success(
      newStatus === "ACTIVE" 
        ? "Autor ativado com sucesso!" 
        : "Autor desativado com sucesso!"
    );
  } catch (error) {
    toast.error("Erro ao alterar status");
  }
};

// Loading state por autor
const isUpdating = updateStatus.isPending;
```

**Features:**
- ✅ Atualização otimista
- ✅ Invalidação automática de cache
- ✅ Validação backend (não desativa se houver livros ativos)
- ✅ Feedback de erro explicativo

---

### **Resumo dos Hooks:**

| Hook | Tipo | Uso Principal | Cache |
|------|------|---------------|-------|
| `useAuthors()` | **Query** | Listagem paginada | 5 min |
| `useAuthorDetail(id)` | **Query** | Buscar por ID | 5 min |
| `useCreateAuthor()` | **Mutation** | Criar novo | Invalida lista |
| `useUpdateAuthor()` | **Mutation** | Editar existente | Invalida lista + detalhe |
| `useUpdateAuthorStatus()` | **Mutation** | Ativar/Desativar | Invalida lista + detalhe |

**Query Keys:**
```typescript
queryKeys.authors.all()                    // ['authors']
queryKeys.authors.list(filters)            // ['authors', 'list', { ...filters }]
queryKeys.authors.detail(id)               // ['authors', 'detail', id]
```

**Exemplo Completo (Listagem):**
```typescript
export default function AuthorsPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<AuthorFilterParams>({
    page: 0,
    size: 5,
    sortBy: "name",
    sortDirection: "asc"
  });

  // Buscar autores
  const { data, isLoading } = useAuthors(filters);
  
  // Ativar/Desativar
  const updateStatus = useUpdateAuthorStatus();

  const handleToggleStatus = (author: Author) => {
    const newStatus = author.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateStatus.mutate({ id: author.id, status: newStatus });
  };

  return (
    <div>
      {/* Filtros */}
      {/* Tabela */}
      {/* Paginação */}
    </div>
  );
}
```

### **Componentes Reutilizáveis**

```tsx
// Sidebar (usa em todas as páginas admin)
import AdminSidebar from "@/components/layout/AdminSidebar";

// Breadcrumb
import Breadcrumb from "@/components/layout/Breadcrumb";
<Breadcrumb items={[
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Autores" }
]} />

// Skeletons
import { AuthorCardSkeleton, TableRowSkeleton } from "@/components/ui";
```

### **Performance**

- ✅ **Paginação Server-Side**: Apenas 5 registros carregados por vez
- ✅ **Filtros no Backend**: Reduz tráfego de rede e processamento no cliente
- ✅ **Optimistic Updates**: Status muda instantaneamente (React Query)
- ✅ **Cache Inteligente**: 5 minutos de stale time com invalidação automática
- ✅ **Images Otimizadas**: Next.js Image com lazy loading
- ✅ **Bundle Splitting**: Code splitting automático por rota
- ✅ **Skeleton Loading**: Melhor percepção de performance

### **Segurança**

- ✅ **Proteção de Rota**: Middleware verifica role ADMIN
- ✅ **Auto-logout**: 1h de inatividade
- ✅ **JWT**: Token validado em cada requisição
- ✅ **403**: Página de acesso negado

---

## 🔓 **Logout Seguro**

Sistema completo de logout com confirmação, limpeza total de dados e auto-logout por inatividade.

### **Funcionalidades Implementadas**

#### **1. Logout com Confirmação**

Botão "Sair" no dashboard administrativo com modal de confirmação antes de executar o logout.

**Fluxo:**
1. Usuário clica em "Sair"
2. Modal de confirmação aparece
3. Ao confirmar:
   - Revoga refresh token no backend (API `/auth/revoke`)
   - Limpa Zustand store
   - Limpa localStorage
   - Limpa cookies
   - Invalida cache do React Query
   - Redireciona para `/login`

#### **2. Auto-Logout por Inatividade**

Hook `useAutoLogoutAfterInactivity` que monitora atividade do usuário e faz logout automático após 1 hora de inatividade.

**Eventos monitorados:**
- Mouse (mousedown, click)
- Teclado (keydown)
- Scroll
- Touch (mobile)

**Comportamento:**
- Timer é resetado a cada interação do usuário
- Notificação de aviso 5 minutos antes do logout
- Logout automático após 1 hora sem atividade
- Redirect para `/login?session_expired=true`

#### **3. Sessão Expirada**

Alerta amigável na página de login quando usuário é deslogado por inatividade.

**Features:**
- Ícone de aviso (amarelo)
- Mensagem clara: "Sua sessão foi encerrada por inatividade"
- Design consistente com a identidade visual

#### **4. Limpeza Completa de Dados**

Hook `useLogout` garante que TODOS os dados sensíveis sejam removidos:

✅ **Zustand Store:**
- `accessToken` → `null`
- `refreshToken` → `null`
- `user` → `null`
- `isAuthenticated` → `false`

✅ **LocalStorage:**
- `livraria_tunoda_access_token` → removido
- `livraria_tunoda_refresh_token` → removido
- `livraria_tunoda_user` → removido

✅ **Cookies:**
- `livraria_tunoda_access_token` → removido

✅ **React Query Cache:**
- TODO o cache invalidado via `queryClient.clear()`

✅ **Backend:**
- Refresh token revogado via `POST /api/auth/revoke`

#### **5. Componente Modal Reutilizável**

Componente `Modal` genérico para confirmações e alertas.

**Props:**
- `isOpen` - Controla visibilidade
- `onClose` - Callback ao fechar
- `title` - Título do modal
- `type` - Tipo visual (`info`, `warning`, `error`, `success`)
- `actions` - Botões personalizados
- `closeOnBackdrop` - Se pode fechar clicando fora

**Features:**
- Fecha com tecla ESC
- Previne scroll do body quando aberto
- Backdrop com blur
- Animações suaves
- Totalmente acessível (ARIA)

### **Hooks Disponíveis**

#### **useLogout()**

Hook para logout com limpeza completa.

```typescript
import { useLogout } from "@/hooks";

function LogoutButton() {
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push("/login");
  };

  return (
    <button onClick={handleLogout} disabled={logout.isPending}>
      {logout.isPending ? "Saindo..." : "Sair"}
    </button>
  );
}
```

#### **useAutoLogoutAfterInactivity()**

Hook para auto-logout após 1 hora de inatividade.

```typescript
import { useAutoLogoutAfterInactivity } from "@/hooks/useInactivityLogout";

function AdminLayout({ children }) {
  // Ativa auto-logout por inatividade
  useAutoLogoutAfterInactivity();

  return <div>{children}</div>;
}
```

#### **useInactivityLogout(options)**

Hook completo com opções personalizáveis.

```typescript
import { useInactivityLogout } from "@/hooks/useInactivityLogout";

function ProtectedRoute({ children }) {
  useInactivityLogout({
    timeout: 30 * 60 * 1000, // 30 minutos
    showWarning: true,
    warningTime: 5 * 60 * 1000, // Aviso 5 min antes
  });

  return <div>{children}</div>;
}
```

### **Fluxo Completo de Logout**

```
1. Usuário clica em "Sair" no dashboard
2. Modal de confirmação aparece
3. Usuário confirma logout
4. useLogout hook executa:
   a. Tenta revogar refresh token no backend (POST /auth/revoke)
   b. Se falhar (backend offline), continua com limpeza local
5. authService.logout() limpa:
   - Zustand store (logout())
   - LocalStorage (clearAuthData())
   - Cookies (clearAuthData())
6. React Query cache é invalidado (queryClient.clear())
7. Router redireciona para /login
8. Usuário vê página de login limpa
```

### **Segurança**

✅ **Limpeza sempre acontece**, mesmo se revogação no backend falhar  
✅ **Tokens removidos de todos os locais** (store, localStorage, cookies)  
✅ **Cache limpo** para prevenir acesso a dados em cache  
✅ **Auto-logout** previne sessões abertas indefinidamente  
✅ **Confirmação** previne logout acidental  
✅ **Feedback visual** claro em todas as etapas  

---

## 🛡️ **Proteção de Rotas (Route Protection)**

Sistema de middleware para proteger rotas administrativas e prevenir acesso não autorizado.

### **Implementação**

#### **Middleware** (`src/middleware.ts`)

Middleware do Next.js que executa no Edge Runtime antes de cada requisição.

**Rotas Protegidas:**
- `/admin/**` - Requer autenticação + role `ADMIN`
- `/checkout` - Requer autenticação (futuro)

**Funcionalidades:**
- ✅ **Verificação de JWT** - Valida token antes de permitir acesso
- ✅ **Validação de Role** - Verifica se usuário tem permissão `ADMIN`
- ✅ **Redirect com Query Param** - Preserva URL de destino: `/login?redirect=/admin/books`
- ✅ **Proteção Server-Side** - Executa no servidor (não pode ser bypassado pelo cliente)
- ✅ **Cookies + Headers** - Suporta tokens em cookies e headers Authorization
- ✅ **Página 403** - Exibida quando usuário autenticado não tem permissão

**Fluxo de Proteção:**

```
1. Usuário tenta acessar /admin/dashboard
2. Middleware intercepta a requisição
3. Verifica se há token (cookie ou header)
4. Se NÃO: redireciona para /login?redirect=/admin/dashboard
5. Se SIM: valida token e verifica role ADMIN
6. Se role inválida: redireciona para /403
7. Se tudo OK: permite acesso
```

#### **JWT Utils** (`src/lib/jwt-utils.ts`)

Utilitários para validação de tokens JWT no servidor.

**Funções disponíveis:**
- `decodeJWT(token)` - Decodifica payload sem verificar assinatura
- `isTokenExpired(token)` - Verifica se token está expirado
- `getRoleFromToken(token)` - Extrai role do usuário
- `hasRole(token, role)` - Verifica se usuário tem role específica
- `isValidToken(token)` - Validação completa (estrutura + expiração)

**Nota:** Validação completa de assinatura é feita pelo backend.

#### **Página 403** (`/403`)

Página exibida quando usuário autenticado tenta acessar rota sem permissão.

**Features:**
- ✅ Design consistente com identidade visual
- ✅ Mensagem clara de acesso negado
- ✅ Botões de ação: "Voltar", "Página Inicial", "Fazer Logout"
- ✅ Instruções para contato com administrador

#### **Storage em Cookies**

Tokens agora são salvos em **cookies E localStorage**:

```typescript
// auth-storage.ts
export const saveAccessToken = (token: string): void => {
  // LocalStorage (para React Query, Axios)
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  
  // Cookie (para middleware)
  document.cookie = `livraria_tunoda_access_token=${token}; path=/; max-age=3600; SameSite=Strict`;
};
```

**Benefícios:**
- Middleware pode acessar token via cookies
- React Query/Axios usam localStorage
- Proteção CSRF via SameSite=Strict

#### **Login com Redirect**

Página de login agora suporta query param `?redirect`:

```typescript
// Exemplo: usuário tenta acessar /admin/books sem estar logado
// Middleware redireciona: /login?redirect=/admin/books
// Após login, usuário é redirecionado para /admin/books

const redirectTo = searchParams.get("redirect") || "/admin/dashboard";
router.push(redirectTo); // Após login bem-sucedido
```

### **Configuração do Matcher**

Middleware processa todas as rotas EXCETO:
- `/api/**` - API routes
- `/_next/static/**` - Arquivos estáticos
- `/_next/image/**` - Image optimization
- `/favicon.ico` - Favicon
- `/img/**` - Imagens públicas

### **Testes de Proteção**

Para validar a proteção de rotas:

1. **Acesso sem autenticação:**
   - Tente acessar `http://localhost:3000/admin/dashboard`
   - Deve redirecionar para `/login?redirect=/admin/dashboard`

2. **Login e redirect:**
   - Faça login com credenciais válidas
   - Deve redirecionar automaticamente para `/admin/dashboard`

3. **Acesso direto após login:**
   - Com token válido, acesse `/admin/dashboard`
   - Deve permitir acesso normalmente

4. **Token expirado:**
   - Aguarde expiração do token (1 hora)
   - Acesse rota protegida
   - Deve redirecionar para `/login`

5. **Role inadequada:**
   - (Futuro) Login com usuário `USER` (não `ADMIN`)
   - Tente acessar `/admin/**`
   - Deve redirecionar para `/403`

---

### **Hook: useRateLimit**

Hook customizado para controle de tentativas (rate limiting).

```typescript
const rateLimit = useRateLimit({
  maxAttempts: 5,
  windowMs: 60 * 1000, // 1 minuto
});

// Propriedades disponíveis:
- canAttempt: boolean           // Pode fazer nova tentativa?
- recordAttempt: () => void     // Registra uma tentativa
- remainingAttempts: number     // Tentativas restantes
- resetTimeSeconds: number      // Segundos até poder tentar novamente
- reset: () => void             // Reseta o contador
```

**Uso no Login:**
```typescript
if (!rateLimit.canAttempt) {
  setErrorMessage(`Aguarde ${rateLimit.resetTimeSeconds}s`);
  return;
}

rateLimit.recordAttempt();
// ... fazer login
```

---

## 🗄️ Zustand State Management

O projeto utiliza **Zustand** para gerenciamento de estado global com 3 stores principais.

### **Stores Disponíveis:**

#### **1. useAuthStore** (com persistência)
Gerencia autenticação com JWT tokens.

```typescript
import { useAuthStore, useIsAuthenticated } from "@/store";

// Login
const setAuth = useAuthStore((state) => state.setAuth);
setAuth(accessToken, refreshToken, userData);

// Verificar autenticação (otimizado com selector)
const isAuth = useIsAuthenticated();

// Logout
const logout = useAuthStore((state) => state.logout);
logout();
```

**Estado:** accessToken, refreshToken, user, isAuthenticated  
**Persistência:** ✅ localStorage (chave: `auth-storage`)  
**Devtools:** ✅ Habilitadas (dev only)

#### **2. useCartStore** (temporário)
Carrinho em memória antes de sincronizar com backend.

```typescript
import { useCartStore, useCartItemCount } from "@/store";

// Adicionar item
const addItem = useCartStore((state) => state.addItem);
addItem({ id, title, price, quantity: 1 });

// Badge do carrinho (otimizado)
const count = useCartItemCount();
```

**Estado:** items, total, itemCount  
**Persistência:** ❌ Memória apenas  
**Devtools:** ✅ Habilitadas (dev only)

#### **3. useUIStore** (UI state)
Gerencia modais, sidebar, notificações e loading.

```typescript
import { useUIStore, useNotification } from "@/store";

// Notificações
const notify = useNotification();
notify({ type: "success", message: "Salvo!" });

// Modais
const openModal = useUIStore((state) => state.openModal);
openModal("book-detail", { bookId: "123" });

// Sidebar (mobile)
const toggleSidebar = useUIStore((state) => state.toggleSidebar);
```

**Estado:** modals, notifications, sidebar, loading  
**Persistência:** ❌ Memória apenas  
**Devtools:** ✅ Habilitadas (dev only)

### **Features:**
- ✅ **3 stores** (Auth, Cart, UI)
- ✅ **Persistência** automática (authStore)
- ✅ **Middleware de logging** (dev only)
- ✅ **Devtools** do Zustand
- ✅ **Selectors otimizados** (evita re-renders)
- ✅ **TypeScript completo**
- ✅ **Documentação completa** em `docs/ZUSTAND_STORES.md`

### **Exemplo de Uso com Selectors:**

```typescript
// ❌ Ruim: re-render sempre que qualquer coisa mudar
const { user, isLoading, error } = useAuthStore();

// ✅ Bom: re-render apenas quando userName mudar
const userName = useAuthStore((state) => state.user?.name);

// ✅ Melhor: use helpers pré-definidos
const user = useCurrentUser();
const isAuth = useIsAuthenticated();
const cartCount = useCartItemCount();
```

**Documentação completa**: Ver `docs/ZUSTAND_STORES.md`

---

## 📝 TypeScript Types

O projeto possui **type-safety completo** com tipos que espelham 100% os DTOs do backend Spring Boot.

### **Estrutura Organizada:**

```
src/types/
├── api.ts          # Tipos comuns (paginação, erros, enums)
├── auth.ts         # Autenticação
├── author.ts       # Autores
├── book.ts         # Livros
├── cart.ts         # Carrinho
├── shipping.ts     # Frete
├── order.ts        # Pedidos
├── payment.ts      # Pagamentos
└── index.ts        # Barrel export (importação centralizada)
```

### **Tipos Principais:**

#### **Author & AuthorSummary**
```typescript
interface Author {
  id: string;
  name: string;
  biography: string;
  photoUrl: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt?: string;
}

// Usado em relacionamentos (Book.authors)
interface AuthorSummary {
  id: string;
  name: string;
  photoUrl: string | null;
}
```

#### **Book**
```typescript
interface Book {
  id: string;
  title: string;
  description: string;
  photoUrl: string | null;
  isbn: string | null;
  price: number;
  currency: Currency;        // 'BRL' | 'USD' | 'EUR'
  weight: number;
  weightUnit: WeightUnit;    // 'KG' | 'G'
  stock: number;
  status: ResourceStatus;    // 'ACTIVE' | 'INACTIVE'
  authors: AuthorSummary[];
  createdAt: string;
  updatedAt?: string;
}
```

#### **Request DTOs**
```typescript
interface CreateBookRequest {
  title: string;
  description: string;
  photoUrl?: string;
  isbn?: string;
  price: number;
  currency?: Currency;
  weight: number;
  weightUnit?: WeightUnit;
  authorIds: string[];
}
```

### **Enums Disponíveis:**

| Enum | Valores | Uso |
|------|---------|-----|
| `ResourceStatus` | `"ACTIVE"` \| `"INACTIVE"` | Status de recursos |
| `Currency` | `"BRL"` \| `"USD"` \| `"EUR"` | Moedas suportadas |
| `WeightUnit` | `"KG"` \| `"G"` | Unidades de peso |
| `StockOperation` | `"ADD"` \| `"REMOVE"` \| `"SET"` | Operações de estoque |
| `MetricEventType` | `"VIEW"` \| `"CLICK"` | Eventos de métrica |
| `OrderStatus` | `"PENDING_PAYMENT"` \| `"PAID"` \| ... | Status de pedidos |
| `PaymentStatus` | `"PENDING"` \| `"APPROVED"` \| ... | Status de pagamento |
| `PaymentMethod` | `"CREDIT_CARD"` \| `"PIX"` \| ... | Métodos de pagamento |

### **Barrel Export (Importação Simplificada):**

```typescript
// ❌ Antes (imports verbosos)
import { Book } from "@/types/book";
import { Author } from "@/types/author";
import { PaginatedResponse } from "@/types/api";

// ✅ Depois (import único)
import { Book, Author, PaginatedResponse } from "@/types";
```

### **Exemplo de Uso:**

```typescript
import {
  Book,
  CreateBookRequest,
  Currency,
  WeightUnit,
  ResourceStatus,
} from "@/types";

const newBook: CreateBookRequest = {
  title: "Caminho da Esperança",
  description: "Uma jornada inspiradora...",
  price: 45.90,
  currency: "BRL",      // ✅ Tipado
  weight: 300,
  weightUnit: "G",      // ✅ Tipado
  stock: 100,
  authorIds: ["author-id-123"]
};
```

### **Features:**
- ✅ **50+ interfaces** documentadas
- ✅ **15+ enums/types** para type-safety
- ✅ **Zero `any`** no código (100% tipado)
- ✅ **JSDoc completo** em todos os tipos
- ✅ **Espelha backend** Spring Boot 1:1
- ✅ **Barrel export** para imports limpos
- ✅ **Organização modular** (8 arquivos por domínio)

---

## 🔌 API Integration (Backend Spring Boot)

### **API Client Configurado**

O projeto possui uma camada completa de serviços para comunicação com o backend Spring Boot.

#### **Features do API Client:**

- ✅ **Axios configurado** com baseURL e timeout
- ✅ **Interceptors de request** (adiciona JWT automaticamente)
- ✅ **Interceptors de response** (tratamento de erros global)
- ✅ **Refresh token automático** quando access token expira
- ✅ **Retry logic** para erros de rede
- ✅ **Correlation ID** para rastreamento de requisições
- ✅ **Helpers** para extrair mensagens de erro e validações

#### **Services Disponíveis:**

| Service | Endpoints | Descrição |
|---------|-----------|-----------|
| `authService` | `/auth/login`, `/auth/refresh`, `/user/me` | Autenticação e usuário |
| `authorService` | `/admin/authors/*` | CRUD de autores (ADMIN) |
| `bookService` | `/public/books/*`, `/admin/books/*` | Livros (público + ADMIN) |
| `cartService` | `/carts/*` | Carrinho de compras (inclui validação de estoque) |
| `cepService` | `/public/cep/{cep}` | Consulta de endereço por CEP |
| `shippingService` | `/shipping/quotes/*` | Cálculo de frete |
| `orderService` | `/orders/*`, `/admin/orders/*` | Pedidos |
| `paymentService` | `/payments/*`, `/orders/{id}/payments` | Pagamentos (Mercado Pago) |

**Carrinho - validação de estoque:** `POST /carts/{cartId}/validate`
**Carrinho - checkout:** `POST /carts/checkout`
**Carrinho - limpar:** `DELETE /carts/{cartId}/clear`

**Pagamentos:** `POST /orders/{id}/payments`, `POST /payments/{id}/process`, `GET /payments/{id}`

**Frete:** `POST /shipping/quotes`, `POST /shipping/quotes/{id}/calculate`, `PUT /shipping/quotes/{id}/select`

#### **Exemplo de Uso:**

```typescript
import { bookService } from "@/services/bookService";
import { authService } from "@/services/authService";

// Buscar livros (público, sem autenticação)
const books = await bookService.listPublic({ page: 0, size: 10 });

// Login
const auth = await authService.login({
  email: "admin@example.com",
  password: "senha123"
});

// Criar livro (ADMIN, JWT automático)
const newBook = await bookService.create({
  title: "Caminho da Esperança",
  description: "Uma jornada inspiradora...",
  price: 45.90,
  stock: 100,
  weight: 300,
  authorIds: ["author-id-123"]
});
```

#### **Fluxo de Pagamento (Mercado Pago)**

1. Criar pedido via `POST /carts/checkout`
2. Criar pagamento via `POST /orders/{id}/payments` (method: `PIX` ou `CREDIT_CARD`)
3. Processar pagamento via `POST /payments/{id}/process` (gera `paymentUrl`)
4. Webhook atualiza status do pedido/pagamento
5. Frontend acompanha status em tempo real e exibe `/pedido/[id]/confirmacao`
```

#### **Configuração de Ambiente:**

Crie um arquivo `.env.local` baseado em `.env.local.example`:

```bash
# URL do backend Spring Boot
NEXT_PUBLIC_API_URL="http://localhost:8080/api"

# Outras configurações...
```

#### **Tratamento de Erros:**

```typescript
import { getErrorMessage, isValidationError } from "@/lib/api-client";

try {
  await bookService.create(data);
} catch (error) {
  if (isValidationError(error)) {
    // Erro 422: validação de campos
    console.error("Erros de validação:", getValidationErrors(error));
  } else {
    // Outros erros
    console.error("Erro:", getErrorMessage(error));
  }
}
```

#### **Autenticação:**

- **Access Token**: Adicionado automaticamente no header `Authorization: Bearer <token>`
- **Refresh Token**: Renovação automática quando access token expira (401)
- **Storage**: Tokens salvos no `localStorage` via `auth-storage.ts`
- **Logout**: Limpa todos os tokens e redireciona para `/login`

#### **TypeScript Full Support:**

Todos os services possuem tipos completos:

- ✅ Requests tipados
- ✅ Responses tipados
- ✅ Erros tipados
- ✅ JSDoc completo
- ✅ Autocomplete total no VSCode/Cursor

## 🎯 Diferenciais do Projeto

### **Autenticidade**

- História real do Pastor Iraquitan Tunoda
- Experiência missionária no Japão
- Fotos autênticas
- Valores cristãos genuínos

### **Experiência do Usuário**

- Navegação intuitiva
- Feedback visual imediato
- Animações sutis e elegantes
- Design emocional inspirador

### **Funcionalidade Completa**

- Carrinho de compras funcional
- Múltiplas páginas integradas
- Estado persistente
- Pronto para pagamento

### **Código Profissional**

- TypeScript completo
- Context API para estado global
- Componentes reutilizáveis
- Arquitetura escalável

## 🔮 Próximos Passos

### ✅ **Já Implementado:**

#### **🏗️ Fundação & Arquitetura:**
- ✅ **Next.js 16** com App Router + Turbopack
- ✅ **TypeScript 5** - Strict mode, zero `any`, 50+ interfaces
- ✅ **Tailwind CSS 4** - Design system cristão completo
- ✅ **API Integration completa** (Spring Boot REST API)
- ✅ **Services layer** (7 services: auth, author, book, cart, shipping, order, payment)
- ✅ **API Client** (Axios + interceptors, refresh token automático)
- ✅ **React Query** (cache inteligente, mutations, optimistic updates)
- ✅ **Zustand Stores** (Auth, Cart, UI com persistência localStorage)
- ✅ **TypeScript Types** (50+ interfaces, enums, barrel export)

#### **🔐 Autenticação & Segurança:**
- ✅ **Login JWT** (access token + refresh token)
- ✅ **Página de Login** (validação, rate limiting, loading states)
- ✅ **Proteção de Rotas** (middleware server-side, role check, página 403)
- ✅ **Logout Seguro** (confirmação modal, limpeza total, revogação backend)
- ✅ **Auto-logout** por inatividade (1h, com aviso 5 min antes)
- ✅ **JWT Storage** (localStorage + cookies para middleware)
- ✅ **Rate Limiting** (5 tentativas/min no login)

#### **📊 Dashboard Administrativo:**
- ✅ **Métricas em Tempo Real**:
  - Total de Livros Cadastrados
  - Total de Autores Cadastrados
  - Livros com Estoque Baixo (alerta refinado)
  - Top 5 Livros Mais Visualizados
  - Top 5 Livros Mais Clicados
- ✅ **Loading Skeletons** em todos os cards/tabelas
- ✅ **Responsive Design** (mobile, tablet, desktop)
- ✅ **Cache Inteligente** (React Query, 2-5 min stale time)

#### **👥 Gestão de Autores (CRUD Completo):**
- ✅ **Listagem Paginada**:
  - Paginação server-side (5 registros/página)
  - Filtros server-side (status, nome)
  - Ordenação server-side (nome: A-Z, Z-A)
  - Busca em tempo real
  - Loading skeletons
  - Estado vazio com CTA
  - Responsivo (tabela desktop, cards mobile)
  
- ✅ **Criar Autor** (`/admin/authors/new`):
  - Formulário validado (nome, biografia, foto URL)
  - Validação progressiva (erros após interação)
  - Preview de imagem ao digitar URL
  - Contador de caracteres
  - Help texts neutros
  - Layout compacto (~720px, sem scroll excessivo)
  - Toast de sucesso/erro
  - Redirect após criação

- ✅ **Editar Autor** (`/admin/authors/[id]/edit`):
  - Formulário pré-preenchido
  - Busca automática de dados
  - Campo Status adicional (Ativo/Inativo)
  - Mesmas validações da criação
  - Atualização otimista
  - Toast de sucesso/erro
  - Redirect após edição

- ✅ **Ativar/Desativar Autor**:
  - Modal de confirmação contextual
  - Toast de feedback (✅ ativar, 🚫 desativar)
  - Atualização otimista (badge muda instantaneamente)
  - Linha esmaecida para autores inativos
  - Validação backend (não desativa se houver livros ativos)
  - Mensagem de erro explicativa

#### **🔔 Sistema de Notificações:**
- ✅ **React Hot Toast** integrado globalmente
- ✅ **Posição top-right** (não intrusivo)
- ✅ **Auto-dismiss** após 3 segundos
- ✅ **Hover pause** - pausa ao passar o mouse
- ✅ **Animações suaves** - slide in/out
- ✅ **Ícones personalizados** (✅, 🚫, ❌, etc.)
- ✅ **Tipos coloridos** (success verde, error vermelho)
- ✅ **Acessível** (ARIA announcements)

#### **🎨 Componentes & UI:**
- ✅ **AdminSidebar** - Navegação lateral responsiva
- ✅ **Breadcrumb** - Navegação hierárquica
- ✅ **Modal** - Confirmações reutilizável (4 tipos)
- ✅ **Skeleton** - Loading states elegantes
- ✅ **Button** - Botão reutilizável com variants
- ✅ **Toaster** - Notificações globais

#### **🚀 Hooks Personalizados:**
- ✅ **useAuth** (login, logout, isAuthenticated, hasRole)
- ✅ **useAuthors** (list, detail, create, update, updateStatus) - 5 hooks
- ✅ **useDashboard** (stats, mostViewed, mostClicked, lowStock)
- ✅ **useRateLimit** (controle de tentativas)
- ✅ **useInactivityLogout** (auto-logout por inatividade)

#### **🐛 Correções & Refinamentos:**
- ✅ **Botão "Entrar"** - Visível com cores corretas
- ✅ **Redirect após login** - Zustand atualizado corretamente
- ✅ **Scroll horizontal** - Removido no desktop
- ✅ **Conteúdo mobile** - Seção "Sobre" visível
- ✅ **Menu ativo** - Sidebar destaca página atual
- ✅ **Grid de autores** - Colunas alinhadas corretamente
- ✅ **Avatar placeholder** - Ícone SVG quando sem foto
- ✅ **Top Books** - Estrutura de dados correta (`totalMetrics`)
- ✅ **Alerta de estoque** - Visual refinado (menos agressivo)
- ✅ **Layout de formulário** - Compacto, sem scroll excessivo
- ✅ **Validação de status** - Campo status enviado no PUT

### 🚀 **Próximas Implementações:**

- [ ] **Proteção de /checkout** (auth opcional + dados do cliente persistidos)
- [ ] **CRUD de livros (ADMIN)** completo
- [ ] **Testes E2E de carrinho/checkout**
- [ ] Newsletter/email marketing
- [ ] Blog integrado
- [ ] Sistema de avaliações

---

**Status**: ✅ **Projeto 100% funcional e profissional**

Uma página de vendas completa que honra a trajetória do Pastor Iraquitan Tunoda como missionário no Japão, oferecendo uma experiência de compra moderna e inspiradora para seus livros cristãos.

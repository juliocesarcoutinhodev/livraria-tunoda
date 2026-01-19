# Zustand Stores - Documentação Completa

Este documento detalha todos os Zustand stores do projeto, seus estados, ações e exemplos de uso.

## 📦 Stores Disponíveis

1. **useAuthStore** - Autenticação (com persistência)
2. **useCartStore** - Carrinho temporário
3. **useUIStore** - Estado de UI (modais, sidebar, notificações)

---

## 🔐 useAuthStore

**Arquivo**: `src/store/useAuthStore.ts`  
**Persistência**: ✅ Sim (localStorage)  
**Devtools**: ✅ Habilitadas (dev)  
**Logger**: ✅ Habilitado (dev)

### Estado

```typescript
interface AuthState {
  accessToken: string | null;        // JWT access token
  refreshToken: string | null;       // JWT refresh token
  user: User | null;                 // Dados do usuário
  isAuthenticated: boolean;          // Flag de autenticação
}
```

### Ações

| Ação | Parâmetros | Descrição |
|------|-----------|-----------|
| `setAuth` | `(accessToken, refreshToken, user)` | Define dados de autenticação após login |
| `setAccessToken` | `(accessToken)` | Atualiza apenas o access token (refresh) |
| `setUser` | `(user)` | Atualiza dados do usuário |
| `logout` | `()` | Limpa todos os dados de autenticação |
| `hasRole` | `(requiredRole)` | Verifica se usuário tem role específica |

### Exemplos de Uso

#### Login

```tsx
import { useAuthStore } from "@/store";

function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (credentials) => {
    const response = await authService.login(credentials);
    setAuth(response.accessToken, response.refreshToken, response.user);
    router.push("/dashboard");
  };

  return <form onSubmit={handleLogin}>{/* ... */}</form>;
}
```

#### Verificar Autenticação (com selector)

```tsx
import { useIsAuthenticated } from "@/store";

function ProtectedRoute({ children }) {
  const isAuth = useIsAuthenticated(); // ✅ Selector otimizado

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

#### Exibir Nome do Usuário

```tsx
import { useAuthStore, authSelectors } from "@/store";

function UserProfile() {
  // ✅ Usa selector para evitar re-renders desnecessários
  const userName = useAuthStore(authSelectors.userName);

  return <p>Olá, {userName}!</p>;
}
```

#### Verificar Role

```tsx
import { useAuthStore } from "@/store";

function AdminPanel() {
  const hasRole = useAuthStore((state) => state.hasRole);

  if (!hasRole("ROLE_ADMIN")) {
    return <p>Acesso negado</p>;
  }

  return <AdminDashboard />;
}
```

#### Logout

```tsx
import { useAuthStore } from "@/store";

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return <button onClick={handleLogout}>Sair</button>;
}
```

### Persistência

Os seguintes dados são persistidos no localStorage:
- `accessToken`
- `refreshToken`
- `user`
- `isAuthenticated`

**Chave no localStorage**: `auth-storage`

---

## 🛒 useCartStore

**Arquivo**: `src/store/useCartStore.ts`  
**Persistência**: ❌ Não (em memória)  
**Devtools**: ✅ Habilitadas (dev)  
**Logger**: ✅ Habilitado (dev)

### Estado

```typescript
interface CartState {
  items: CartItem[];      // Lista de itens
  total: number;          // Total do carrinho
  itemCount: number;      // Total de itens (soma quantidades)
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  author?: string;
}
```

### Ações

| Ação | Parâmetros | Descrição |
|------|-----------|-----------|
| `addItem` | `(item)` | Adiciona item (incrementa se já existe) |
| `removeItem` | `(id)` | Remove item do carrinho |
| `updateQuantity` | `(id, quantity)` | Atualiza quantidade (0 = remove) |
| `clearCart` | `()` | Limpa todo o carrinho |
| `calculateTotal` | `()` | Recalcula totais |

### Exemplos de Uso

#### Adicionar ao Carrinho

```tsx
import { useCartStore } from "@/store";

function AddToCartButton({ book }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      quantity: 1,
      image: book.photoUrl,
      author: book.authorsNames
    });
    toast.success("Livro adicionado ao carrinho!");
  };

  return (
    <button onClick={handleAdd}>
      Adicionar ao carrinho
    </button>
  );
}
```

#### Badge do Carrinho (com selector)

```tsx
import { useCartItemCount } from "@/store";

function CartBadge() {
  const count = useCartItemCount(); // ✅ Selector otimizado

  if (count === 0) return null;

  return (
    <span className="badge">{count}</span>
  );
}
```

#### Listar Itens do Carrinho

```tsx
import { useCartStore, cartSelectors } from "@/store";

function CartPage() {
  const items = useCartStore(cartSelectors.items);
  const total = useCartStore(cartSelectors.total);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>R$ {item.price}</p>
          <input 
            type="number" 
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, +e.target.value)}
          />
          <button onClick={() => removeItem(item.id)}>Remover</button>
        </div>
      ))}
      <p>Total: R$ {total.toFixed(2)}</p>
    </div>
  );
}
```

#### Verificar Carrinho Vazio

```tsx
import { useIsCartEmpty } from "@/store";

function CartPage() {
  const isEmpty = useIsCartEmpty();

  if (isEmpty) {
    return <EmptyCartMessage />;
  }

  return <CartItems />;
}
```

---

## 🎨 useUIStore

**Arquivo**: `src/store/useUIStore.ts`  
**Persistência**: ❌ Não (em memória)  
**Devtools**: ✅ Habilitadas (dev)  
**Logger**: ✅ Habilitado (dev)

### Estado

```typescript
interface UIState {
  isSidebarOpen: boolean;           // Sidebar aberta (mobile)
  currentModal: ModalType | null;   // Modal atual aberto
  modalData: unknown;               // Dados do modal
  notifications: Notification[];    // Lista de notificações
  isLoading: boolean;               // Loading global
  loadingMessage?: string;          // Mensagem de loading
}

type ModalType = "login" | "register" | "forgot-password" | "confirm" 
  | "book-detail" | "checkout" | null;

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number | null;
  createdAt: number;
}
```

### Ações

#### Sidebar

| Ação | Descrição |
|------|-----------|
| `openSidebar()` | Abre sidebar |
| `closeSidebar()` | Fecha sidebar |
| `toggleSidebar()` | Toggle sidebar |

#### Modal

| Ação | Descrição |
|------|-----------|
| `openModal(modal, data?)` | Abre modal com dados opcionais |
| `closeModal()` | Fecha modal atual |

#### Notificações

| Ação | Descrição |
|------|-----------|
| `addNotification(notif)` | Adiciona notificação (retorna ID) |
| `removeNotification(id)` | Remove notificação específica |
| `clearNotifications()` | Limpa todas |

#### Loading

| Ação | Descrição |
|------|-----------|
| `setLoading(isLoading, message?)` | Define loading global |

### Exemplos de Uso

#### Sidebar Mobile

```tsx
import { useUIStore } from "@/store";

function MobileMenu() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <button onClick={toggleSidebar}>
      {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
    </button>
  );
}

function Sidebar() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  if (!isSidebarOpen) return null;

  return (
    <div className="sidebar" onClick={closeSidebar}>
      {/* sidebar content */}
    </div>
  );
}
```

#### Modais

```tsx
import { useUIStore } from "@/store";

function BookCard({ book }) {
  const openModal = useUIStore((state) => state.openModal);

  const handleClick = () => {
    openModal("book-detail", { bookId: book.id });
  };

  return (
    <button onClick={handleClick}>Ver detalhes</button>
  );
}

function ModalManager() {
  const { currentModal, modalData, closeModal } = useUIStore();

  if (!currentModal) return null;

  return (
    <Modal onClose={closeModal}>
      {currentModal === "book-detail" && <BookDetailModal data={modalData} />}
      {currentModal === "login" && <LoginModal />}
      {currentModal === "checkout" && <CheckoutModal />}
    </Modal>
  );
}
```

#### Notificações (Toast)

```tsx
import { useNotification } from "@/store";

function SaveButton() {
  const notify = useNotification();

  const handleSave = async () => {
    try {
      await save();
      notify({
        type: "success",
        message: "Salvo com sucesso!",
        duration: 3000
      });
    } catch (error) {
      notify({
        type: "error",
        title: "Erro",
        message: "Falha ao salvar",
        duration: 5000
      });
    }
  };

  return <button onClick={handleSave}>Salvar</button>;
}
```

#### Exibir Notificações

```tsx
import { useUIStore, uiSelectors } from "@/store";

function Notifications() {
  const notifications = useUIStore(uiSelectors.notifications);
  const removeNotification = useUIStore((state) => state.removeNotification);

  return (
    <div className="notifications-container">
      {notifications.map(notif => (
        <div key={notif.id} className={`notification notification-${notif.type}`}>
          {notif.title && <h4>{notif.title}</h4>}
          <p>{notif.message}</p>
          <button onClick={() => removeNotification(notif.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
```

#### Loading Global

```tsx
import { useUIStore } from "@/store";

function LogoutButton() {
  const setLoading = useUIStore((state) => state.setLoading);

  const handleLogout = async () => {
    setLoading(true, "Saindo...");
    await logout();
    setLoading(false);
    router.push("/");
  };

  return <button onClick={handleLogout}>Sair</button>;
}

function GlobalLoading() {
  const { isLoading, loadingMessage } = useUIStore();

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <Spinner />
      {loadingMessage && <p>{loadingMessage}</p>}
    </div>
  );
}
```

---

## 🔧 Middleware

### Logger (dev only)

**Arquivo**: `src/store/middleware/logger.ts`

Loga todas as mudanças de estado no console em desenvolvimento.

```typescript
import { logger } from "@/store/middleware/logger";

const myStore = create(
  logger(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }))
    }),
    "MyStore" // Nome para identificação nos logs
  )
);
```

**Output no console (dev):**
```
🔄 MyStore Update
  Previous State: { count: 0 }
  Next State: { count: 1 }
  Action: { count: 1 }
```

---

## 🎯 Boas Práticas

### 1. Use Selectors para Evitar Re-renders

❌ **Ruim** (re-render desnecessário):
```tsx
function Component() {
  const { user, isLoading, error } = useAuthStore(); // Re-render sempre que QUALQUER coisa mudar
  return <p>{user?.name}</p>;
}
```

✅ **Bom** (re-render apenas quando name mudar):
```tsx
function Component() {
  const userName = useAuthStore((state) => state.user?.name); // Selector
  return <p>{userName}</p>;
}
```

### 2. Use Helpers Pré-definidos

✅ **Melhor ainda**:
```tsx
import { useCurrentUser } from "@/store";

function Component() {
  const user = useCurrentUser(); // Helper otimizado
  return <p>{user?.name}</p>;
}
```

### 3. Divida Estados Complexos

❌ **Ruim**:
```tsx
const { user, isLoading, items, total, isSidebarOpen } = useMultipleStores();
```

✅ **Bom**:
```tsx
const user = useAuthStore(authSelectors.user);
const items = useCartStore(cartSelectors.items);
const isSidebarOpen = useUIStore(uiSelectors.isSidebarOpen);
```

### 4. Persistência Consciente

- ✅ **Persista**: Auth, preferências do usuário
- ❌ **Não persista**: UI state (modais, notificações), dados temporários

---

## 🔍 Devtools

### Habilitar React Devtools para Zustand

As devtools estão habilitadas automaticamente em desenvolvimento.

**Extensão**: [Redux DevTools](https://github.com/reduxjs/redux-devtools)

**No browser**:
1. Abra Redux DevTools
2. Selecione store: `AuthStore`, `CartStore` ou `UIStore`
3. Visualize state, actions e timeline

---

## 📚 Referências

- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Zustand Persist Middleware](https://github.com/pmndrs/zustand#persist-middleware)
- [Zustand Devtools](https://github.com/pmndrs/zustand#redux-devtools)

---

## 🚀 Migração

### De Context API para Zustand

Se você ainda usa `CartContext`, pode migrar gradualmente:

1. **Mantenha ambos** funcionando
2. **Crie componentes novos** com Zustand
3. **Migre componentes antigos** aos poucos
4. **Remova Context API** quando tudo estiver migrado

### De auth-storage.ts para useAuthStore

O `auth-storage.ts` ainda funciona. Para migrar:

```tsx
// Antes
import { saveAuthData, getAccessToken } from "@/lib/auth-storage";

// Depois
import { useAuthStore } from "@/store";

const setAuth = useAuthStore((state) => state.setAuth);
const accessToken = useAuthStore((state) => state.accessToken);
```

---

**Status**: ✅ Todos os stores implementados e documentados!

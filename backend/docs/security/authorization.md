# Autorização

Controle de acesso baseado em roles (RBAC).

## Roles

### ADMIN

Administrador completo do sistema.

**Permissões:**
- Criar, editar, excluir livros e autores
- Visualizar todos os pedidos
- Acessar métricas e monitoramento
- Gerenciar outros usuários (futuro)

### USER (Futuro)

Cliente comum.

**Permissões:**
- Visualizar catálogo
- Criar carrinho e pedidos
- Visualizar próprios pedidos

## Configuração de Endpoints

```java
// Público
/api/auth/**           → permitAll()
/api/public/**         → permitAll()
/api/webhooks/**       → permitAll()

// Autenticado
/api/user/**           → authenticated()

// Admin
/api/admin/**          → hasRole("ADMIN")

// Actuator
/api/v1/actuator/health              → permitAll()
/api/v1/actuator/** (local/dev)      → permitAll()
/api/v1/actuator/** (staging)        → authenticated()
/api/v1/actuator/** (prod)           → hasRole("ADMIN")
```

## Spring Security

### SecurityFilterChain

```java
http
  .authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/user/**").authenticated()
    .anyRequest().denyAll()
  )
```

### Filtros

1. `JwtAuthenticationFilter` - Valida JWT
2. `AuthorizationFilter` - Verifica permissões

## Verificação de Role

### No Controller

```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/api/admin/books")
public ResponseEntity<BookResponse> create(...) {
  //...
}
```

### Programaticamente

```java
Authentication auth = SecurityContextHolder
  .getContext()
  .getAuthentication();
  
if (auth.getAuthorities().stream()
    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
  // É admin
}
```

## Respostas

### 401 Unauthorized

Quando não está autenticado:

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Autenticação necessária. Por favor, faça login."
}
```

### 403 Forbidden

Quando está autenticado mas sem permissão:

```json
{
  "status": 403,
  "error": "Forbidden",
  "message": "Acesso negado. Permissões insuficientes."
}
```

## Expansão de Roles (Futuro)

### MANAGER
- Visualizar relatórios
- Gerenciar estoque
- Processar pedidos

### OPERATOR
- Processar pedidos
- Atualizar status de envio

### VIEWER
- Apenas visualização
- Sem edição

## Referências

- [Autenticação](authentication.md)
- [Usuários Domain](../domain/users.md)

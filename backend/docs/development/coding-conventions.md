# Convenções de Código

Padrões de código e boas práticas do projeto.

## Nomenclatura

### Classes

```java
// PascalCase
public class CreateBookUseCase { }
public class BookEntity { }
public class BookResponse { }
```

### Métodos e Variáveis

```java
// camelCase
public Book create(String title) { }
private String bookTitle;
```

### Constantes

```java
// UPPER_SNAKE_CASE
public static final int MAX_RETRY_ATTEMPTS = 3;
```

### Packages

```java
// lowercase, sem underscore
br.com.iraquitantunoda.livrariatunoda.domain.model
```

## Línguas

- **Código:** Inglês
- **Mensagens API:** Português
- **Comentários:** Inglês
- **Logs:** Português
- **Docs:** Português

```java
// ✅ Correto
public class CreateBookUseCase {
    public Book execute(CreateBookCommand command) {
        log.info("Criando livro com título: {}", command.getTitle());
        // ...
    }
}

// ❌ Errado
public class CriarLivroUseCase {
    public Livro executar(CriarLivroComando comando) {
        log.info("Creating book with title: {}", comando.getTitulo());
        // ...
    }
}
```

## Princípios SOLID

### Single Responsibility

Uma classe, uma responsabilidade.

```java
// ✅ Correto
public class CreateBookUseCase { }
public class UpdateBookUseCase { }

// ❌ Errado
public class BookService {
    public void create() { }
    public void update() { }
    public void delete() { }
}
```

### Open/Closed

Aberto para extensão, fechado para modificação.

### Liskov Substitution

Subclasses devem ser substituíveis por suas superclasses.

### Interface Segregation

Interfaces específicas melhor que genéricas.

### Dependency Inversion

Dependa de abstrações, não de implementações.

## Clean Code

### Métodos Pequenos

```java
// ✅ Preferir métodos pequenos
public Book create(CreateBookCommand command) {
    validateCommand(command);
    Book book = buildBook(command);
    return repository.save(book);
}

private void validateCommand(CreateBookCommand command) {
    // validações
}

private Book buildBook(CreateBookCommand command) {
    // construção
}
```

### Nomes Descritivos

```java
// ✅ Correto
public List<Book> findActiveBooksByAuthor(AuthorId authorId) { }

// ❌ Evitar
public List<Book> find(String id) { }
public List<Book> get() { }
```

### Evitar Magic Numbers

```java
// ✅ Correto
private static final int DEFAULT_PAGE_SIZE = 10;
private static final int JWT_EXPIRATION_HOURS = 1;

// ❌ Evitar
pageable = PageRequest.of(0, 10);
jwt.setExpiration(3600);
```

## Estrutura de Classe

```java
public class MyClass {
    // 1. Constantes
    private static final int MAX_SIZE = 100;
    
    // 2. Atributos
    private final MyDependency dependency;
    
    // 3. Construtores
    public MyClass(MyDependency dependency) {
        this.dependency = dependency;
    }
    
    // 4. Métodos públicos
    public void publicMethod() { }
    
    // 5. Métodos privados
    private void privateMethod() { }
}
```

## Annotations

### Ordem

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class MyService {
    @Autowired
    private final MyRepository repository;
    
    @Transactional
    @Override
    public void method() { }
}
```

## Exceções

```java
// ✅ Preferir exceções específicas
throw new ResourceNotFoundException("Livro não encontrado");

// ❌ Evitar genéricas
throw new Exception("Erro");
```

## Logs

```java
// ✅ Correto
log.info("Criando livro: {}", title);
log.warn("Estoque baixo para livro: {}", bookId);
log.error("Falha ao processar pagamento: {}", orderId, exception);

// ❌ Evitar
log.info("Criando livro: " + title);  // concatenação
System.out.println("Debug");           // sysout
```

## Testes

### Nomenclatura

```java
// Given_When_Then
@Test
void givenValidBook_whenCreate_thenReturnCreatedBook() { }

// should_ExpectedBehavior_When_StateUnderTest
@Test
void shouldReturnBook_whenBookExists() { }
```

### Estrutura

```java
@Test
void testName() {
    // Given (Arrange)
    Book book = Book.create(...);
    
    // When (Act)
    Book result = useCase.execute(book);
    
    // Then (Assert)
    assertThat(result).isNotNull();
    assertThat(result.getTitle()).isEqualTo("Expected");
}
```

## Formatação

- **Indentação:** 4 espaços
- **Linha máxima:** 120 caracteres
- **Encoding:** UTF-8

## Lombok

```java
@Getter
@RequiredArgsConstructor
@Slf4j
public class MyClass {
    private final String name;
}
```

Usar onde apropriado, evitar `@Data`.

## Referências

- [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Effective Java - Joshua Bloch](https://www.amazon.com/Effective-Java-Joshua-Bloch/dp/0134685997)

# Testes

Estratégia de testes do projeto.

## Estrutura

```
src/test/java/
└── br/com/iraquitantunoda/livrariatunoda/
    ├── domain/          # Testes de domínio
    ├── application/     # Testes de casos de uso
    └── infrastructure/  # Testes de integração
```

## Tipos de Testes

### Testes Unitários

Testam lógica isolada (domain, use cases).

```java
@Test
void givenValidData_whenCreateBook_thenReturnBook() {
    // Given
    String title = "Dom Casmurro";
    Money price = Money.brl(new BigDecimal("45.90"));
    
    // When
    Book book = Book.create(title, description, price, ...);
    
    // Then
    assertThat(book.getTitle()).isEqualTo(title);
    assertThat(book.getPrice()).isEqualTo(price);
}
```

### Testes de Integração

Testam integração com banco, APIs externas.

```java
@SpringBootTest
@Transactional
class BookRepositoryAdapterTest {
    @Autowired
    private BookRepositoryAdapter repository;
    
    @Test
    void shouldSaveAndRetrieveBook() {
        // ...
    }
}
```

## Ferramentas

- **JUnit 5** - Framework de testes
- **AssertJ** - Assertions fluentes
- **Mockito** - Mocks
- **H2** - Banco em memória para testes

## Convenções

### Nomenclatura

```
given[State]_when[Action]_then[Outcome]
```

ou

```
should[ExpectedBehavior]_when[StateUnderTest]
```

### Estrutura (AAA)

```java
@Test
void testName() {
    // Arrange (Given)
    // Preparação
    
    // Act (When)
    // Ação
    
    // Assert (Then)
    // Verificação
}
```

## Cobertura

Meta: 80% de cobertura.

```bash
# Rodar testes com cobertura
./mvnw test jacoco:report

# Ver relatório
open target/site/jacoco/index.html
```

## Boas Práticas

- Um conceito por teste
- Testes independentes
- Nomes descritivos
- Fast, Isolated, Repeatable
- Evitar lógica nos testes

## Referências

- [JUnit 5](https://junit.org/junit5/)
- [AssertJ](https://assertj.github.io/doc/)
- [Mockito](https://site.mockito.org/)

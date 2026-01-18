# ADR-001: Clean Architecture

## Status

✅ **Aceito**

## Contexto

Precisávamos escolher uma arquitetura que permitisse:
- Código testável e manutenível
- Independência de frameworks
- Regras de negócio isoladas
- Fácil evolução e mudança de tecnologias

## Opções Consideradas

### 1. Arquitetura em Camadas Tradicional

**Prós:**
- Simples e conhecida
- Fácil de implementar

**Contras:**
- Dependências incorretas (domínio depende de infraestrutura)
- Difícil de testar
- Acoplamento com frameworks

### 2. Clean Architecture

**Prós:**
- Separação clara de responsabilidades
- Domínio independente de frameworks
- Testabilidade alta
- Inversão de dependências
- Facilita mudanças tecnológicas

**Contras:**
- Curva de aprendizado
- Mais arquivos e interfaces
- Pode parecer over-engineering para projetos pequenos

### 3. Hexagonal Architecture

**Prós:**
- Portas e adaptadores
- Domínio isolado
- Testável

**Contras:**
- Similar à Clean, mas menos conhecida
- Menos materiais de referência

## Decisão

**Escolhemos Clean Architecture** por:

1. **Testabilidade:** Domínio puro, sem dependências externas
2. **Manutenibilidade:** Mudanças em um layer não afetam outros
3. **Independência:** Domínio não conhece Spring, JPA, etc
4. **Evolução:** Fácil adicionar novos use cases
5. **Padrão de mercado:** Bem documentada e conhecida

## Consequências

### Positivas

- ✅ Domínio testável sem Spring Context
- ✅ Fácil trocar de framework ou banco de dados
- ✅ Regras de negócio centralizadas e claras
- ✅ Código limpo e desacoplado
- ✅ Preparado para microservices

### Negativas

- ❌ Mais interfaces e classes
- ❌ Curva de aprendizado inicial
- ❌ Pode parecer verboso para operações simples

## Implementação

Estrutura adotada:

```
domain/          # Regras de negócio
application/     # Casos de uso
infrastructure/  # Adaptadores e frameworks
```

## Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Arquitetura Limpa no Spring Boot](https://medium.com/@ivangavlik/implementing-clean-architecture-in-spring-boot)

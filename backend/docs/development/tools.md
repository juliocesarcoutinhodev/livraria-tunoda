# Ferramentas de Desenvolvimento

IDEs e ferramentas recomendadas.

## IDEs

### IntelliJ IDEA (Recomendado)

**Download:** https://www.jetbrains.com/idea/

**Plugins:**
- Lombok
- MapStruct Support
- Docker
- Database Tools
- SonarLint

**Configuração:**
1. File → Settings → Build → Annotation Processors
2. Enable annotation processing ✅

### VS Code

**Extensões:**
- Extension Pack for Java
- Spring Boot Extension Pack
- Lombok Annotations Support
- Docker

## Ferramentas CLI

### Maven

```bash
# Build
./mvnw clean package

# Testes
./mvnw test

# Run
./mvnw spring-boot:run
```

### Docker

```bash
# Subir banco
docker-compose up -d

# Logs
docker-compose logs -f

# Parar
docker-compose down
```

### PostgreSQL Cliente

```bash
# psql
psql -h localhost -U livraria_user -d livraria_db

# DBeaver (GUI)
# https://dbeaver.io/
```

## API Testing

### Postman

Collections em `docs/api/postman/`

### cURL

```bash
curl http://localhost:8080/api/v1/actuator/health
```

### HTTPie

```bash
http GET :8080/api/v1/actuator/health
```

## Qualidade de Código

### SonarQube (Futuro)

Análise estática de código.

### SpotBugs (Futuro)

Detecção de bugs.

## Referências

- [IntelliJ IDEA Docs](https://www.jetbrains.com/idea/documentation/)
- [Maven CLI](https://maven.apache.org/ref/current/maven-embedder/cli.html)

# 🐳 Docker - Livraria Tunoda Backend

## 📦 Imagem Docker Otimizada

### Características

- ✅ **Multi-stage build** - Build separado do runtime
- ✅ **Imagem leve** - Base `eclipse-temurin:25-jre-alpine`
- ✅ **Layers otimizados** - Melhor cache do Docker
- ✅ **Usuário não-root** - Segurança aprimorada
- ✅ **Health check** - Monitoramento automático
- ✅ **Configurável** - Porta e profile via ENV
- ✅ **Sem secrets** - Variáveis de ambiente apenas

### Tamanho da Imagem

```
REPOSITORY                    TAG       SIZE
livraria-tunoda-backend      latest    ~300MB
├─ JRE Alpine                          ~180MB
├─ Application                         ~100MB
└─ Dependencies                        ~20MB
```

---

## 🏗️ Build

### Opção 1: Script Auxiliar

```bash
# Build com tag latest
./docker-build.sh

# Build com tag específica
./docker-build.sh v1.0.0
```

### Opção 2: Docker Command

```bash
# Build da imagem
docker build -t livraria-tunoda-backend:latest .

# Build com cache otimizado
docker build \
  --tag livraria-tunoda-backend:latest \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  .
```

### Opção 3: Docker Compose

```bash
# Build via docker-compose
docker-compose build

# Build sem cache
docker-compose build --no-cache
```

---

## 🚀 Execução

### Opção 1: Script Auxiliar

```bash
# Configurar .env
cp .env.example .env
nano .env

# Executar container
./docker-run.sh
```

### Opção 2: Docker Run

```bash
# Executar com .env file
docker run -d \
  --name livraria-tunoda-backend \
  --env-file .env \
  -p 8080:8080 \
  livraria-tunoda-backend:latest

# Executar com variáveis explícitas
docker run -d \
  --name livraria-tunoda-backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e POSTGRES_HOST=postgres \
  -e POSTGRES_DB=livraria_db \
  -e POSTGRES_USER=livraria_user \
  -e POSTGRES_PASSWORD=secret \
  -e JWT_SECRET=your-secret-key \
  livraria-tunoda-backend:latest
```

### Opção 3: Docker Compose (Recomendado)

```bash
# Subir aplicação + PostgreSQL
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

---

## 🔧 Configuração

### Variáveis de Ambiente

#### Obrigatórias

```bash
# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=livraria_db
POSTGRES_USER=livraria_user
POSTGRES_PASSWORD=your-password

# Security
JWT_SECRET=your-secret-key-here

# Integrations
MELHOR_ENVIO_TOKEN=your-token
MERCADO_PAGO_ACCESS_TOKEN=your-token
```

#### Opcionais

```bash
# Spring Profile (default: prod)
SPRING_PROFILES_ACTIVE=prod

# Server (default: 8080)
SERVER_PORT=8080

# JVM Options (default: optimized for containers)
JAVA_OPTS=-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0

# JWT Expiration (default: 3600s)
JWT_EXPIRATION=3600

# CORS (default: http://localhost:3000)
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Profiles Disponíveis

| Profile | Uso | Logs |
|---------|-----|------|
| `local` | Desenvolvimento local | Legível, DEBUG |
| `dev` | Desenvolvimento | Legível, DEBUG |
| `staging` | Homologação | Legível, INFO |
| `prod` | Produção | JSON, INFO |

---

## 🏥 Health Check

### Interno (Docker)

O container possui health check automático:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3
```

### Manual

```bash
# Verificar status do container
docker ps

# Health check manual
curl http://localhost:8080/api/v1/actuator/health

# Health check dentro do container
docker exec livraria-tunoda-backend \
  wget --spider http://localhost:8080/api/v1/actuator/health
```

---

## 📊 Monitoramento

### Logs

```bash
# Ver logs em tempo real
docker logs -f livraria-tunoda-backend

# Ver últimas 100 linhas
docker logs --tail 100 livraria-tunoda-backend

# Logs com timestamp
docker logs -t livraria-tunoda-backend

# Via docker-compose
docker-compose logs -f app
```

### Logs em Volume

Os logs também são salvos em volume:

```bash
# Inspecionar volume
docker volume inspect backend_app-logs

# Ver arquivos de log
docker exec livraria-tunoda-backend ls -la /app/logs

# Copiar logs para host
docker cp livraria-tunoda-backend:/app/logs ./logs-backup
```

### Métricas

```bash
# Stats do container
docker stats livraria-tunoda-backend

# Uso de recursos
docker exec livraria-tunoda-backend ps aux
```

---

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs de erro
docker logs livraria-tunoda-backend

# Inspecionar container
docker inspect livraria-tunoda-backend

# Verificar health check
docker inspect --format='{{json .State.Health}}' livraria-tunoda-backend | jq
```

### Conectividade com banco

```bash
# Testar conexão com PostgreSQL
docker exec livraria-tunoda-backend \
  nc -zv postgres 5432

# Via docker-compose network
docker-compose exec app \
  nc -zv postgres 5432
```

### Variáveis de ambiente

```bash
# Listar variáveis
docker exec livraria-tunoda-backend env

# Verificar variável específica
docker exec livraria-tunoda-backend \
  sh -c 'echo $SPRING_PROFILES_ACTIVE'
```

### Acessar container

```bash
# Shell interativo
docker exec -it livraria-tunoda-backend sh

# Executar comando
docker exec livraria-tunoda-backend ps aux
```

---

## 🔒 Segurança

### Boas Práticas Implementadas

1. ✅ **Usuário não-root**
   ```dockerfile
   USER spring:spring
   ```

2. ✅ **Imagem base oficial**
   ```dockerfile
   FROM eclipse-temurin:25-jre-alpine
   ```

3. ✅ **Sem secrets na imagem**
   - Todas as credenciais via ENV
   - `.env` no `.dockerignore`

4. ✅ **Multi-stage build**
   - Build tools não ficam na imagem final
   - Apenas runtime necessário

5. ✅ **Health check**
   - Detecta aplicação não responsiva
   - Restart automático

### Scan de Vulnerabilidades

```bash
# Docker Scout (recomendado)
docker scout cves livraria-tunoda-backend:latest

# Trivy
trivy image livraria-tunoda-backend:latest

# Grype
grype livraria-tunoda-backend:latest
```

---

## 🚢 Deploy

### Docker Swarm

```yaml
version: '3.8'

services:
  app:
    image: livraria-tunoda-backend:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    environment:
      SPRING_PROFILES_ACTIVE: prod
    secrets:
      - jwt_secret
      - postgres_password

secrets:
  jwt_secret:
    external: true
  postgres_password:
    external: true
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: livraria-tunoda-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: livraria-tunoda-backend
  template:
    metadata:
      labels:
        app: livraria-tunoda-backend
    spec:
      containers:
      - name: backend
        image: livraria-tunoda-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: POSTGRES_HOST
          value: "postgres-service"
        envFrom:
        - secretRef:
            name: backend-secrets
        livenessProbe:
          httpGet:
            path: /api/v1/actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### Cloud Platforms

#### AWS ECS

```bash
# Build e push para ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker tag livraria-tunoda-backend:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/livraria-tunoda:latest

docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/livraria-tunoda:latest
```

#### Google Cloud Run

```bash
# Build e deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/livraria-tunoda

gcloud run deploy livraria-tunoda \
  --image gcr.io/PROJECT_ID/livraria-tunoda \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure Container Instances

```bash
# Push para Azure Container Registry
az acr build --registry myregistry \
  --image livraria-tunoda:latest .

# Deploy
az container create \
  --resource-group mygroup \
  --name livraria-tunoda \
  --image myregistry.azurecr.io/livraria-tunoda:latest \
  --cpu 1 --memory 1
```

---

## 📈 Otimizações

### Build Cache

```bash
# Usar BuildKit para cache melhorado
DOCKER_BUILDKIT=1 docker build -t livraria-tunoda-backend:latest .

# Cache inline
docker build \
  --cache-from livraria-tunoda-backend:latest \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -t livraria-tunoda-backend:latest .
```

### Recursos JVM

```bash
# Otimizar para container
docker run \
  -e JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC" \
  livraria-tunoda-backend:latest

# Limitar memória do container
docker run \
  --memory="1g" \
  --memory-swap="1g" \
  livraria-tunoda-backend:latest
```

---

## 🧪 Testes

### Build Local

```bash
# Build
docker build -t livraria-tunoda-backend:test .

# Test run
docker run --rm \
  --env-file .env.test \
  -p 8080:8080 \
  livraria-tunoda-backend:test
```

### CI/CD

```yaml
# GitHub Actions
- name: Build Docker image
  run: docker build -t ${{ github.repository }}:${{ github.sha }} .

- name: Test container
  run: |
    docker run -d --name test \
      --env-file .env.test \
      ${{ github.repository }}:${{ github.sha }}
    
    sleep 30
    
    docker exec test \
      wget --spider http://localhost:8080/api/v1/actuator/health
```

---

## 📚 Referências

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker/)
- [Eclipse Temurin](https://adoptium.net/)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)


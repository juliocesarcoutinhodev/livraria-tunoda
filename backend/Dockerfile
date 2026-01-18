# ==============================================================================
# Stage 1: Build
# ==============================================================================
FROM eclipse-temurin:25-jdk-alpine AS builder

WORKDIR /app

# Copiar arquivos de configuracao do Maven
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Baixar dependencias (layer cacheavel)
RUN ./mvnw dependency:go-offline -B

# Copiar codigo fonte
COPY src ./src

# Build da aplicacao (skip tests para build mais rapido)
RUN ./mvnw clean package -DskipTests -B

# Extrair layers do JAR para otimizar cache do Docker
RUN mkdir -p target/extracted && \
    java -Djarmode=layertools -jar target/*.jar extract --destination target/extracted

# ==============================================================================
# Stage 2: Runtime
# ==============================================================================
FROM eclipse-temurin:25-jre-alpine AS runtime

# Metadados da imagem
LABEL maintainer="livraria-tunoda"
LABEL description="Livraria Tunoda - Backend API"
LABEL version="0.0.1-SNAPSHOT"

# Criar usuario nao-root para seguranca
RUN addgroup -S spring && adduser -S spring -G spring

# Criar diretorio de trabalho
WORKDIR /app

# Criar diretorio para logs (opcional)
RUN mkdir -p /app/logs && chown -R spring:spring /app/logs

# Copiar layers extraidos do stage de build
COPY --from=builder --chown=spring:spring /app/target/extracted/dependencies/ ./
COPY --from=builder --chown=spring:spring /app/target/extracted/spring-boot-loader/ ./
COPY --from=builder --chown=spring:spring /app/target/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=spring:spring /app/target/extracted/application/ ./

# Mudar para usuario nao-root
USER spring:spring

# Porta padrao (pode ser sobrescrita)
EXPOSE ${SERVER_PORT:-8080}

# Variaveis de ambiente padrao
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${SERVER_PORT:-8080}/api/v1/actuator/health || exit 1

# Entrypoint usando layers extraidos
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]


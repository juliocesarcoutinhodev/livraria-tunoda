# Pré-requisitos

Ferramentas e tecnologias necessárias para desenvolver e executar o projeto.

## Requisitos Obrigatórios

### Java 25

**Versão:** Java 25 (LTS mais recente)

**Instalação:**

```bash
# Ubuntu/Debian
sudo apt install openjdk-25-jdk

# macOS (Homebrew)
brew install openjdk@25

# Windows
# Download do site oficial: https://jdk.java.net/25/
```

**Verificar instalação:**
```bash
java -version
# Esperado: openjdk version "25" ou superior
```

### Maven 3.8+

**Versão mínima:** 3.8.0

**Instalação:**

```bash
# Ubuntu/Debian
sudo apt install maven

# macOS (Homebrew)
brew install maven

# Windows
# Download: https://maven.apache.org/download.cgi
```

**Verificar instalação:**
```bash
mvn -version
# Esperado: Apache Maven 3.8.x ou superior
```

**Nota:** O projeto inclui Maven Wrapper (`./mvnw`), então Maven global é opcional.

### Docker & Docker Compose

**Docker:** 20.10+  
**Docker Compose:** 2.0+

**Instalação:**

```bash
# Ubuntu/Debian
sudo apt install docker.io docker-compose

# macOS
brew install docker docker-compose

# Windows
# Docker Desktop: https://www.docker.com/products/docker-desktop
```

**Verificar instalação:**
```bash
docker --version
docker-compose --version
```

**Configurar permissões (Linux):**
```bash
sudo usermod -aG docker $USER
# Faça logout e login novamente
```

### Git

**Versão:** Qualquer versão recente

**Instalação:**

```bash
# Ubuntu/Debian
sudo apt install git

# macOS (já vem instalado)
# ou: brew install git

# Windows
# Git for Windows: https://git-scm.com/download/win
```

**Verificar instalação:**
```bash
git --version
```

## Ferramentas Recomendadas

### IDEs

#### IntelliJ IDEA (Recomendado)

**Edição:** Community (gratuita) ou Ultimate

**Download:** https://www.jetbrains.com/idea/

**Plugins recomendados:**
- Lombok
- MapStruct Support
- Docker
- Database Tools (Ultimate)

**Configurações:**
1. File → Settings → Build → Compiler → Annotation Processors
2. Habilitar: "Enable annotation processing"

#### Eclipse

**Edição:** Eclipse IDE for Enterprise Java Developers

**Download:** https://www.eclipse.org/downloads/

**Plugins recomendados:**
- Lombok
- Spring Tools 4
- Docker Tools

#### VS Code

**Extensões recomendadas:**
- Extension Pack for Java
- Spring Boot Extension Pack
- Docker
- Lombok Annotations Support

### Cliente de API

#### Postman (Recomendado)

**Download:** https://www.postman.com/downloads/

**Collections disponíveis:**
- `docs/api/postman/Livraria-Tunoda-API.postman_collection.json`
- `docs/api/postman/Livraria-Tunoda-API-STAGING.postman_collection.json`

#### Alternativas

- **Insomnia:** https://insomnia.rest/
- **cURL:** Já vem com Linux/macOS
- **HTTPie:** `brew install httpie` ou `apt install httpie`

### Cliente de Banco de Dados

#### DBeaver (Recomendado)

**Download:** https://dbeaver.io/download/

**Configuração PostgreSQL:**
```
Host: localhost
Port: 5432
Database: livraria_db
Username: livraria_user
Password: livraria_password
```

#### Alternativas

- **pgAdmin:** https://www.pgadmin.org/
- **DataGrip (JetBrains):** https://www.jetbrains.com/datagrip/
- **psql (CLI):** Vem com PostgreSQL

### Docker Desktop (Opcional)

Interface gráfica para gerenciar containers.

**Download:** https://www.docker.com/products/docker-desktop

**Alternativas (Linux):**
- **Portainer:** Interface web para Docker
- **Lazydocker:** TUI (Terminal UI)

## Requisitos de Sistema

### Mínimo

- **CPU:** 2 cores
- **RAM:** 4 GB
- **Disco:** 5 GB livres
- **OS:** Linux, macOS ou Windows 10+

### Recomendado

- **CPU:** 4+ cores
- **RAM:** 8 GB
- **Disco:** 10 GB livres (SSD preferível)
- **OS:** Linux (Ubuntu 20.04+) ou macOS

### Para Desenvolvimento com Docker

- **RAM:** 6 GB mínimo (8 GB recomendado)
- **Disco:** 10 GB livres para imagens Docker

## Tokens de API (Obrigatórios)

### JWT Secret

Chave secreta para assinar tokens JWT (mínimo 256 bits).

**Gerar:**
```bash
openssl rand -base64 32
```

### Melhor Envio Token

Token de autenticação da API do Melhor Envio.

**Obter:**
1. Crie conta em: https://sandbox.melhorenvio.com.br
2. Vá em: Configurações → Tokens
3. Crie um token com todas as permissões

**Sandbox (desenvolvimento):** https://sandbox.melhorenvio.com.br  
**Produção:** https://melhorenvio.com.br

### Mercado Pago Access Token

Token de acesso da API do Mercado Pago.

**Obter:**
1. Crie conta em: https://www.mercadopago.com.br
2. Vá em: Seu negócio → Configurações → Credenciais
3. Copie o Access Token (Test para dev, Production para prod)

**Sandbox:** Use Access Token de teste  
**Produção:** Use Access Token de produção

## Verificação Completa

Execute este checklist antes de iniciar o desenvolvimento:

```bash
# 1. Java
java -version
# ✓ Deve mostrar Java 25

# 2. Maven
mvn -version
# ✓ Deve mostrar Maven 3.8+

# 3. Docker
docker --version
docker-compose --version
# ✓ Deve mostrar versões instaladas

# 4. Git
git --version
# ✓ Deve mostrar versão instalada

# 5. Variáveis de ambiente
echo $JWT_SECRET
echo $MELHOR_ENVIO_TOKEN
echo $MERCADO_PAGO_ACCESS_TOKEN
# ✓ Deve mostrar os valores configurados
```

## Próximos Passos

Após instalar todos os pré-requisitos:

1. [Configuração Local](local-setup.md) - Setup passo a passo
2. [Profiles](profiles.md) - Entender ambientes
3. [Variáveis de Ambiente](environment-variables.md) - Configurações detalhadas

## Troubleshooting

### Java não encontrado

```bash
# Verificar JAVA_HOME
echo $JAVA_HOME

# Configurar (Linux/macOS)
export JAVA_HOME=/usr/lib/jvm/java-25-openjdk
export PATH=$JAVA_HOME/bin:$PATH

# Adicionar ao ~/.bashrc ou ~/.zshrc para persistir
```

### Docker permission denied (Linux)

```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar sessão
newgrp docker

# Testar
docker ps
```

### Maven não encontrado

```bash
# Usar Maven Wrapper do projeto
./mvnw --version

# Não precisa de Maven instalado globalmente
```

## Referências

- [OpenJDK](https://jdk.java.net/)
- [Apache Maven](https://maven.apache.org/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Downloads](https://www.postgresql.org/download/)

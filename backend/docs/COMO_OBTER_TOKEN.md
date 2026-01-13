# Como Obter o Token do Melhor Envio (Sandbox)

## Para Desenvolvedores de API (Sem Frontend)

Se você está desenvolvendo apenas a API backend e não tem frontend ainda, use o **User Token** do Melhor Envio. É simples e rápido!

## Passo a Passo

### 1. Acessar o Sandbox

Abra no navegador: **https://sandbox.melhorenvio.com.br**

### 2. Criar Conta (se não tiver)

- Clique em **Cadastre-se**
- Preencha seus dados
- Confirme o e-mail
- Faça login

### 3. Gerar o Token

Após fazer login:

1. Clique no **menu do usuário** (canto superior direito, onde aparece seu nome/foto)
2. Selecione **"Gerenciar Tokens"** ou **"Tokens de API"**
3. Clique em **"Criar novo token"** ou **"Gerar token"**
4. Dê um nome para o token (exemplo: "Desenvolvimento Local")
5. **COPIE O TOKEN IMEDIATAMENTE** (ele só aparece uma vez!)

O token terá um formato parecido com:
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBmZjc...
```

### 4. Configurar no Projeto

#### Opção A: Variável de Ambiente (Recomendado)

**Linux/Mac:**
```bash
export MELHOR_ENVIO_TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOi..."
export MELHOR_ENVIO_FROM_CEP="01310-100"
```

**Windows (CMD):**
```cmd
set MELHOR_ENVIO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOi...
set MELHOR_ENVIO_FROM_CEP=01310-100
```

**Windows (PowerShell):**
```powershell
$env:MELHOR_ENVIO_TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOi..."
$env:MELHOR_ENVIO_FROM_CEP="01310-100"
```

#### Opção B: IntelliJ IDEA

1. Abra: **Run → Edit Configurations**
2. Selecione sua configuração de execução
3. Em **Environment variables**, adicione:
   ```
   MELHOR_ENVIO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOi...;MELHOR_ENVIO_FROM_CEP=01310-100
   ```

#### Opção C: application-dev.yml (Não recomendado para Git)

**⚠️ ATENÇÃO:** Não commite o token no Git!

Edite `src/main/resources/application-dev.yml`:
```yaml
melhor-envio:
  token: eyJ0eXAiOiJKV1QiLCJhbGciOi...
  from-postal-code: 01310-100
```

Adicione ao `.gitignore`:
```
**/application-dev.yml
```

### 5. Executar a Aplicação

```bash
./mvnw spring-boot:run
```

Se tudo estiver correto, você verá no log:
```
Started StartupApplication in X.XXX seconds
```

### 6. Testar

```bash
# Criar carrinho
curl -X POST http://localhost:8080/api/carts

# Ver a resposta com o cartId e depois usar para calcular frete
```

## Crédito de Teste

O sandbox oferece **R$ 10.000,00 em crédito fictício** para você testar livremente!

Você pode:
- ✅ Calcular frete quantas vezes quiser
- ✅ Testar todos os serviços (PAC, SEDEX, etc)
- ✅ Simular compras completas
- ❌ Não gera etiquetas reais
- ❌ Não faz postagem real

## Dicas

### Token Expirado?

Se após algum tempo o token parar de funcionar:
1. Acesse o painel do Melhor Envio
2. Revogue o token antigo
3. Gere um novo
4. Atualize na sua configuração

### CEP de Origem

O `MELHOR_ENVIO_FROM_CEP` é o CEP de onde você enviará os pedidos. Use:
- CEP da sua loja/empresa
- CEP fictício para testes (ex: 01310-100 - Av. Paulista, SP)

### Sandbox vs Produção

| Ambiente | URL | Quando Usar |
|----------|-----|-------------|
| **Sandbox** | https://sandbox.melhorenvio.com.br | Desenvolvimento e testes |
| **Produção** | https://melhorenvio.com.br | Aplicação em produção real |

**Importante:** Tokens do sandbox NÃO funcionam em produção!

## Problemas Comuns

### "Token inválido" ou "Unauthorized"

✅ **Solução:**
- Verifique se copiou o token completo
- Certifique-se de estar usando o ambiente correto (sandbox)
- Gere um novo token

### "Variável de ambiente não encontrada"

✅ **Solução:**
- Reinicie o terminal após exportar a variável
- No IntelliJ, reinicie a aplicação após configurar
- Verifique se não há espaços no nome da variável

### "CEP inválido"

✅ **Solução:**
- Use CEP válido e existente
- Formato: apenas números (ex: 01310100) ou com hífen (01310-100)

## Próximos Passos

Após configurar o token:
1. ✅ Siga o guia: `docs/MELHOR_ENVIO_QUICKSTART.md`
2. ✅ Leia a integração completa: `docs/MELHOR_ENVIO_INTEGRATION.md`
3. ✅ Teste os endpoints de frete

## Suporte

- 📖 Documentação oficial: https://docs.melhorenvio.com.br
- 💬 Suporte Melhor Envio: contato@melhorenvio.com.br


# Modulo de email

## Endpoint de teste

**POST** `/api/admin/emails/test`

Requer autenticacao com perfil `ADMIN`.

### Request

```json
{
  "to": "cliente@email.com",
  "subject": "Teste de email",
  "body": "Conteudo de teste"
}
```

### Response (202)

```json
{
  "status": "QUEUED",
  "message": "Email enfileirado para envio"
}
```

## Configuracao (variaveis de ambiente)

Exemplo para Gmail SMTP em `prod` e `staging`:

```properties
SPRING_PROFILES_ACTIVE=prod
APP_FRONTEND_BASE_URL=http://localhost:3000

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=SEU_EMAIL@gmail.com
MAIL_PASSWORD=sua-senha-de-app
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS_ENABLE=true
MAIL_SMTP_STARTTLS_REQUIRED=true
MAIL_SMTP_CONNECTION_TIMEOUT=5000
MAIL_SMTP_TIMEOUT=5000
MAIL_SMTP_WRITE_TIMEOUT=5000
```

Em `dev`, use:

```properties
SPRING_PROFILES_ACTIVE=dev
```

O perfil `dev` usa `MockEmailService` e apenas registra o conteudo no log.

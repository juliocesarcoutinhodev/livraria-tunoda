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

## Configuracao (application.properties)

Exemplo para Gmail SMTP em `prod` e `staging`:

```properties
spring.profiles.active=prod

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=SEU_EMAIL@gmail.com
spring.mail.password=fkjkdcyzaerxtfzy

spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
```

Em `dev`, use:

```properties
spring.profiles.active=dev
```

O perfil `dev` usa `MockEmailService` e apenas registra o conteudo no log.

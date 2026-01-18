# Boas Práticas de Segurança

Recomendações para manter o sistema seguro em produção.

## Secrets e Credenciais

### ✅ Fazer

- Usar variáveis de ambiente para secrets
- Gerar JWT_SECRET com `openssl rand -base64 32`
- Senhas fortes (mínimo 12 caracteres)
- Credenciais diferentes por ambiente
- Rotacionar secrets periodicamente

### ❌ Evitar

- Commitar secrets no Git
- Hardcoded credentials
- Mesma senha em dev e prod
- Compartilhar tokens entre usuários
- Secrets em logs

## Usuário Admin

### Produção

1. Fazer login com credenciais padrão
2. **ALTERAR SENHA IMEDIATAMENTE**
3. Usar senha forte e única
4. Não compartilhar credenciais

```bash
# Alterar senha (via SQL)
UPDATE tb_users 
SET password_hash = '$2a$12$NOVO_HASH_AQUI'
WHERE email = 'admin@livraria.com';
```

## HTTPS

### Sempre em Produção

- ✅ Certificado SSL válido
- ✅ Redirect HTTP → HTTPS
- ✅ HSTS habilitado
- ✅ Secure cookies

## CORS

Configurar origins permitidas:

```yaml
cors:
  allowed-origins: https://livrariatunoda.com.br
  allowed-methods: GET,POST,PUT,DELETE,PATCH
  allow-credentials: true
```

❌ **Nunca:** `allowed-origins: *` em produção

## Headers de Segurança

```yaml
# application-prod.yml
server:
  servlet:
    session:
      cookie:
        secure: true
        http-only: true
        same-site: strict
```

## Rate Limiting

Implementar para prevenir ataques:

- Login: 5 tentativas / minuto
- API pública: 100 requests / minuto
- API admin: 1000 requests / minuto

## Validação de Input

- ✅ Validar todos os inputs
- ✅ Sanitizar dados
- ✅ Usar Bean Validation
- ✅ Rejeitar dados inválidos

## SQL Injection

✅ **Protegido:** JPA/Hibernate com prepared statements

❌ **Evitar:** Concatenação de SQL

## XSS (Cross-Site Scripting)

- ✅ Escapar output HTML (frontend)
- ✅ Content Security Policy headers
- ✅ Validar e sanitizar inputs

## CSRF (Cross-Site Request Forgery)

✅ **Protegido:** API stateless com JWT

Tokens não são armazenados em cookies (a menos que httpOnly).

## Logs

### ✅ Logar

- Tentativas de login (sucesso/falha)
- Acesso a recursos protegidos
- Mudanças em dados críticos
- Erros de autenticação/autorização

### ❌ Nunca Logar

- Senhas
- Tokens completos
- Dados de cartão
- CPF completo

## Backup

- ✅ Backup diário automático
- ✅ Testar restore mensalmente
- ✅ Backup offsite
- ✅ Criptografar backups

## Atualizações

- ✅ Manter dependências atualizadas
- ✅ Aplicar patches de segurança
- ✅ Monitorar CVEs
- ✅ Usar Dependabot

## Monitoramento

- ✅ Alertas de falhas de login
- ✅ Alertas de erros 5xx
- ✅ Monitorar uso de recursos
- ✅ Logs centralizados

## Checklist de Produção

- [ ] HTTPS configurado
- [ ] Senha admin alterada
- [ ] JWT_SECRET rotacionado
- [ ] CORS configurado
- [ ] Rate limiting ativo
- [ ] Logs configurados
- [ ] Backup automático
- [ ] Monitoramento ativo
- [ ] Dependências atualizadas
- [ ] Firewall configurado

## Conformidade

- LGPD (Lei Geral de Proteção de Dados)
- PCI-DSS (via Mercado Pago)
- Políticas de privacidade

## Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Autenticação](authentication.md)
- [Credenciais Admin](ADMIN_CREDENTIALS.md)

# Integração Melhor Envio

Esta documentação descreve a integração com a API do Melhor Envio para cálculo de frete.

## Arquitetura

A integração segue os princípios de Clean Architecture:

```
Domain (Porta)
    ↓
    ShippingCalculator (interface)
    ↓
Infrastructure (Adapter)
    ↓
    MelhorEnvioShippingCalculator → MelhorEnvioClient → API Melhor Envio
```

## Componentes

### 1. Domain Gateway
- **ShippingCalculator**: Interface que define o contrato de cálculo de frete

### 2. Infrastructure
- **MelhorEnvioClient**: Cliente HTTP que faz chamadas à API
- **MelhorEnvioShippingCalculator**: Adapter que implementa ShippingCalculator
- **MelhorEnvioProperties**: Configurações da API
- **MelhorEnvioRestTemplateConfig**: Configuração do RestTemplate

### 3. DTOs
- **MelhorEnvioCalculateRequest**: Request para API
- **MelhorEnvioCalculateResponse**: Response da API

### 4. Use Case
- **CalculateShippingUseCase**: Coordena o cálculo e persistência

## Configuração

### application.yml

```yaml
melhor-envio:
  base-url: https://sandbox.melhorenvio.com.br
  token: ${MELHOR_ENVIO_TOKEN:your-token-here}
  from-postal-code: ${MELHOR_ENVIO_FROM_CEP:01310-100}
  timeout-seconds: 10
  max-retries: 2
  default-width: 15
  default-height: 2
  default-length: 20
```

### Variáveis de Ambiente

- `MELHOR_ENVIO_TOKEN`: Token de autenticação da API
- `MELHOR_ENVIO_FROM_CEP`: CEP de origem dos envios

## Fluxo de Cálculo

1. Cliente cria cotação via `POST /api/shipping/quotes?cartId={cartId}`
2. Sistema cria cotação com status CREATED e opção temporária
3. Cliente solicita cálculo via `POST /api/shipping/quotes/{quoteId}/calculate`
4. Sistema:
   - Busca cotação pelo ID
   - Valida status (deve ser CREATED)
   - Chama MelhorEnvioClient para calcular frete
   - Normaliza opções retornadas
   - Atualiza cotação com status CALCULATED
   - Salva payload bruto para auditoria
   - Persiste cotação atualizada

## Tratamento de Erros

### Retry Automático
O cliente implementa retry com backoff exponencial:
- **Tentativas**: 3 (configurável)
- **Delay inicial**: 1 segundo
- **Multiplicador**: 2x

### Timeout
- **Connect timeout**: 10 segundos
- **Read timeout**: 10 segundos

### Falhas
Em caso de falha no cálculo:
- Cotação é marcada como EXPIRED
- Exceção BusinessException é lançada
- Payload não é salvo

## Normalização de Dados

### De Domain para API
```java
ShippingItem (Domain) → Product (API)
- bookId → id
- weight (kg) → weight (gramas)
- quantity → quantity
- unitPrice → insurance_value
```

### De API para Domain
```java
MelhorEnvioCalculateResponse (API) → ShippingOption (Domain)
- name → serviceName
- price/customPrice → price
- deliveryTime/customDeliveryTime → deliveryDays
- company.name → company
- id → externalReference
```

## Payload Bruto

O payload original retornado pela API é salvo na tabela `tb_shipping_payloads`:
- **Propósito**: Auditoria e debug
- **Formato**: JSON string
- **Provider**: MELHOR_ENVIO
- **Associação**: ShippingQuoteId

## Endpoints

### Criar Cotação
```http
POST /api/shipping/quotes?cartId={cartId}

Response:
{
  "id": "uuid",
  "cartId": "uuid",
  "status": "CREATED",
  "items": [...],
  "options": [
    {
      "serviceCode": "PENDING",
      "serviceName": "Aguardando cálculo",
      "price": 0.00,
      ...
    }
  ]
}
```

### Calcular Frete
```http
POST /api/shipping/quotes/{quoteId}/calculate

Response:
{
  "id": "uuid",
  "cartId": "uuid",
  "status": "CALCULATED",
  "items": [...],
  "options": [
    {
      "serviceCode": "PAC",
      "serviceName": "PAC",
      "price": 25.00,
      "deliveryDays": 10,
      "company": "Correios",
      ...
    },
    {
      "serviceCode": "SEDEX",
      "serviceName": "SEDEX",
      "price": 35.00,
      "deliveryDays": 5,
      "company": "Correios",
      ...
    }
  ]
}
```

## Limitações e Considerações

1. **CEP de Destino**: Atualmente fixo no adapter (pode ser parametrizado)
2. **Dimensões**: Usa valores padrão configuráveis (width, height, length)
3. **Peso**: Deve vir em kg, é convertido para gramas
4. **Moeda**: Hardcoded para BRL
5. **Sandbox**: Configurado para ambiente sandbox por padrão

## Evolução Futura

- [ ] Parametrizar CEP de destino via request
- [ ] Suportar múltiplos provedores de frete
- [ ] Cache de cotações
- [ ] Métricas de performance
- [ ] Webhook para atualização de status
- [ ] Dimensões específicas por livro


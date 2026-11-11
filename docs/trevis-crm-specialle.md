# Integração Trevis e CRM Specialle

O Trevis continua sendo o local de criação e publicação de propostas e roteiros. O CRM registra o vínculo comercial e abre os documentos pelos links públicos.

## Chaves de vínculo

- `viagem_id`: UUID da viagem. É obrigatório e deve ser o mesmo na proposta e no roteiro.
- `crm_lead_id`: opcional. É enviado quando a criação começou em um lead da Specialle.
- `url_publica`: link do HTML publicado. Não é usado como identificador, pois pode ser trocado.

Ao criar uma proposta ou roteiro para a Specialle, use o contexto copiado pelo CRM e mantenha esses campos no JSON do Trevis. Se a viagem começar fora do CRM, crie o documento normalmente e use **Vincular Trevis** no CRM para escolher o lead correto depois.

## Sincronização automática opcional

O CRM recebe `POST /api/crm/trevis/webhook` apenas com uma assinatura HMAC SHA-256 no cabeçalho `X-Trevis-Signature`. O segredo fica somente na configuração segura do serviço que executa o Trevis e no secret `TREVIS_WEBHOOK_SECRET` do Cloudflare Pages. Nunca registrar o segredo no Drive, no JSON da marca, no HTML ou no repositório.

Corpo aceito:

```json
{
  "viagem_id": "uuid-da-viagem",
  "crm_lead_id": "uuid-do-lead-opcional",
  "tipo": "proposta",
  "numero": "0003/2027",
  "titulo": "Itália em família",
  "cliente_nome": "Ana e Paulo",
  "destinos": ["Roma", "Florença"],
  "embarque": "2027-05-04",
  "retorno": "2027-05-16",
  "viajantes": 2,
  "valor_total": 38500,
  "moeda": "BRL",
  "validade": "2027-03-17",
  "status": "enviada",
  "url_publica": "https://...",
  "pasta_cliente": "https://drive.google.com/..."
}
```

O mesmo `viagem_id` com `tipo: "roteiro"` salva o roteiro da mesma viagem. Reenvios atualizam o registro correspondente, sem duplicar documentos. Sem o secret configurado, a integração automática fica desativada e o fluxo manual do CRM segue funcionando.

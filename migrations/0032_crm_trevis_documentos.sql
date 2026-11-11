-- Documentos criados pelo Trevis e vinculados ao CRM. O link abre o artefato;
-- a relação durável usa viagem_id e, quando houver, lead_id/cliente_id.
CREATE TABLE IF NOT EXISTS crm_trevis_documentos (
  id            TEXT PRIMARY KEY,
  viagem_id     TEXT NOT NULL,
  tipo          TEXT NOT NULL CHECK (tipo IN ('proposta', 'roteiro')),
  lead_id       TEXT,
  cliente_id    TEXT,
  numero        TEXT,
  titulo        TEXT NOT NULL,
  cliente_nome  TEXT,
  destinos      TEXT NOT NULL DEFAULT '[]',
  embarque      TEXT,
  retorno       TEXT,
  viajantes     INTEGER,
  valor_total   REAL,
  moeda         TEXT NOT NULL DEFAULT 'BRL',
  validade      TEXT,
  status        TEXT NOT NULL DEFAULT 'rascunho',
  url_publica   TEXT NOT NULL,
  pasta_cliente TEXT,
  origem        TEXT NOT NULL DEFAULT 'trevis',
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (viagem_id, tipo)
);

CREATE INDEX IF NOT EXISTS idx_crm_trevis_documentos_lead ON crm_trevis_documentos(lead_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_trevis_documentos_cliente ON crm_trevis_documentos(cliente_id, updated_at DESC);

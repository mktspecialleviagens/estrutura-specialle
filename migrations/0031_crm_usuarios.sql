-- Contas individuais do CRM. Senhas nunca são gravadas nesta migration: cada
-- cadastro passa pela API, que gera salt e hash PBKDF2 no Worker.

CREATE TABLE IF NOT EXISTS crm_usuarios (
  id TEXT PRIMARY KEY,
  usuario TEXT NOT NULL COLLATE NOCASE UNIQUE,
  nome TEXT NOT NULL,
  email TEXT,
  papel TEXT NOT NULL DEFAULT 'atendimento',
  permissoes TEXT NOT NULL DEFAULT '{"financeiro":false}',
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  ativo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS crm_sessoes (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (usuario_id) REFERENCES crm_usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_crm_sessoes_usuario ON crm_sessoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_crm_sessoes_expira ON crm_sessoes(expires_at);

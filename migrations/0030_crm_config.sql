-- 0030_crm_config.sql
--
-- Listas de opções editáveis pelo administrador, sem deploy.
--
-- Tipo de serviço, forma de pagamento e categoria de receita eram constantes no
-- topo do script de public/crm/index.html. Trocar qualquer uma exigia editar o
-- arquivo e publicar, o que não serve: a agência ainda vai definir a relação
-- completa de serviços, e cada cliente da matriz tem a sua.
--
-- Uma tabela chave/valor em vez de uma coluna por lista: a próxima lista que
-- aparecer não pede migration. valor guarda JSON (array de strings), validado
-- na API, porque D1 não tem tipo array.
--
-- Sem seed aqui. Os padrões ficam em functions/api/crm/config.js e valem
-- enquanto a chave não existe, então um banco novo já abre funcionando e
-- ninguém precisa rodar INSERT à mão.

CREATE TABLE IF NOT EXISTS crm_config (
  chave      TEXT    PRIMARY KEY,          -- tipos_servico | formas_pagamento | categorias_receita | origens_lead
  valor      TEXT    NOT NULL,             -- JSON: ["Pacote regular", "Cruzeiro", ...]
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 0029_tarefas_lead_backfill.sql
--
-- Reparo das tarefas que ficaram sem lead.
--
-- Causa: o POST de /api/crm/tarefas não gravava lead_id (a coluna não estava no
-- INSERT) e o PUT não a listava como editável. Só _followup.js gravava o
-- vínculo. Toda tarefa criada à mão para um lead nasceu com lead_id nulo, o
-- card ficou sem nome e editar não resolvia.
--
-- O que dá para recuperar: a tarefa que o follow-up criou guarda em obs o
-- contexto que _followup.js monta, no formato exato 'Destino: X · Contato: Y'.
-- Quando esse texto corresponde a um único lead, o vínculo é certo e volta.
--
-- O que NÃO dá: tarefa escrita à mão nunca guardou referência ao lead. Essa
-- informação não existe no banco e não será inventada aqui. Para essas, a tela
-- de edição da tarefa agora tem o seletor "Lead".
--
-- Correspondência ambígua (dois leads com o mesmo destino e telefone) fica de
-- fora: vincular ao lead errado é pior que deixar sem vínculo.
--
-- Idempotente: só toca linhas com lead_id nulo. Rodar duas vezes não muda nada.

UPDATE crm_tarefas
SET lead_id = (
      SELECT l.id FROM crm_leads l
      WHERE crm_tarefas.obs = CASE
              WHEN l.destino IS NOT NULL AND l.telefone IS NOT NULL
                THEN 'Destino: ' || l.destino || ' · Contato: ' || l.telefone
              WHEN l.destino  IS NOT NULL THEN 'Destino: '  || l.destino
              WHEN l.telefone IS NOT NULL THEN 'Contato: ' || l.telefone
            END
    ),
    -- origem marca a tarefa como do follow-up. Sem isso syncTarefaFollowup não
    -- reconheceria a tarefa reparada e criaria uma segunda na próxima edição do
    -- lead, que é o empilhamento que a 0028 veio evitar.
    origem = 'followup'
WHERE lead_id IS NULL
  AND obs IS NOT NULL
  AND (
      SELECT COUNT(*) FROM crm_leads l
      WHERE crm_tarefas.obs = CASE
              WHEN l.destino IS NOT NULL AND l.telefone IS NOT NULL
                THEN 'Destino: ' || l.destino || ' · Contato: ' || l.telefone
              WHEN l.destino  IS NOT NULL THEN 'Destino: '  || l.destino
              WHEN l.telefone IS NOT NULL THEN 'Contato: ' || l.telefone
            END
    ) = 1;

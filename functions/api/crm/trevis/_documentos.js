const TIPOS = new Set(['proposta', 'roteiro']);
const STATUS = new Set(['rascunho', 'enviada', 'aprovada', 'confirmada', 'perdida', 'substituida', 'entregue']);

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' }, status });
}

export function normalizar(body, { exigirViagemId = false } = {}) {
  const value = body?.documento && typeof body.documento === 'object' ? body.documento : body || {};
  const tipo = texto(value.tipo, 12).toLowerCase();
  const viagem_id = texto(value.viagem_id, 100) || (exigirViagemId ? '' : crypto.randomUUID());
  const titulo = texto(value.titulo, 180);
  const url_publica = texto(value.url_publica || value.link, 1200);
  if (!TIPOS.has(tipo)) throw new Error('tipo deve ser proposta ou roteiro.');
  if (!viagem_id) throw new Error('viagem_id é obrigatório.');
  if (!titulo) throw new Error('titulo é obrigatório.');
  if (!urlPublica(url_publica)) throw new Error('url_publica deve ser um link válido.');

  const destinos = Array.isArray(value.destinos)
    ? value.destinos.map(x => texto(x, 90)).filter(Boolean).slice(0, 12)
    : texto(value.destinos, 700).split(',').map(x => x.trim()).filter(Boolean).slice(0, 12);
  const status = texto(value.status, 20).toLowerCase() || (tipo === 'roteiro' ? 'entregue' : 'rascunho');
  if (!STATUS.has(status)) throw new Error('status inválido.');

  return {
    viagem_id, tipo, lead_id: texto(value.lead_id, 100) || null, cliente_id: texto(value.cliente_id, 100) || null,
    numero: texto(value.numero, 60) || null, titulo, cliente_nome: texto(value.cliente_nome || value.cliente, 180) || null,
    destinos: JSON.stringify(destinos), embarque: data(value.embarque), retorno: data(value.retorno),
    viajantes: inteiro(value.viajantes, 1, 100), valor_total: numero(value.valor_total), moeda: texto(value.moeda, 6).toUpperCase() || 'BRL',
    validade: data(value.validade), status, url_publica, pasta_cliente: urlOpcional(value.pasta_cliente), origem: 'trevis',
  };
}

export async function salvarDocumento(env, doc) {
  const now = Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO crm_trevis_documentos
      (id,viagem_id,tipo,lead_id,cliente_id,numero,titulo,cliente_nome,destinos,embarque,retorno,viajantes,valor_total,moeda,validade,status,url_publica,pasta_cliente,origem,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(viagem_id,tipo) DO UPDATE SET
      lead_id=COALESCE(excluded.lead_id,crm_trevis_documentos.lead_id),
      cliente_id=COALESCE(excluded.cliente_id,crm_trevis_documentos.cliente_id), numero=excluded.numero,
      titulo=excluded.titulo, cliente_nome=excluded.cliente_nome, destinos=excluded.destinos,
      embarque=excluded.embarque, retorno=excluded.retorno, viajantes=excluded.viajantes,
      valor_total=excluded.valor_total, moeda=excluded.moeda, validade=excluded.validade,
      status=excluded.status, url_publica=excluded.url_publica, pasta_cliente=excluded.pasta_cliente,
      origem=excluded.origem, updated_at=excluded.updated_at
  `).bind(id, doc.viagem_id, doc.tipo, doc.lead_id, doc.cliente_id, doc.numero, doc.titulo, doc.cliente_nome,
    doc.destinos, doc.embarque, doc.retorno, doc.viajantes, doc.valor_total, doc.moeda, doc.validade, doc.status,
    doc.url_publica, doc.pasta_cliente, doc.origem, now, now).run();
  return env.DB.prepare('SELECT * FROM crm_trevis_documentos WHERE viagem_id = ? AND tipo = ?').bind(doc.viagem_id, doc.tipo).first();
}

function texto(value, max) { return typeof value === 'string' ? value.trim().slice(0, max) : value == null ? '' : String(value).trim().slice(0, max); }
function data(value) { const v = texto(value, 10); return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null; }
function inteiro(value, min, max) { const n = Number.parseInt(value, 10); return Number.isInteger(n) && n >= min && n <= max ? n : null; }
function numero(value) { const n = typeof value === 'number' ? value : Number.parseFloat(value); return Number.isFinite(n) && n >= 0 ? n : null; }
function urlPublica(value) { try { const u = new URL(value); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; } }
function urlOpcional(value) { const v = texto(value, 1200); return !v || urlPublica(v) ? v || null : null; }

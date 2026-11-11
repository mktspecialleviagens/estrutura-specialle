import { json, normalizar, salvarDocumento } from './_documentos.js';

export async function onRequestGet({ request, env }) {
  if (!autorizado(request, env)) return json({ error: 'Unauthorized' }, 401);
  const url = new URL(request.url);
  const leadId = url.searchParams.get('lead_id') || '';
  const clienteId = url.searchParams.get('cliente_id') || '';
  const cond = [], binds = [];
  if (leadId) { cond.push('lead_id = ?'); binds.push(leadId); }
  if (clienteId) { cond.push('cliente_id = ?'); binds.push(clienteId); }
  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
  try {
    const { results } = await env.DB.prepare(`SELECT * FROM crm_trevis_documentos ${where} ORDER BY updated_at DESC LIMIT 500`).bind(...binds).all();
    return json({ documentos: results || [] });
  } catch (err) { return json({ error: err.message }, 500); }
}

export async function onRequestPost({ request, env }) {
  if (!autorizado(request, env)) return json({ error: 'Unauthorized' }, 401);
  try {
    const documento = await salvarDocumento(env, normalizar(await request.json()));
    return json({ documento }, 201);
  } catch (err) { return json({ error: err.message }, 400); }
}

export function onRequestOptions() { return new Response(null, { status: 204 }); }
function autorizado(request, env) { return Boolean(env.DASH_KEY && new URL(request.url).searchParams.get('key') === env.DASH_KEY); }

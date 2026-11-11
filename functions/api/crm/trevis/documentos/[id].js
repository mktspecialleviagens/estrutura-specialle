import { json, normalizar, salvarDocumento } from '../_documentos.js';

export async function onRequestGet({ request, env, params }) {
  if (!autorizado(request, env)) return json({ error: 'Unauthorized' }, 401);
  const documento = await env.DB.prepare('SELECT * FROM crm_trevis_documentos WHERE id = ?').bind(params.id).first();
  return documento ? json({ documento }) : json({ error: 'Not found' }, 404);
}

export async function onRequestPut({ request, env, params }) {
  if (!autorizado(request, env)) return json({ error: 'Unauthorized' }, 401);
  try {
    const atual = await env.DB.prepare('SELECT * FROM crm_trevis_documentos WHERE id = ?').bind(params.id).first();
    if (!atual) return json({ error: 'Not found' }, 404);
    const body = await request.json();
    const documento = await salvarDocumento(env, normalizar({ ...atual, ...body, destinos: body.destinos ?? JSON.parse(atual.destinos || '[]') }));
    return json({ documento });
  } catch (err) { return json({ error: err.message }, 400); }
}

export async function onRequestDelete({ request, env, params }) {
  if (!autorizado(request, env)) return json({ error: 'Unauthorized' }, 401);
  const result = await env.DB.prepare('DELETE FROM crm_trevis_documentos WHERE id = ?').bind(params.id).run();
  return result.meta.changes ? json({ ok: true }) : json({ error: 'Not found' }, 404);
}
function autorizado(request, env) { return Boolean(env.DASH_KEY && new URL(request.url).searchParams.get('key') === env.DASH_KEY); }

import { can, criarUsuario, requireAuth, usuarioPublico } from '../_auth.js';

export async function onRequestGet({ request, env }) {
  const auth = await requireAuth(request, env, 'usuarios');
  if (!auth.ok) return json({ error: 'Unauthorized' }, auth.status || 401);
  const rows = await env.DB.prepare('SELECT id, usuario, nome, email, papel, permissoes, ativo, created_at FROM crm_usuarios ORDER BY nome').all();
  return json({ usuarios: (rows.results || []).map(usuarioPublico) });
}

export async function onRequestPost({ request, env }) {
  const auth = await requireAuth(request, env, 'usuarios');
  if (!auth.ok) return json({ error: 'Unauthorized' }, auth.status || 401);
  let body; try { body = await request.json(); } catch { return json({ error: 'Dados inválidos.' }, 400); }
  try { return json({ usuario: await criarUsuario(env, body || {}) }, 201); }
  catch (error) { return json({ error: error.message.includes('UNIQUE') ? 'Este usuário já existe.' : error.message }, 400); }
}
function json(body, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }); }

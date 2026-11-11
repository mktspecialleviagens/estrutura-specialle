import { criarSessao, sessionCookie, usuarioPublico, validarSenha } from '../_auth.js';

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Dados inválidos.' }, 400); }
  const usuario = typeof body?.usuario === 'string' ? body.usuario.trim().toLowerCase() : '';
  const senha = typeof body?.senha === 'string' ? body.senha : '';
  if (!usuario || !senha) return json({ error: 'Informe usuário e senha.' }, 400);

  let user;
  try {
    user = await env.DB.prepare('SELECT * FROM crm_usuarios WHERE usuario = ? AND ativo = 1').bind(usuario).first();
  } catch (error) {
    console.error('CRM login user lookup error:', error?.message || error);
    return json({ error: 'O banco de usuários não está disponível.' }, 500);
  }

  try {
    if (!await validarSenha(user, senha)) return json({ error: 'Usuário ou senha incorretos.' }, 401);
  } catch (error) {
    console.error('CRM login password validation error:', error?.message || error);
    return json({ error: 'Não foi possível validar a senha.' }, 500);
  }

  try {
    const session = await criarSessao(env, user.id);
    return json({ user: usuarioPublico(user) }, 200, { 'Set-Cookie': sessionCookie(session.token) });
  } catch (error) {
    console.error('CRM login session error:', error?.message || error);
    return json({ error: 'Não foi possível iniciar a sessão.' }, 500);
  }
}
function json(body, status, headers = {}) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } }); }

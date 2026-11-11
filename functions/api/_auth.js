const SESSION_DAYS = 14;
// Compatível com o limite de CPU do Cloudflare Pages e ainda protegido por
// salt único, PBKDF2/SHA-256 e comparacão em tempo constante.
const PBKDF2_ITERATIONS = 50000;
const encoder = new TextEncoder();

export async function requireAuth(request, env, permissao = null) {
  const url = new URL(request.url);
  if (env.DASH_KEY && url.searchParams.get('key') === env.DASH_KEY) {
    return { ok: true, legacy: true, user: { id: 'legado', usuario: 'chave', nome: 'Acesso legado', papel: 'administradora', permissoes: { financeiro: true, usuarios: true } } };
  }

  const token = cookie(request.headers.get('Cookie') || '', 'crm_session');
  if (!token) return { ok: false, status: 401 };
  const tokenHash = await sha256(token);
  const now = unix();
  const row = await env.DB.prepare(`
    SELECT u.id, u.usuario, u.nome, u.email, u.papel, u.permissoes
    FROM crm_sessoes s JOIN crm_usuarios u ON u.id = s.usuario_id
    WHERE s.token_hash = ? AND s.expires_at > ? AND u.ativo = 1
  `).bind(tokenHash, now).first();
  if (!row) return { ok: false, status: 401 };

  const user = { ...row, permissoes: parsePermissions(row.permissoes) };
  if (permissao && !can(user, permissao)) return { ok: false, status: 403 };
  return { ok: true, legacy: false, user };
}

export function can(user, permissao) {
  return user?.papel === 'administradora' || Boolean(user?.permissoes?.[permissao]);
}

export async function criarUsuario(env, { usuario, nome, email = null, senha, papel = 'atendimento', permissoes = {} }) {
  const login = normalizarUsuario(usuario);
  if (!login || !nome?.trim() || typeof senha !== 'string' || senha.length < 8) {
    throw new Error('Preencha nome, usuário e uma senha de pelo menos 8 caracteres.');
  }
  if (!['administradora', 'atendimento'].includes(papel)) throw new Error('Papel inválido.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const password_hash = await pbkdf2(senha, salt);
  const id = crypto.randomUUID();
  const now = unix();
  const permissions = { financeiro: false, usuarios: false, ...permissoes };
  await env.DB.prepare(`
    INSERT INTO crm_usuarios (id, usuario, nome, email, papel, permissoes, password_salt, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(id, login, nome.trim(), email?.trim() || null, papel, JSON.stringify(permissions), toBase64(salt), password_hash, now, now).run();
  return { id, usuario: login, nome: nome.trim(), email: email?.trim() || null, papel, permissoes: permissions, ativo: 1 };
}

export async function validarSenha(user, senha) {
  if (!user || typeof senha !== 'string') return false;
  const hash = await pbkdf2(senha, fromBase64(user.password_salt));
  return timingSafeEqual(hash, user.password_hash);
}

export async function criarSessao(env, usuarioId) {
  const token = toBase64(crypto.getRandomValues(new Uint8Array(32)));
  const now = unix();
  const expires = now + SESSION_DAYS * 86400;
  await env.DB.prepare('DELETE FROM crm_sessoes WHERE expires_at <= ?').bind(now).run();
  await env.DB.prepare('INSERT INTO crm_sessoes (id, usuario_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), usuarioId, await sha256(token), expires, now).run();
  return { token, expires };
}

export async function encerrarSessao(request, env) {
  const token = cookie(request.headers.get('Cookie') || '', 'crm_session');
  if (token) await env.DB.prepare('DELETE FROM crm_sessoes WHERE token_hash = ?').bind(await sha256(token)).run();
}

export function sessionCookie(token, maxAge = SESSION_DAYS * 86400) {
  return `crm_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function usuarioPublico(user) {
  return { id: user.id, usuario: user.usuario, nome: user.nome, email: user.email || null, papel: user.papel, permissoes: parsePermissions(user.permissoes) };
}

function normalizarUsuario(value) { return typeof value === 'string' && /^[a-z0-9._-]{3,40}$/i.test(value.trim()) ? value.trim().toLowerCase() : ''; }
function parsePermissions(raw) { try { return { financeiro: false, usuarios: false, ...(typeof raw === 'string' ? JSON.parse(raw) : raw || {}) }; } catch { return { financeiro: false, usuarios: false }; } }
function cookie(header, name) { const prefix = `${name}=`; return header.split(';').map(v => v.trim()).find(v => v.startsWith(prefix))?.slice(prefix.length) || ''; }
function unix() { return Math.floor(Date.now() / 1000); }
function toBase64(bytes) { return btoa(String.fromCharCode(...bytes)); }
function fromBase64(value) { return Uint8Array.from(atob(value), c => c.charCodeAt(0)); }
async function sha256(value) { return toBase64(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))); }
async function pbkdf2(password, salt) { const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']); return toBase64(new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS }, key, 256))); }
function timingSafeEqual(a, b) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }

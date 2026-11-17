import { can, requireAuth } from './api/_auth.js';
import { onRequest as tracking } from './_tracking.js';
import { PAINEL, rotearDominio } from './_dominios.js';

// O webhook Trevis é a única rota CRM sem sessão: valida HMAC próprio dentro
// da Function e fica inativo enquanto o secret não existir no Pages.
const PROTEGIDAS = [/^\/api\/crm\/(?!lead-capture$|trevis\/webhook$)/, /^\/loja\/api\/admin\//];
const FINANCEIRO = /^\/api\/crm\/(faturas|despesas|receitas|contratos)(?:\/|$)/;

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Cada domínio abre numa página diferente do mesmo build. Ver _dominios.js.
  const rota = rotearDominio(url);
  if (rota.redirecionar) return Response.redirect(rota.redirecionar, 301);

  // Painel interno do Trevis: tem nome de cliente e valor, então só abre com a
  // sessão do CRM (ou a chave antiga) e fica fora de busca e de cache.
  if (rota.pagina === PAINEL || /^\/painel(?:\/|$)/.test(url.pathname)) {
    const auth = await requireAuth(request, env).catch(() => ({ ok: false }));
    if (!auth.ok) return painelSemAcesso();
    const original = rota.pagina
      ? await env.ASSETS.fetch(new Request(new URL(rota.pagina, url), { method: request.method, headers: request.headers }))
      : await context.next();
    const resposta = new Response(original.body, original);
    resposta.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    resposta.headers.set('Cache-Control', 'private, no-store');
    return resposta;
  }
  if (rota.pagina) {
    // O rastreamento roda sobre a requisição original (cookies, UTMs, sessão) e
    // só a resposta vem da outra página.
    const pagina = new Request(new URL(rota.pagina, url), { method: request.method, headers: request.headers });
    return tracking({ ...context, next: () => env.ASSETS.fetch(pagina) });
  }

  if (!PROTEGIDAS.some(pattern => pattern.test(url.pathname))) return tracking(context);

  const auth = await requireAuth(request, env);
  if (!auth.ok) return Response.json({ error: 'Unauthorized' }, { status: auth.status || 401 });
  if (FINANCEIRO.test(url.pathname) && !auth.legacy && !can(auth.user, 'financeiro')) {
    return Response.json({ error: 'Sem permissão para acessar o financeiro.' }, { status: 403 });
  }

  // Os endpoints anteriores validam somente ?key=. O middleware valida a sessão
  // individual e injeta a chave apenas na requisição interna, sem expô-la ao navegador.
  if (!auth.legacy) url.searchParams.set('key', env.DASH_KEY || '');
  const init = { method: request.method, headers: request.headers, redirect: request.redirect };
  if (!['GET', 'HEAD'].includes(request.method)) init.body = request.body;
  return context.next(new Request(url, init));
}

function painelSemAcesso() {
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Painel Specialle</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#1A002E;color:#F4F0F7;font-family:Montserrat,system-ui,sans-serif;padding:24px;box-sizing:border-box}main{max-width:360px;text-align:center}h1{font-size:22px;margin:0 0 12px}p{line-height:1.5;color:#C9A6E0;margin:0 0 24px}a{display:inline-block;background:#8A55B5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600}</style></head><body><main><h1>Painel interno da Specialle</h1><p>Entre no CRM com o seu usuário e depois abra este endereço de novo.</p><a href="/crm/">Entrar no CRM</a></main></body></html>`;
  return new Response(html, { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' } });
}

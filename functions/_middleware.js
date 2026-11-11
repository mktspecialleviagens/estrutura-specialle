import { can, requireAuth } from './api/_auth.js';
import { onRequest as tracking } from './_tracking.js';

const PROTEGIDAS = [/^\/api\/crm\/(?!lead-capture$)/, /^\/loja\/api\/admin\//];
const FINANCEIRO = /^\/api\/crm\/(faturas|despesas|receitas|contratos)(?:\/|$)/;

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
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

import { encerrarSessao, sessionCookie } from '../_auth.js';
export async function onRequestPost({ request, env }) { await encerrarSessao(request, env); return new Response(null, { status: 204, headers: { 'Set-Cookie': sessionCookie('', 0), 'Cache-Control': 'no-store' } }); }

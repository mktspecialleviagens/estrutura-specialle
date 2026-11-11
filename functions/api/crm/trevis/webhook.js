import { json, normalizar, salvarDocumento } from './_documentos.js';

// Endpoint exclusivo para a instalação Trevis da Specialle. Ele só é ativado
// quando TREVIS_WEBHOOK_SECRET é configurado no Pages; sem a chave, o fluxo
// manual do CRM continua disponível e nenhum terceiro consegue sincronizar.
export async function onRequestPost({ request, env }) {
  const secret = env.TREVIS_WEBHOOK_SECRET;
  if (!secret) return json({ error: 'Integração Trevis não está ativada.' }, 503);
  const raw = await request.text();
  const signature = request.headers.get('X-Trevis-Signature') || '';
  if (!await assinaturaValida(raw, signature, secret)) return json({ error: 'Assinatura inválida.' }, 401);
  try {
    const documento = await salvarDocumento(env, normalizar(JSON.parse(raw), { exigirViagemId: true }));
    return json({ ok: true, documento });
  } catch (err) { return json({ error: err.message }, 400); }
}

export function onRequestOptions() { return new Response(null, { status: 204 }); }

async function assinaturaValida(raw, received, secret) {
  const expected = await hmac(raw, secret);
  const value = received.replace(/^sha256=/i, '').toLowerCase();
  if (value.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < value.length; i++) diff |= value.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
async function hmac(raw, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(raw)));
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

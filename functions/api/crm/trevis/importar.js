import { json } from './_documentos.js';

// Importa somente páginas Pages públicas, sem seguir redirecionamentos.
export async function onRequestPost({ request, env }) {
  if (!env.DASH_KEY || new URL(request.url).searchParams.get('key') !== env.DASH_KEY) return json({ error: 'Unauthorized' }, 401);
  try {
    const body = await request.json();
    const url = new URL(body.url);
    if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.pages\.dev$/.test(url.hostname) || url.port || url.username || url.password || !/^\/p\/[^/]+\/?$/.test(url.pathname)) throw new Error('Informe um link público de proposta Trevis hospedado no Cloudflare Pages.');
    const response = await fetch(url.toString(), { redirect: 'manual', signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('Não foi possível abrir a proposta. Confira o link.');
    const length = Number(response.headers.get('content-length') || 0);
    if (length > 8000000) throw new Error('A proposta é grande demais para importar.');
    const html = await response.text();
    if (html.length > 8000000) throw new Error('A proposta é grande demais para importar.');
    const match = html.match(/<script\b[^>]*\bid=["']dados["'][^>]*>([\s\S]*?)<\/script\s*>/i);
    if (!match) throw new Error('Esta proposta não contém dados Trevis reconhecíveis. Preencha os campos manualmente.');
    const data = JSON.parse(match[1]);
    const p = data.proposta || {}, investment = data.investimento || {};
    if (!p.titulo || !p.numero) throw new Error('A proposta não contém título e número reconhecíveis.');
    const raw = String(investment.valor_total || '').replace(/[^0-9,.-]/g, '');
    const valor = raw.includes(',') ? Number(raw.replace(/\./g, '').replace(',', '.')) : Number(raw);
    const periodo = periodoDaProposta(p);
    const destinos = [...new Set((Array.isArray(data.hospedagem?.itens) ? data.hospedagem.itens : []).map(x => typeof x.cidade === 'string' ? x.cidade.trim() : '').filter(Boolean))];
    return json({ dados: { tipo: 'proposta', titulo: p.titulo, numero: p.numero, cliente_nome: Array.isArray(p.clientes) ? p.clientes.join(', ') : (typeof p.clientes === 'string' ? p.clientes : ''), destinos, viajantes: investment.viajantes || null, valor_total: raw && Number.isFinite(valor) ? valor : null, moeda: /US\$|USD/i.test(investment.valor_total || '') ? 'USD' : /€|EUR/i.test(investment.valor_total || '') ? 'EUR' : 'BRL', validade: dataBrasileira(p.validade), ...periodo, url_publica: url.toString() }, aviso: 'Confira os dados e as datas. Selecione o lead, o cliente e o status manualmente; a pasta do Drive é opcional.' });
  } catch (err) { return json({ error: err.message || 'Não foi possível importar a proposta.' }, 400); }
}
export function periodoDaProposta(p) {
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const chips = Array.isArray(p.chips) ? p.chips : [];
  const texto = chips.filter(x => typeof x === 'string').join(' ').toLowerCase();
  const m = texto.match(/\b(\d{1,2})\s+(?:a|até|-)\s+(\d{1,2})\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+de\s+(\d{4}))?/);
  if (!m) return {};
  const ano = m[4] || String(p.rotulo || '').match(/\b(20\d{2})\b/)?.[1];
  if (!ano) return {};
  const mes = String(meses.indexOf(m[3]) + 1).padStart(2, '0');
  const formar = dia => { const valor = `${ano}-${mes}-${dia.padStart(2, '0')}`; const d = new Date(`${valor}T00:00:00Z`); return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0,10) === valor ? valor : null; };
  const embarque = formar(m[1]), retorno = formar(m[2]);
  return embarque && retorno && retorno >= embarque ? { embarque, retorno } : {};
}
function dataBrasileira(s) {
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = String(s).toLowerCase().match(/(\d{1,2})\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})/);
  if (!m) return null;
  const mes = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'].indexOf(m[2]) + 1;
  return `${m[3]}-${String(mes).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

// GET /api/crm/config?key=...            → todas as listas, já com os padrões
// PUT /api/crm/config?key=...            → body: { chave: [...] } ou { chave, valor: [...] }
//
// Listas de opções que o administrador edita pela tela de Configurações do CRM,
// sem deploy. Antes eram constantes no script de public/crm/index.html, o que
// obrigava a publicar o site para trocar um item.
//
// Os padrões vivem aqui, não como seed da migration: banco novo já abre
// funcionando, e uma chave que ninguém editou segue acompanhando a matriz.
// Gravar uma lista congela aquela chave para este cliente.

const PADROES = {
  // A agência ainda vai mandar a relação completa; estes são os serviços que ela
  // já vende hoje.
  tipos_servico:       ['Pacote regular', 'Roteiro personalizado', 'Cruzeiro', 'Visto', 'Guia'],
  formas_pagamento:    ['Pix', 'Cartão de crédito', 'Cartão de débito'],
  categorias_receita:  ['Consultoria', 'Passeios', 'Hospedagem', 'Aéreo', 'Seguro', 'Outro'],
  origens_lead:        ['Google Ads', 'Instagram', 'Feiras', 'Parceiros', 'Indicação', 'Outro'],
};

const CHAVES = Object.keys(PADROES);

// Teto por item e por lista. Um select com 200 opções não é usável, e o campo é
// texto livre vindo do navegador.
const MAX_ITENS = 60;
const MAX_TAMANHO = 60;

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  if (!auth(url, env)) return json({ error: 'Unauthorized' }, 401);

  try {
    const rows = await env.DB.prepare('SELECT chave, valor FROM crm_config').all();
    const salvas = {};
    for (const row of rows.results || []) {
      const lista = parseLista(row.valor);
      if (lista) salvas[row.chave] = lista;
    }

    const config = {};
    for (const chave of CHAVES) config[chave] = salvas[chave] || PADROES[chave];

    // `padroes` deixa a tela oferecer "voltar ao padrão" sem repetir as listas
    // no HTML, que é o que causou a duplicação que esta API vem resolver.
    return json({ config, padroes: PADROES });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  if (!auth(url, env)) return json({ error: 'Unauthorized' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  // Aceita { chave, valor: [...] } e também { tipos_servico: [...] }, para a
  // tela poder salvar várias listas numa requisição.
  const entradas = typeof body?.chave === 'string'
    ? [[body.chave, body.valor]]
    : Object.entries(body || {});

  if (!entradas.length) return json({ error: 'Nenhuma lista enviada' }, 400);

  const now = Math.floor(Date.now() / 1000);
  const statements = [];

  for (const [chave, valor] of entradas) {
    if (!CHAVES.includes(chave)) {
      return json({ error: `Lista desconhecida: ${chave}` }, 400);
    }
    const lista = limpar(valor);
    if (lista === null) {
      return json({ error: `Lista inválida em ${chave}: envie um array de textos` }, 400);
    }
    if (!lista.length) {
      return json({ error: `A lista ${chave} não pode ficar vazia` }, 400);
    }
    if (lista.length > MAX_ITENS) {
      return json({ error: `A lista ${chave} passa de ${MAX_ITENS} itens` }, 400);
    }
    statements.push(
      env.DB.prepare(`
        INSERT INTO crm_config (chave, valor, updated_at) VALUES (?,?,?)
        ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, updated_at = excluded.updated_at
      `).bind(chave, JSON.stringify(lista), now)
    );
  }

  try {
    await env.DB.batch(statements);
    return onRequestGet(context);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

// ── helpers ───────────────────────────────────────────────────────────────────

function parseLista(raw) {
  try {
    const lista = JSON.parse(raw);
    return Array.isArray(lista) && lista.length ? lista.map(String) : null;
  } catch {
    return null;
  }
}

// Normaliza o que veio do navegador: descarta o que não é texto, corta espaço
// nas pontas, remove vazios e repetidos. Devolve null se não for array.
function limpar(valor) {
  if (!Array.isArray(valor)) return null;
  const vistos = new Set();
  const lista = [];
  for (const item of valor) {
    if (typeof item !== 'string') continue;
    const texto = item.trim().slice(0, MAX_TAMANHO);
    if (!texto || vistos.has(texto.toLowerCase())) continue;
    vistos.add(texto.toLowerCase());
    lista.push(texto);
  }
  return lista;
}

function auth(url, env) {
  return env.DASH_KEY && url.searchParams.get('key') === env.DASH_KEY;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

function corsHeaders() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' };
}

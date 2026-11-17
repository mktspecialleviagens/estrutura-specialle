// Um projeto Pages, vários domínios. O Pages serve o mesmo build em todos eles,
// então é aqui que cada domínio ganha a sua página inicial.
//
// Só a raiz de cada domínio muda. /crm, /api, /brand, /assets, /pacotes/img e o
// resto funcionam igual em qualquer endereço, inclusive no *.pages.dev, que segue
// com a landing de roteiros na raiz como sempre.
//
// Sem módulo exportando onRequest: este arquivo não vira rota.

export const DOMINIO = 'specialleviagens.com.br';

// Domínio → página do build que responde na raiz. Domínio fora da lista usa a
// raiz padrão do build, que é a landing de roteiros (src/).
const PAGINA_INICIAL = {
  [DOMINIO]: '/pacotes/',
  [`links.${DOMINIO}`]: '/links/',
};

/**
 * Decide o que fazer com a requisição antes de qualquer outra regra.
 * Devolve { redirecionar } para mandar o navegador a outro endereço,
 * { pagina } para servir outra página do build no lugar da raiz, ou {} para seguir normal.
 */
export function rotearDominio(url) {
  const host = url.hostname.toLowerCase();

  // www sempre leva ao domínio principal, mantendo caminho e parâmetros (UTMs, fbclid).
  if (host === `www.${DOMINIO}`) {
    return { redirecionar: `https://${DOMINIO}${url.pathname}${url.search}` };
  }

  const pagina = PAGINA_INICIAL[host];
  if (!pagina) return {};

  if (url.pathname === '/' || url.pathname === '/index.html') return { pagina };

  // A página que já é a raiz deste domínio não precisa de um segundo endereço:
  // specialleviagens.com.br/pacotes/ vira specialleviagens.com.br/.
  const semBarra = pagina.replace(/\/$/, '');
  if (url.pathname === pagina || url.pathname === semBarra) {
    return { redirecionar: `https://${host}/${url.search}` };
  }

  return {};
}

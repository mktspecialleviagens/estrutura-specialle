import { describe, expect, it, vi } from "vitest";
import { rotearDominio } from "../../functions/_dominios.js";
import { onRequest } from "../../functions/_middleware.js";

const rota = (endereco: string) => rotearDominio(new URL(endereco));

describe("roteamento por domínio", () => {
  it("o domínio principal abre a landing de Pacotes", () => {
    expect(rota("https://specialleviagens.com.br/")).toEqual({ pagina: "/pacotes/" });
    expect(rota("https://specialleviagens.com.br/?utm_source=instagram")).toEqual({ pagina: "/pacotes/" });
  });

  it("links abre a página de links", () => {
    expect(rota("https://links.specialleviagens.com.br/")).toEqual({ pagina: "/links/" });
  });

  it("painel abre o painel de propostas e roteiros", () => {
    expect(rota("https://painel.specialleviagens.com.br/")).toEqual({ pagina: "/painel/" });
    expect(rota("https://painel.specialleviagens.com.br/painel/")).toEqual({ redirecionar: "https://painel.specialleviagens.com.br/" });
  });

  it("roteiros e o pages.dev seguem com a landing de roteiros na raiz", () => {
    expect(rota("https://roteiros.specialleviagens.com.br/")).toEqual({});
    expect(rota("https://estrutura-specialle.pages.dev/")).toEqual({});
  });

  it("www leva ao domínio principal sem perder caminho nem UTM", () => {
    expect(rota("https://www.specialleviagens.com.br/?utm_source=google")).toEqual({
      redirecionar: "https://specialleviagens.com.br/?utm_source=google",
    });
    expect(rota("https://www.specialleviagens.com.br/crm/")).toEqual({
      redirecionar: "https://specialleviagens.com.br/crm/",
    });
  });

  it("a página que já é a raiz não ganha segundo endereço", () => {
    expect(rota("https://specialleviagens.com.br/pacotes/")).toEqual({ redirecionar: "https://specialleviagens.com.br/" });
    expect(rota("https://specialleviagens.com.br/pacotes?fbclid=abc")).toEqual({
      redirecionar: "https://specialleviagens.com.br/?fbclid=abc",
    });
  });

  it("CRM, API e arquivos da página não são tocados em nenhum domínio", () => {
    for (const host of ["specialleviagens.com.br", "links.specialleviagens.com.br", "roteiros.specialleviagens.com.br"]) {
      for (const caminho of ["/crm/", "/api/crm/lead-capture", "/pacotes/img/lisboa.jpg", "/brand/config.js", "/assets/app.js"]) {
        expect(rota(`https://${host}${caminho}`)).toEqual({});
      }
    }
  });
});

describe("middleware com o roteamento", () => {
  const contexto = (endereco: string) => {
    const assets = vi.fn().mockResolvedValue(new Response("<html>pacotes</html>", { headers: { "Content-Type": "text/html" } }));
    const next = vi.fn().mockResolvedValue(new Response("<html>padrao</html>", { headers: { "Content-Type": "text/html" } }));
    return {
      context: { request: new Request(endereco), env: { ASSETS: { fetch: assets } }, next, waitUntil: vi.fn() },
      assets,
      next,
    };
  };

  it("serve a página de Pacotes na raiz do domínio principal, com o rastreamento rodando", async () => {
    const { context, assets, next } = contexto("https://specialleviagens.com.br/");
    const resposta = await onRequest(context as never);
    expect(await resposta.text()).toBe("<html>pacotes</html>");
    expect(new URL(assets.mock.calls[0][0].url).pathname).toBe("/pacotes/");
    expect(next).not.toHaveBeenCalled();
    expect(resposta.headers.get("Set-Cookie")).toContain("_krob_sid=");
  });

  it("redireciona o www com 301", async () => {
    const { context } = contexto("https://www.specialleviagens.com.br/?utm_source=ig");
    const resposta = await onRequest(context as never);
    expect(resposta.status).toBe(301);
    expect(resposta.headers.get("Location")).toBe("https://specialleviagens.com.br/?utm_source=ig");
  });

  it("deixa o pages.dev exatamente como era", async () => {
    const { context, assets, next } = contexto("https://estrutura-specialle.pages.dev/");
    const resposta = await onRequest(context as never);
    expect(await resposta.text()).toBe("<html>padrao</html>");
    expect(next).toHaveBeenCalledOnce();
    expect(assets).not.toHaveBeenCalled();
  });

  it("o painel sem sessão mostra a tela de entrar no CRM, sem servir o arquivo", async () => {
    for (const endereco of ["https://painel.specialleviagens.com.br/", "https://estrutura-specialle.pages.dev/painel/"]) {
      const { context, assets, next } = contexto(endereco);
      const resposta = await onRequest(context as never);
      expect(resposta.status).toBe(401);
      expect(await resposta.text()).toContain("/crm/");
      expect(assets).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    }
  });

  it("o painel com a chave entrega a página fora de busca e de cache", async () => {
    const { context, assets } = contexto("https://painel.specialleviagens.com.br/?key=segredo");
    (context.env as Record<string, unknown>).DASH_KEY = "segredo";
    const resposta = await onRequest(context as never);
    expect(resposta.status).toBe(200);
    expect(new URL(assets.mock.calls[0][0].url).pathname).toBe("/painel/");
    expect(resposta.headers.get("X-Robots-Tag")).toContain("noindex");
    expect(resposta.headers.get("Cache-Control")).toContain("no-store");
  });
});

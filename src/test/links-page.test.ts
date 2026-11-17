import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";

// A página de links da bio é HTML estático em public/links/, servida na raiz de
// links.specialleviagens.com.br (ver functions/_dominios.js).
const html = readFileSync(resolve(process.cwd(), "public/links/index.html"), "utf8");
const { document } = new JSDOM(html).window;
const links = [...document.querySelectorAll<HTMLAnchorElement>("main a")];

describe("página de links da bio", () => {
  it("não tem atalho direto para o WhatsApp: o lead entra pelo formulário das landings", () => {
    expect(document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]')).toHaveLength(0);
  });

  it("leva às duas landings, ao blog e ao Instagram, nessa ordem", () => {
    expect(links.map((a) => new URL(a.href).host + new URL(a.href).pathname)).toEqual([
      "specialleviagens.com.br/",
      "roteiros.specialleviagens.com.br/",
      "specialleviagens.com.br/loja/blog/",
      "www.instagram.com/specialleviagens/",
    ]);
  });

  it("marca com UTM todo link para as páginas da Specialle, para o CRM saber que veio da bio", () => {
    for (const a of links.filter((l) => new URL(l.href).host.endsWith("specialleviagens.com.br"))) {
      const params = new URL(a.href).searchParams;
      expect(params.get("utm_source")).toBe("instagram");
      expect(params.get("utm_medium")).toBe("bio");
    }
  });
});

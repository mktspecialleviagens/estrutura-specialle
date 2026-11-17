import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";

// A landing de Pacotes é HTML estático em public/, fora do React. O teste carrega a
// página de verdade e roda o script dela, para o contrato com o CRM não quebrar calado.
const html = readFileSync(resolve(process.cwd(), "public/pacotes/index.html"), "utf8");

const abrirPagina = (fetchMock: ReturnType<typeof vi.fn>) =>
  new JSDOM(html, {
    url: "http://localhost/pacotes/",
    runScripts: "dangerously",
    beforeParse(window) {
      Object.assign(window, {
        SPECIALLE_CONFIG: {
          agencyName: "Specialle Viagens",
          whatsapp: "5585999625722",
          whatsappMessage: "Olá, Specialle Viagens!",
          metaPixelId: "",
          ga4MeasurementId: "",
          trackingEnabled: false,
        },
        fetch: fetchMock,
        IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
        matchMedia: () => ({ matches: true }),
      });
    },
  }).window;

const clicar = (window: Window, texto: string) => {
  const botao = [...window.document.querySelectorAll<HTMLButtonElement>(".wizard-option")].find((b) => b.textContent === texto);
  if (!botao) throw new Error(`opção ausente: ${texto}`);
  botao.click();
};

describe("landing de Pacotes", () => {
  it("grava o lead no CRM com origem própria antes de abrir o WhatsApp", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    const window = abrirPagina(fetchMock);
    const { document } = window;

    for (const opcao of ["Grécia e Croácia", "Entre 3 e 6 meses", "2 pessoas", "Ainda não comprei"]) clicar(window, opcao);

    const form = document.querySelector<HTMLFormElement>("#form")!;
    expect(form.hidden).toBe(false);
    form.querySelector<HTMLInputElement>('[name="nome"]')!.value = "Ana Exemplo";
    form.querySelector<HTMLInputElement>('[name="telefone"]')!.value = "(85) 99999-9999";
    form.dispatchEvent(new window.Event("submit", { cancelable: true }));

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/crm/lead-capture");
    expect(JSON.parse(request.body)).toEqual({
      nome: "Ana Exemplo",
      whatsapp: "5585999999999",
      destino: "Grécia e Croácia",
      datas: "Entre 3 e 6 meses",
      orcamento: "",
      observacoes: "Pessoas: 2 pessoas\nPassagem: Ainda não comprei",
      origem: "Landing Page Pacotes",
    });
    await vi.waitFor(() => expect(document.querySelector("#form-error")!.textContent).toContain("Não foi possível registrar"));
  });

  it("não tem atalho direto para o WhatsApp: todo lead passa pelo formulário", () => {
    const window = abrirPagina(vi.fn());
    expect(window.document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]')).toHaveLength(0);
    expect(window.document.querySelector(".float")).toBeNull();
  });

  it("o atalho do card já preenche o destino e pula para o período", () => {
    const window = abrirPagina(vi.fn());
    window.document.querySelector<HTMLAnchorElement>('[data-destino="Cruzeiro Grécia e Croácia"]')!.click();
    expect(window.document.querySelector("#step-label")!.textContent).toBe("Etapa 2 de 4 · Período");
  });
});

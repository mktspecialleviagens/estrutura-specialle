import { describe, expect, it, vi } from "vitest";
import { onRequestPost } from "../../functions/api/crm/lead-capture.js";

const pedido = (corpo: Record<string, string>) =>
  new Request("https://matrix-estrutura-reservas.pages.dev/api/crm/lead-capture", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://matrix-estrutura-reservas.pages.dev" },
    body: JSON.stringify(corpo),
  });

const LEAD = {
  nome: "Ana Exemplo",
  whatsapp: "5585999999999",
  destino: "Europa",
  datas: "Entre 6 e 12 meses",
  orcamento: "De R$ 20 mil a R$ 40 mil",
  observacoes: "Pessoas: 2 pessoas\nPassagem: Já comprei",
  origem: "Landing Page Specialle Viagens",
};

// first() responde a busca por tarefa de follow-up já aberta, em _followup.js
const mockDB = (first: unknown = null) => {
  const run = vi.fn().mockResolvedValue({});
  const bind = vi.fn().mockReturnValue({ run, first: vi.fn().mockResolvedValue(first) });
  const prepare = vi.fn().mockReturnValue({ bind });
  return { prepare, bind, run };
};

describe("captura pública no CRM", () => {
  it("grava as respostas na coluna Novo sem alterar o esquema", async () => {
    const { prepare, bind, run } = mockDB();

    const response = await onRequestPost({ request: pedido(LEAD), env: { DB: { prepare } } });
    expect(response.status).toBe(201);
    expect(prepare.mock.calls[0][0]).toContain("'novo'");
    expect(bind.mock.calls[0][1]).toBe("Ana Exemplo");
    expect(bind.mock.calls[0][2]).toBe("Europa");
    expect(bind.mock.calls[0][3]).toBe("5585999999999");
    expect(bind.mock.calls[0][4]).toContain("Orçamento: De R$ 20 mil a R$ 40 mil");
    expect(run).toHaveBeenCalled();
  });

  it("abre a tarefa de follow-up junto com o lead", async () => {
    const { prepare, bind } = mockDB();

    await onRequestPost({ request: pedido(LEAD), env: { DB: { prepare } } });

    const insercaoTarefa = prepare.mock.calls.findIndex((c) => String(c[0]).includes("INSERT INTO crm_tarefas"));
    expect(insercaoTarefa).toBeGreaterThan(-1);
    const idDoLead = bind.mock.calls[0][0];             // primeiro INSERT é o do lead
    const args = bind.mock.calls[insercaoTarefa];
    expect(args[2]).toBe(idDoLead);                     // lead_id aponta para o lead recém-criado
    expect(args[0]).not.toBe(idDoLead);                 // id próprio, não o do lead
    expect(args[3]).toBe("followup");
    expect(args[4]).toBe("Primeiro contato com Ana Exemplo");
    expect(args[5]).toContain("Destino: Europa");
  });

  it("ainda devolve 201 quando a tarefa de follow-up falha", async () => {
    // O lead já foi gravado: quem preencheu o formulário não pode ver erro e
    // mandar de novo, senão se perde o lead e se ganha um duplicado.
    const run = vi.fn().mockResolvedValue({});
    const prepare = vi.fn().mockImplementation((sql: string) => ({
      bind: () => ({
        run,
        first: () => (String(sql).includes("crm_tarefas")
          ? Promise.reject(new Error("crm_tarefas indisponível"))
          : Promise.resolve(null)),
      }),
    }));

    const response = await onRequestPost({ request: pedido(LEAD), env: { DB: { prepare } } });
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ ok: true });
  });
});

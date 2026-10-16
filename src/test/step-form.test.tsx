import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import StepForm from "@/components/StepForm";

describe("formulário de captação", () => {
  beforeEach(() => {
    window.SPECIALLE_CONFIG = {
      agencyName: "Specialle Viagens",
      whatsapp: "5585999625722",
      whatsappMessage: "Olá, Specialle Viagens!",
      metaPixelId: "",
      ga4MeasurementId: "",
      trackingEnabled: false,
    };
  });

  afterEach(() => vi.unstubAllGlobals());

  it("pede cinco escolhas antes dos dados pessoais e monta o lead para a coluna Novo", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetchMock);
    render(<StepForm />);

    expect(screen.queryByLabelText("Seu nome")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Estados Unidos" }));
    expect(screen.getByRole("heading", { name: "Quando pretende viajar?" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(screen.getByRole("button", { name: "Estados Unidos" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Europa" }));

    for (const option of ["Entre 6 e 12 meses", "2 pessoas", "Já comprei", "De R$ 20 mil a R$ 40 mil"]) {
      fireEvent.click(screen.getByRole("button", { name: option }));
    }

    expect(screen.getByRole("heading", { name: "Seu nome e WhatsApp" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Seu nome"), { target: { value: "Ana Exemplo" } });
    fireEvent.change(screen.getByLabelText("Seu WhatsApp com DDD"), { target: { value: "(85) 99999-9999" } });
    fireEvent.click(screen.getByRole("button", { name: /falar com a specialle/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/crm/lead-capture");
    expect(JSON.parse(request.body)).toMatchObject({
      nome: "Ana Exemplo",
      whatsapp: "5585999999999",
      destino: "Europa",
      datas: "Entre 6 e 12 meses",
      observacoes: "Pessoas: 2 pessoas\nPassagem: Já comprei\nFaixa de investimento: De R$ 20 mil a R$ 40 mil",
      origem: "Landing Page Specialle Viagens",
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível registrar");
  });
});

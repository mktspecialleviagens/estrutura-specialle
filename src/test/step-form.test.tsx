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

  it("pede quatro escolhas antes dos dados pessoais e monta o lead para a coluna Novo", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetchMock);
    render(<StepForm />);

    expect(screen.queryByLabelText("Seu nome")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Estados Unidos" }));
    expect(screen.getByRole("heading", { name: "Quando pretende viajar?" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(screen.getByRole("button", { name: "Estados Unidos" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Europa" }));

    for (const option of ["Entre 6 e 12 meses", "2 pessoas", "Já comprei"]) {
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
      orcamento: "",
      observacoes: "Pessoas: 2 pessoas\nPassagem: Já comprei",
      origem: "Landing Page Specialle Viagens",
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível registrar");
  });

  it("com o lead gravado, dispara o Lead e mostra a confirmação com o botão do WhatsApp", async () => {
    window.SPECIALLE_CONFIG = { ...window.SPECIALLE_CONFIG!, trackingEnabled: true };
    const fbq = vi.fn();
    window.fbq = fbq;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    render(<StepForm />);

    for (const option of ["Europa", "Entre 6 e 12 meses", "2 pessoas", "Já comprei"]) {
      fireEvent.click(screen.getByRole("button", { name: option }));
    }
    fireEvent.change(screen.getByLabelText("Seu nome"), { target: { value: "Ana Exemplo" } });
    fireEvent.change(screen.getByLabelText("Seu WhatsApp com DDD"), { target: { value: "(85) 99999-9999" } });
    fireEvent.click(screen.getByRole("button", { name: /falar com a specialle/i }));

    expect(await screen.findByRole("status")).toHaveTextContent("Pedido registrado, Ana!");
    const botao = screen.getByRole("link", { name: /abrir whatsapp/i });
    const destino = new URL(botao.getAttribute("href")!);
    expect(destino.origin + destino.pathname).toBe("https://wa.me/5585999625722");
    expect(destino.searchParams.get("text")).toContain("Destino: Europa");

    // Lead pelo navegador e pelo servidor com o mesmo eventID, para a Meta deduplicar.
    expect(fbq).toHaveBeenCalledWith("track", "Lead", {}, expect.objectContaining({ eventID: expect.any(String) }));
    const tracker = fetchMock.mock.calls.find(([url]) => url === "/tracker")!;
    expect(JSON.parse(tracker[1].body)).toMatchObject({ event_name: "Lead", event_id: fbq.mock.calls[0][3].eventID });
    delete window.fbq;
  });
});

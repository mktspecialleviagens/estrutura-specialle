import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import bgImg from "@/assets/hero-europa-paris.jpg";

declare global {
  interface Window {
    SPECIALLE_CONFIG?: { agencyName: string; whatsapp: string; whatsappMessage: string; metaPixelId: string; ga4MeasurementId: string; trackingEnabled: boolean };
    fbq?: (...args: unknown[]) => void;
  }
}

// FAIXAS DE INVESTIMENTO: valores provisórios. Confirmar com a Anastacia e ajustar.
const steps = [
  { label: "Destino", title: "Para onde você quer ir?", hint: "Pode ser um destino certo ou só uma ideia.", options: ["Estados Unidos", "Europa", "Cruzeiro", "Mais de um destino", "Ainda não decidi"] },
  { label: "Período", title: "Quando pretende viajar?", hint: "Uma previsão já ajuda a gente a trabalhar.", options: ["Nos próximos 3 meses", "Entre 3 e 6 meses", "Entre 6 e 12 meses", "Daqui a mais de 1 ano", "Ainda não defini"] },
  { label: "Pessoas", title: "Quantas pessoas vão?", hint: "Contando todos os viajantes, adultos e crianças.", options: ["1 pessoa", "2 pessoas", "3 ou 4 pessoas", "5 ou mais pessoas", "Ainda não sei"] },
  { label: "Passagem", title: "Você já comprou a passagem?", hint: "Isso muda a forma como a gente monta a proposta.", options: ["Já comprei", "Ainda não comprei", "Quero que a Specialle cuide disso"] },
  { label: "Investimento", title: "Qual faixa de investimento você tem prevista para a viagem toda?", hint: "Somando todas as pessoas. Serve para a proposta já sair no seu orçamento.", options: ["Até R$ 20 mil", "De R$ 20 mil a R$ 40 mil", "De R$ 40 mil a R$ 70 mil", "Acima de R$ 70 mil", "Prefiro conversar antes"] },
] as const;

const StepForm = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(steps.length).fill(""));
  const [nome, setNome] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const onContact = step === steps.length;

  const select = (value: string) => {
    setAnswers((current) => current.map((answer, index) => index === step ? value : answer));
    setErro("");
    setStep((current) => current + 1);
  };

  const back = () => { setErro(""); setStep((current) => Math.max(0, current - 1)); };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setErro("");

    const nomeTrim = nome.trim();
    const digits = phone.replace(/\D/g, "");
    const phoneIntl = /^\d{10,11}$/.test(digits) ? `55${digits}` : /^55\d{10,11}$/.test(digits) ? digits : "";
    if (!nomeTrim) { setErro("Informe seu nome para continuarmos."); return; }
    if (!phoneIntl) { setErro("Informe um WhatsApp válido com DDD."); return; }

    const config = window.SPECIALLE_CONFIG;
    if (!config?.whatsapp || !/^\d{12,15}$/.test(config.whatsapp)) {
      setErro("O WhatsApp da agência está indisponível no momento. Tente novamente mais tarde."); return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/crm/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeTrim,
          whatsapp: phoneIntl,
          destino: answers[0],
          datas: answers[1],
          orcamento: answers[4],
          observacoes: `Pessoas: ${answers[2]}\nPassagem: ${answers[3]}`,
          origem: "Landing Page Specialle Viagens",
        }),
      });
      if (!response.ok) throw new Error("CRM unavailable");

      const eventId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      if (typeof window.fbq === "function") window.fbq("track", "Lead", {}, { eventID: eventId });
      if (config.trackingEnabled) {
        fetch("/tracker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            event_name: "Lead",
            event_id: eventId,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: window.location.href,
            user_data: {
              ph: phoneIntl,
              fn: nomeTrim.split(" ")[0].toLowerCase(),
              ln: nomeTrim.split(" ").slice(1).join(" ").toLowerCase() || undefined,
            },
          }),
        }).catch(() => {});
      }

      const message = [
        config.whatsappMessage,
        "",
        `Nome: ${nomeTrim}`,
        `Meu WhatsApp: +${phoneIntl}`,
        `Destino: ${answers[0]}`,
        `Período: ${answers[1]}`,
        `Pessoas: ${answers[2]}`,
        `Passagem: ${answers[3]}`,
        `Faixa de investimento: ${answers[4]}`,
      ].join("\n");
      window.location.assign(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`);
    } catch {
      setErro("Não foi possível registrar seu pedido agora. Verifique sua conexão e tente novamente.");
      setLoading(false);
    }
  };

  return (
    <section id="formulario" className="relative scroll-mt-20 overflow-hidden bg-[#2C0640] px-5 py-16 md:px-8 md:py-28 lg:px-16">
      <img src={bgImg} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2C0640]/95 to-[#430A62]/70" />
      <div className="container relative max-w-[1120px] grid lg:grid-cols-[0.8fr_1.2fr] gap-9 lg:gap-16 items-center">
        <div className="text-white">
          <span className="eyebrow text-specialle-lilac block mb-5">Primeiro passo</span>
          <h2 className="text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.08] max-w-[550px]" style={{ fontWeight: 600 }}>Conte sobre a sua viagem</h2>
          <p className="mt-6 max-w-[470px] text-[16px] font-light leading-relaxed text-white/85">
            Cinco escolhas rápidas e os seus dados. Com isso a nossa equipe já chega na conversa sabendo do que você precisa.
          </p>
          <p className="mt-8 hidden lg:block text-sm text-specialle-lilac">Estados Unidos · Europa · Cruzeiros</p>
        </div>

        <div className="min-w-0 rounded-2xl bg-[#F4F0F7] p-6 sm:p-8 md:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-specialle-violet">{onContact ? "Último passo · contato" : `Etapa ${step + 1} de ${steps.length} · ${steps[step].label}`}</span>
            <span className="text-xs font-semibold text-specialle-violet">{Math.round((step / steps.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#430A62]/10 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={step} aria-label="Progresso do formulário">
            <div className="h-full rounded-full bg-specialle-violet transition-all duration-300" style={{ width: `${(step / steps.length) * 100}%` }} />
          </div>

          {onContact ? (
            <form onSubmit={handleSubmit} className="mt-8">
              <h3 className="text-[26px] md:text-[32px] font-semibold leading-tight text-[#430A62]">Seu nome e WhatsApp</h3>
              <p className="mt-3 mb-6 text-[15px] font-light leading-relaxed text-[#231F20]/70">Seu pedido será registrado e uma mensagem com as suas respostas fica pronta para enviar à Specialle.</p>
              <label htmlFor="lead-name" className="block text-sm font-semibold text-[#430A62] mb-2">Seu nome</label>
              <input id="lead-name" type="text" value={nome} onChange={(event) => setNome(event.target.value)} autoComplete="name" maxLength={120} className="w-full rounded-lg border border-[#430A62]/20 bg-white px-4 py-3.5 text-[#231F20] focus:outline-none focus:ring-2 focus:ring-specialle-violet" placeholder="Como podemos chamar você?" />
              <label htmlFor="lead-phone" className="block text-sm font-semibold text-[#430A62] mb-2 mt-5">Seu WhatsApp com DDD</label>
              <input id="lead-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" maxLength={20} className="w-full rounded-lg border border-[#430A62]/20 bg-white px-4 py-3.5 text-[#231F20] focus:outline-none focus:ring-2 focus:ring-specialle-violet" placeholder="(85) 99999-9999" />
              {erro && <p role="alert" className="mt-4 text-sm text-red-700">{erro}</p>}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 mt-7">
                <button type="button" onClick={back} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-bold text-specialle-violet hover:bg-[#430A62]/5 disabled:opacity-50"><ArrowLeft size={16} /> Voltar</button>
                <button type="submit" disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#430A62] px-5 py-3.5 text-sm font-bold text-white hover:bg-specialle-violet disabled:opacity-60 transition-colors">{loading ? "Registrando pedido..." : "Falar com a Specialle"}<ArrowRight size={16} /></button>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-[#231F20]/60">Nossa equipe responde em até 24 horas em dias úteis. Seus dados ficam registrados no CRM da Specialle Viagens para que a equipe entre em contato.</p>
            </form>
          ) : (
            <div className="mt-8">
              <h3 className="text-[24px] md:text-[30px] font-semibold leading-tight text-[#430A62]">{steps[step].title}</h3>
              <p className="mt-2 text-[15px] font-light leading-relaxed text-[#231F20]/70">{steps[step].hint}</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-7" role="group" aria-label={steps[step].title}>
                {steps[step].options.map((option) => {
                  const selected = answers[step] === option;
                  return <button key={option} type="button" onClick={() => select(option)} aria-pressed={selected} className={`flex min-h-[70px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[15px] font-semibold transition-colors ${selected ? "border-[#430A62] bg-[#430A62] text-white" : "border-[#430A62]/15 bg-white text-[#430A62] hover:border-specialle-violet"}`}>
                    <span>{option}</span><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-specialle-lilac bg-specialle-lilac text-[#430A62]" : "border-specialle-violet/40"}`}>{selected && <Check size={13} strokeWidth={3} />}</span>
                  </button>;
                })}
              </div>
              {step > 0 && <button type="button" onClick={back} className="mt-7 inline-flex items-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold text-specialle-violet hover:bg-[#430A62]/5"><ArrowLeft size={16} /> Voltar</button>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StepForm;

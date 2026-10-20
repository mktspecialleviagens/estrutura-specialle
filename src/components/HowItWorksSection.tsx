import { useReveal } from "@/hooks/useReveal";

const steps = [
  { num: "01", label: "Etapa 1", title: "Você conta sobre a viagem",
    desc: "Preenche o formulário com destino, data e número de pessoas. Leva menos de um minuto." },
  { num: "02", label: "Etapa 2", title: "A gente conversa",
    desc: "Nossa equipe entra em contato pelo WhatsApp para entender o que você quer da viagem." },
  { num: "03", label: "Etapa 3", title: "Você recebe a proposta",
    desc: "Roteiro, hospedagem, voos e valor, tudo em um documento só, sem você precisar juntar as pontas." },
  { num: "04", label: "Etapa 4", title: "A viagem acontece",
    desc: "Com tudo reservado e a nossa equipe disponível do primeiro ao último dia." },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="section-padding" style={{ background: "#FFFFFF" }}>
      <div className="container max-w-[1100px]">
        <div className="max-w-[820px] mb-10">
          <span className="eyebrow text-specialle-purple mb-5 block">O processo</span>
          <h2 className="leading-[1.1] mb-4 text-[#280046]" style={{ fontSize: "clamp(26px, 4.5vw, 52px)", fontWeight: 600 }}>
            Como a gente <span className="font-light text-specialle-violet">trabalha</span>
          </h2>
          <p className="font-light text-foreground/72" style={{ fontSize: "17px", lineHeight: 1.7 }}>
            Do primeiro contato ao retorno, você fala sempre com a mesma equipe.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[3px]">
          {steps.map((s, i) => <StepCard key={s.num} step={s} index={i} />)}
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ step, index }: { step: typeof steps[number]; index: number }) => {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} relative p-8 md:p-10 group transition-all duration-300 overflow-hidden`}
      style={{
        background: "linear-gradient(160deg, #280046 0%, #6E3B96 100%)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
           style={{ background: "#C9A6E0" }} />
      <span aria-hidden className="absolute top-3 right-4 select-none pointer-events-none font-semibold"
            style={{ fontSize: "56px", color: "rgba(255,255,255,0.12)", lineHeight: 1 }}>
        {step.num}
      </span>
      <span className="eyebrow text-specialle-lilac">{step.label}</span>
      <h3 className="text-offwhite mt-3 mb-3 text-[20px] font-semibold leading-snug">{step.title}</h3>
      <p className="font-light text-offwhite/85 text-[15px] leading-relaxed">{step.desc}</p>
    </div>
  );
};

export default HowItWorksSection;

import { Check, X } from "lucide-react";

const forYou = [
  "Você quer viajar e não quer administrar a viagem",
  "Você valoriza ter alguém disponível se algo mudar lá fora",
  "Você prefere decidir uma vez e confiar em quem organiza",
  "Você viaja com família ou em grupo e não quer coordenar tudo sozinho",
];

const notForYou = [
  "Você está procurando o menor preço da internet",
  "Você quer apenas uma passagem aérea avulsa",
  "Você prefere montar tudo por conta e só quer uma cotação para comparar",
];

const ForWhoSection = () => {
  return (
    <section id="para-quem" className="section-padding" style={{ background: "#FFFFFF" }}>
      <div className="container max-w-[1100px]">
        <div className="mb-10 max-w-[760px] md:mb-14">
          <span className="eyebrow text-specialle-purple mb-5 block">O filtro</span>
          <h2 className="leading-[1.1] text-[#430A62]" style={{ fontSize: "clamp(26px, 4.5vw, 52px)", fontWeight: 600 }}>
            Para quem a Specialle <span className="font-light text-specialle-violet">funciona</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white rounded-lg p-8 md:p-11 border border-border shadow-sm">
            <span className="eyebrow text-specialle-purple mb-6 block">É para você se…</span>
            <ul className="space-y-4">
              {forYou.map((t) => (
                <li key={t} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                        style={{ background: "linear-gradient(135deg, #430A62, #6E3B96)" }}>
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </span>
                  <span className="text-[16px] text-foreground/85 leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg p-8 md:p-11 border border-border" style={{ background: "#F4F0F7" }}>
            <span className="eyebrow text-specialle-purple mb-6 block">Não é para você se…</span>
            <ul className="space-y-4 mb-8">
              {notForYou.map((t) => (
                <li key={t} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-specialle-purple/15 flex items-center justify-center mt-0.5">
                    <X size={14} className="text-specialle-purple" strokeWidth={3} />
                  </span>
                  <span className="text-[16px] text-foreground/90 leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
            <p className="text-[14px] text-foreground/80 font-light leading-relaxed border-l-2 border-specialle-violet pl-4">
              A gente trabalha com um número limitado de viagens por mês para manter o padrão de
              atendimento. Por causa disso, atendemos quem busca viagem completa, e não cotação avulsa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForWhoSection;

import { Languages, CalendarCheck, Headset, Coffee } from "lucide-react";

const scrollToForm = () => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });

const items = [
  {
    icon: Languages,
    title: "Fornecedor direto e guia que fala português",
    text: "Trabalhamos com guias privativos e parceiros locais nos destinos que operamos. Você é recebido no aeroporto, com placa, por alguém que fala a sua língua.",
  },
  {
    icon: CalendarCheck,
    title: "Tudo reservado antes de você sair",
    text: "Voo, hospedagem, traslado, passeio e ingresso. Cuidamos também do visto e da autorização eletrônica de viagem, a ETA, quando o destino exige. A viagem começa resolvida.",
  },
  {
    icon: Headset,
    title: "Acompanhamento durante a viagem",
    text: "Nossa equipe fica disponível enquanto você estiver fora. Se algo mudar, você fala com a gente e a gente resolve daqui.",
  },
  {
    icon: Coffee,
    title: "Escritório físico em Fortaleza",
    text: "Se você é de Fortaleza, pode vir tomar um café e conversar pessoalmente antes de decidir qualquer coisa.",
  },
];

const SolutionSection = () => {
  return (
    <section id="solucao" className="section-padding" style={{ background: "#F4F0F7" }}>
      <div className="container max-w-[1200px]">
        <div className="mb-12 grid items-end gap-6 md:mb-16 md:grid-cols-[minmax(0,1fr)_minmax(0,330px)] md:gap-12">
          <div>
            <span className="eyebrow text-specialle-purple mb-5 block">Como a Specialle resolve</span>
            <h2 className="max-w-[820px] leading-[1.08] text-[#280046] [text-wrap:balance]" style={{ fontSize: "clamp(26px, 4.2vw, 48px)", fontWeight: 600 }}>
              A Specialle organiza a viagem inteira e{" "}
              <span className="font-light text-specialle-violet">continua do seu lado enquanto você estiver fora</span>
            </h2>
          </div>
          <p className="max-w-[330px] text-[16px] font-light leading-[1.75] text-[#231F20]/75">
            Você decide para onde quer ir. A partir daí, cada peça da viagem passa pela nossa equipe.
          </p>
        </div>

        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {items.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className="flex min-w-0 flex-col gap-7 rounded-[5px] border border-[#280046]/10 bg-white p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-28px_rgba(40,0,70,.5)] md:min-h-[280px]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#280046]/20 text-[#280046]" aria-hidden="true"><Icon size={21} strokeWidth={1.6} /></span>
                <span className="text-[11px] font-bold tracking-[.17em] text-specialle-violet">0{index + 1}</span>
              </div>
              <div>
                <h3 className="text-[19px] font-semibold leading-snug text-[#280046]">{title}</h3>
                <p className="mt-3 text-[15px] font-light leading-[1.65] text-[#231F20]/75">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div>
          <button onClick={scrollToForm} className="btn-brand">
            Quero falar sobre a minha viagem →
          </button>
          <p className="mt-3 text-[13px] tracking-wide" style={{ color: "#280046" }}>
            Atendimento por WhatsApp ou presencial, na Washington Soares.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;

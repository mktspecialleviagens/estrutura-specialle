import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import parisImg from "@/assets/hero-europa-paris.jpg";
import miamiImg from "@/assets/hero-eua-miami.jpg";
import cruzeiroImg from "@/assets/hero-cruzeiro.jpg";

const scenes = [
  { image: parisImg, place: "Europa", detail: "Paris, França" },
  { image: miamiImg, place: "Estados Unidos", detail: "Miami, Flórida" },
  { image: cruzeiroImg, place: "Cruzeiros", detail: "Embarque e pós reserva" },
];

const HeroSection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % scenes.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const scrollToForm = () => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  const scrollToDestinations = () => document.getElementById("destinos")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="relative isolate flex min-h-[760px] flex-col justify-end overflow-hidden bg-[#1A002E] text-white lg:min-h-screen">
      <div className="absolute inset-0" aria-hidden="true">
        {scenes.map((scene, index) => (
          <img
            key={scene.place}
            src={scene.image}
            alt=""
            loading="eager"
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            className={`hero-scene absolute inset-0 h-full w-full object-cover ${active === index ? "is-active" : ""}`}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,0,32,.9)_0%,rgba(18,0,32,.6)_48%,rgba(18,0,32,.2)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,0,32,.8)_0%,transparent_31%,transparent_68%,rgba(18,0,32,.26)_100%)]" />
        <div className="hero-grain absolute inset-0 opacity-[.13]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col px-5 pb-8 pt-40 sm:px-8 md:pb-10 md:pt-48 lg:px-12">
        <div className="grid min-w-0 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
          <div className="max-w-[790px]">
            <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#D9BCEC] sm:text-[11px]">
              <span className="h-px w-8 shrink-0 bg-[#C9A6E0]" aria-hidden="true" />
              Specialle Viagens · Fortaleza · desde 1997
            </div>
            <h1 className="text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.06] tracking-[-.03em] [text-wrap:balance]">
              Sua viagem para a Europa ou os Estados Unidos resolvida do início ao fim.
              <span className="mt-3 block text-[0.78em] font-light text-[#D9BCEC]">E com alguém do seu lado também durante a viagem.</span>
            </h1>
            <p className="mt-6 max-w-[640px] text-[16px] font-light leading-[1.7] text-white/88 sm:text-[17px]">
              Há 29 anos a Specialle organiza viagens internacionais para quem quer aproveitar e <strong className="font-semibold text-white">não quer administrar nada.</strong> Passagem, hospedagem, traslados, passeios, guia que fala português e acompanhamento direto com a nossa equipe enquanto você estiver fora.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <button onClick={scrollToForm} className="group inline-flex min-h-14 items-center justify-center gap-5 rounded-md bg-[#C9A6E0] px-6 py-4 text-[12px] font-bold uppercase tracking-[.13em] text-[#1A002E] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Quero falar sobre a minha viagem
                <ArrowUpRight size={19} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </button>
              <span className="max-w-[300px] text-[13px] leading-snug text-white/75">
                Atendimento por WhatsApp ou presencial no nosso escritório, na Washington Soares.
              </span>
            </div>
          </div>

          <div className="hidden border-l border-white/30 pl-5 lg:block">
            <span className="block text-[10px] font-bold uppercase tracking-[.22em] text-[#D9BCEC]">Onde mais operamos</span>
            <span className="mt-3 block text-[26px] font-semibold leading-tight">{scenes[active].place}</span>
            <span className="mt-2 block text-[13px] text-white/75">{scenes[active].detail}</span>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-7 border-t border-white/25 pt-6 md:mt-24">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4" aria-label="Escolher destino do destaque">
            {scenes.map((scene, index) => (
              <button
                key={scene.place}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Mostrar destino: ${scene.place}`}
                aria-pressed={active === index}
                className={`hero-scene-control group flex min-w-[88px] items-center gap-2 border-t-2 pt-3 text-left text-[11px] font-bold uppercase tracking-[.12em] transition-colors sm:min-w-[128px] ${active === index ? "border-[#C9A6E0] text-white" : "border-white/25 text-white/60 hover:border-white/70 hover:text-white"}`}
              >
                <span className="text-[#D9BCEC]">0{index + 1}</span>
                <span className="truncate">{scene.place}</span>
              </button>
            ))}
          </div>
          <button onClick={scrollToDestinations} className="hidden items-center gap-3 text-[11px] font-bold uppercase tracking-[.16em] text-white/75 transition-colors hover:text-white md:inline-flex">
            Ver os destinos <ArrowDownRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

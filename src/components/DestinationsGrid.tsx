import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import euaImg from "@/assets/destino-eua.jpg";
import europaImg from "@/assets/destino-europa.jpg";
import cruzeirosImg from "@/assets/destino-cruzeiros.jpg";

const destinations = [
  {
    name: "Europa",
    detail: "Portugal, Espanha, Itália, França e roteiros combinando mais de um país, com traslado entre cidades já planejado.",
    img: europaImg,
    alt: "Coliseu de Roma, na Itália",
    layout: "md:col-span-2 lg:col-span-7 lg:row-span-2",
  },
  {
    name: "Estados Unidos",
    detail: "Orlando, Miami e a logística dos parques resolvida por quem já montou essa viagem centenas de vezes.",
    img: euaImg,
    alt: "Rua de prédios art déco e palmeiras em Miami Beach, Flórida",
    layout: "lg:col-span-5",
  },
  {
    name: "Cruzeiros",
    detail: "Seleção de companhias e cabines, com os embarques e o pós reserva acompanhados pela nossa equipe.",
    img: cruzeirosImg,
    alt: "Navio de cruzeiro navegando em mar aberto",
    layout: "lg:col-span-5",
  },
];

const DestinationsGrid = () => (
  <section id="destinos" className="section-padding overflow-hidden bg-[#2C0640] text-white">
    <div className="container max-w-[1200px]">
      <div className="mb-10 grid items-end gap-6 md:mb-14 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] md:gap-12">
        <div>
          <span className="eyebrow mb-5 block text-[#C9A6E0]">Nossa especialidade</span>
          <h2 className="max-w-[740px] leading-[1.06] [text-wrap:balance]" style={{ fontSize: "clamp(26px, 4.5vw, 52px)", fontWeight: 600 }}>
            Os destinos que a gente <span className="font-light text-[#D9BCEC]">mais opera</span>
          </h2>
        </div>
        <p className="max-w-[340px] text-[16px] font-light leading-[1.75] text-white/75">
          Três frentes em que temos rede própria de parceiros, guias e operadoras, construída destino por destino.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-12">
        {destinations.map((destination, index) => <DestinationCard key={destination.name} destination={destination} index={index} />)}
      </div>

      <div className="mt-9 flex flex-col gap-3 border-t border-white/20 pt-7 md:flex-row md:items-center md:justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[.19em] text-[#C9A6E0]">Outros destinos</span>
        <p className="max-w-[790px] text-[15px] font-light leading-relaxed text-white/75">
          Para outros destinos, fale com a gente. <strong className="font-semibold text-white">Trabalhamos com operadoras e parceiros no mundo todo.</strong>
        </p>
      </div>
    </div>
  </section>
);

const DestinationCard = ({ destination, index }: { destination: typeof destinations[number]; index: number }) => {
  const { ref, visible } = useReveal();
  return (
    <a
      href="#formulario"
      aria-label={`Falar sobre uma viagem para ${destination.name}`}
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} group relative isolate min-w-0 overflow-hidden rounded-[5px] h-[340px] md:h-[350px] lg:h-auto ${destination.layout}`}
      style={{ transitionDelay: `${index * 75}ms` }}
    >
      <img src={destination.img} alt={destination.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.055] group-hover:saturate-[1.15] motion-reduce:transition-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C042A]/92 via-[#1C042A]/25 to-[#1C042A]/5 transition-colors duration-500 group-hover:from-[#1C042A]/95" />
      <div className="absolute inset-4 border border-white/25 transition-all duration-500 group-hover:inset-5 group-hover:border-[#C9A6E0]/70 motion-reduce:transition-none" aria-hidden="true" />
      <div className="absolute left-8 top-8 flex items-center gap-2 text-[11px] font-bold tracking-[.16em] text-white/85">
        <span className="text-[#D9BCEC]">0{index + 1}</span>
        <span className="h-px w-6 bg-white/60" aria-hidden="true" />
        VIAGEM COMPLETA
      </div>
      <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold leading-tight text-white">{destination.name}</h3>
          <p className="mt-2 max-w-[420px] text-[13px] font-light leading-relaxed text-white/85">{destination.detail}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 text-white transition-colors group-hover:border-[#C9A6E0] group-hover:bg-[#C9A6E0] group-hover:text-[#2C0640]" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </a>
  );
};

export default DestinationsGrid;

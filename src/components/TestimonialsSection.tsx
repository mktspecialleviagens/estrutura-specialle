import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

/**
 * Depoimentos em vídeo vertical (9:16).
 *
 * Para publicar um depoimento, coloque o arquivo em
 * `src/assets/depoimentos/` com o nome `depoimento-1.mp4` até `depoimento-4.mp4`.
 * A capa é opcional e usa o mesmo número: `depoimento-1.jpg` (também aceita
 * .jpeg, .png e .webp). Sem capa o card mostra um fundo da paleta com o play.
 *
 * O card só existe se o arquivo de vídeo existir, então nada de espaço vazio
 * no grid. Nenhum vídeo começa sozinho e nenhum byte é baixado antes do
 * clique: o `src` só entra no elemento quando a pessoa aperta o play.
 *
 * A legenda é opcional. Preencha nome e destino em `legendas` na posição
 * correspondente ao número do arquivo; deixe vazio para o card ficar sem legenda.
 */
const legendas: Array<{ nome: string; destino: string }> = [
  { nome: "", destino: "" }, // depoimento-1
  { nome: "", destino: "" }, // depoimento-2
  { nome: "", destino: "" }, // depoimento-3
  { nome: "", destino: "" }, // depoimento-4
];

const videoFiles = import.meta.glob("../assets/depoimentos/depoimento-*.mp4", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const posterFiles = import.meta.glob("../assets/depoimentos/depoimento-*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const findAsset = (files: Record<string, string>, numero: number) =>
  Object.entries(files).find(([path]) => path.includes(`/depoimento-${numero}.`))?.[1];

type Depoimento = { numero: number; src: string; poster?: string; nome: string; destino: string };

const depoimentos: Depoimento[] = [1, 2, 3, 4]
  .map((numero) => ({
    numero,
    src: findAsset(videoFiles, numero),
    poster: findAsset(posterFiles, numero),
    nome: legendas[numero - 1]?.nome ?? "",
    destino: legendas[numero - 1]?.destino ?? "",
  }))
  .filter((item): item is Depoimento => Boolean(item.src));

const TestimonialsSection = () => {
  const pending = depoimentos.length === 0;

  return (
    <section id="depoimentos" className="section-padding" style={{ background: "#F4F0F7" }}>
      <div className="container max-w-[1200px]">
        <div className="max-w-[760px] mb-12 md:mb-16">
          <span className="eyebrow text-specialle-purple mb-5 block">Quem já viajou com a gente</span>
          <h2 className="leading-[1.1] text-[#280046]" style={{ fontSize: "clamp(26px, 4.5vw, 52px)", fontWeight: 600 }}>
            O que dizem os <span className="font-light text-specialle-violet">nossos clientes</span>
          </h2>
          {pending && (
            <p className="mt-6 rounded-md border border-dashed border-specialle-violet/50 bg-white px-5 py-4 text-[14px] leading-relaxed text-[#280046]">
              <strong className="font-semibold">Bloco pendente.</strong> Coloque os vídeos verticais em
              <code className="mx-1 rounded bg-[#F4F0F7] px-1.5 py-0.5 text-[13px]">src/assets/depoimentos/</code>
              com os nomes de <code className="rounded bg-[#F4F0F7] px-1.5 py-0.5 text-[13px]">depoimento-1.mp4</code> a
              <code className="mx-1 rounded bg-[#F4F0F7] px-1.5 py-0.5 text-[13px]">depoimento-4.mp4</code>, com
              autorização do cliente para publicar. Capa e legenda são opcionais.
            </p>
          )}
        </div>

        {!pending && (
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {depoimentos.map((depoimento, index) => (
              <TestimonialVideo key={depoimento.numero} depoimento={depoimento} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const TestimonialVideo = ({ depoimento, index }: { depoimento: Depoimento; index: number }) => {
  const { ref, visible } = useReveal();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const temLegenda = Boolean(depoimento.nome || depoimento.destino);
  const descricao = temLegenda
    ? `Depoimento de ${[depoimento.nome, depoimento.destino].filter(Boolean).join(", ")}`
    : "Depoimento de cliente da Specialle Viagens";

  const play = () => {
    setPlaying(true);
    // O elemento só ganha o src neste momento, então o play espera a renderização.
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  };

  return (
    <figure
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} flex h-full flex-col`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-[#280046] shadow-sm">
        {playing ? (
          <video
            ref={videoRef}
            src={depoimento.src}
            poster={depoimento.poster}
            controls
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            aria-label={descricao}
          />
        ) : (
          <button
            type="button"
            onClick={play}
            aria-label={`Reproduzir ${descricao.toLowerCase()}`}
            className="group absolute inset-0 h-full w-full"
          >
            {depoimento.poster ? (
              <img
                src={depoimento.poster}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: "linear-gradient(160deg, #280046 0%, #6E3B96 100%)" }}
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-[#120020]/75 via-[#120020]/10 to-transparent" aria-hidden="true" />
            <span
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-[#1A002E]/55 text-white transition-colors group-hover:border-[#C9A6E0] group-hover:bg-[#C9A6E0] group-hover:text-[#1A002E] md:h-16 md:w-16"
              aria-hidden="true"
            >
              <Play size={22} className="ml-0.5" fill="currentColor" strokeWidth={0} />
            </span>
            {temLegenda && (
              <span className="absolute bottom-3 left-3 right-3 block text-left text-[12px] font-semibold leading-snug text-white md:text-[13px]">
                {depoimento.nome}
              </span>
            )}
          </button>
        )}
      </div>

      {temLegenda && (
        <figcaption className="mt-3 px-0.5">
          {depoimento.nome && (
            <span className="block text-[14px] font-semibold text-[#280046] md:text-[15px]">{depoimento.nome}</span>
          )}
          {depoimento.destino && (
            <span className="mt-0.5 block text-[12px] text-foreground/60 md:text-[13px]">{depoimento.destino}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export default TestimonialsSection;

import { Quote } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

/**
 * PLACEHOLDER — aguardando material autorizado da Specialle.
 * Trocar `pending` para false e preencher `depoimentos` com três mensagens reais
 * de clientes (nome, destino, ano e autorização para publicar). Se houver foto do
 * cliente no destino, acrescentar o campo `foto`.
 */
const pending = true;

const depoimentos = [
  { nome: "Nome do cliente", destino: "Destino", ano: "Ano", texto: "Mensagem de WhatsApp do cliente, publicada com autorização." },
  { nome: "Nome do cliente", destino: "Destino", ano: "Ano", texto: "Mensagem de WhatsApp do cliente, publicada com autorização." },
  { nome: "Nome do cliente", destino: "Destino", ano: "Ano", texto: "Mensagem de WhatsApp do cliente, publicada com autorização." },
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="section-padding" style={{ background: "#F4F0F7" }}>
      <div className="container max-w-[1200px]">
        <div className="max-w-[760px] mb-12 md:mb-16">
          <span className="eyebrow text-specialle-purple mb-5 block">Quem já viajou com a gente</span>
          <h2 className="leading-[1.1] text-[#430A62]" style={{ fontSize: "clamp(26px, 4.5vw, 52px)", fontWeight: 600 }}>
            O que dizem os <span className="font-light text-specialle-violet">nossos clientes</span>
          </h2>
          {pending && (
            <p className="mt-6 rounded-md border border-dashed border-specialle-violet/50 bg-white px-5 py-4 text-[14px] leading-relaxed text-[#430A62]">
              <strong className="font-semibold">Bloco pendente.</strong> Substituir pelos três depoimentos
              reais, com nome, destino, ano e autorização para publicar. Fotos dos clientes no destino são opcionais.
            </p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {depoimentos.map((d, i) => <TestimonialCard key={i} depoimento={d} index={i} />)}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ depoimento, index }: { depoimento: typeof depoimentos[number]; index: number }) => {
  const { ref, visible } = useReveal();
  return (
    <figure
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} flex h-full flex-col justify-between rounded-lg bg-white p-7 md:p-8 ${pending ? "border border-dashed border-specialle-violet/40" : "border border-border shadow-sm"}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <Quote size={26} className="text-specialle-lilac" aria-hidden="true" />
      <blockquote className={`mt-5 flex-1 text-[16px] leading-relaxed ${pending ? "text-foreground/45 italic" : "text-foreground/85"}`}>
        {depoimento.texto}
      </blockquote>
      <figcaption className="mt-7 border-t border-border pt-5">
        <span className={`block text-[15px] font-semibold ${pending ? "text-foreground/45" : "text-[#430A62]"}`}>{depoimento.nome}</span>
        <span className="mt-1 block text-[13px] text-foreground/60">{depoimento.destino} · {depoimento.ano}</span>
      </figcaption>
    </figure>
  );
};

export default TestimonialsSection;

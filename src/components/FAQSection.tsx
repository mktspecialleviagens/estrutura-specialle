import { Plus } from "lucide-react";

const questions = [
  {
    question: "Por que vocês não são os mais baratos?",
    answer: "Porque a gente não vende só a reserva. Vende a viagem organizada, com fornecedor testado, guia que fala português e acompanhamento durante o período todo. Quem procura só o menor preço encontra na internet.",
  },
  {
    question: "Preciso ir até o escritório?",
    answer: "Não. A gente atende por WhatsApp e por reunião online. Se você mora em Fortaleza e prefere conversar pessoalmente, o escritório está aberto com hora marcada.",
  },
  {
    question: "Vocês já foram nos destinos que vendem?",
    answer: "A gente opera com parceiros locais e guias privativos nos destinos que trabalha. O cliente é recebido no aeroporto e acompanhado por alguém que fala português.",
  },
  {
    question: "Vocês cuidam do visto também?",
    answer: "Sim. Fazemos visto americano e de outros países para nossos clientes.",
  },
  {
    question: "Em quanto tempo recebo a proposta?",
    answer: "Depois da nossa conversa, normalmente entre dois e quatro dias úteis, conforme o destino e o número de pessoas.",
  },
];

const FAQSection = () => (
  <section id="perguntas" className="section-padding bg-white">
    <div className="container max-w-[1000px] grid md:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-20">
      <div>
        <span className="eyebrow text-specialle-violet block mb-4">Antes de falar com a gente</span>
        <h2 className="text-[#280046] text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.1]" style={{ fontWeight: 600 }}>Dúvidas frequentes</h2>
        <p className="text-[#231F20]/70 font-light leading-relaxed mt-5">O que mais perguntam para a nossa equipe antes de fechar uma viagem.</p>
      </div>
      <div className="border-t border-[#280046]/15">
        {questions.map(({ question, answer }) => (
          <details key={question} className="group border-b border-[#280046]/15">
            <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer text-[#280046] list-none [&::-webkit-details-marker]:hidden">
              <span className="text-[16px] md:text-[17px] font-semibold leading-snug">{question}</span>
              <Plus size={19} className="shrink-0 text-specialle-violet transition-transform group-open:rotate-45" aria-hidden="true" />
            </summary>
            <p className="pb-6 pr-8 text-[15px] font-light leading-relaxed text-[#231F20]/80">{answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FAQSection;

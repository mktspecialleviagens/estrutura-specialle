import { Plus } from "lucide-react";

type Question = {
  question: string;
  answer: string;
  items?: Array<{ destino: string; texto: string }>;
  closing?: string;
};

const questions: Question[] = [
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
    question: "Vocês cuidam de visto e de autorização eletrônica (ETA)?",
    answer: "Sim. Fazemos o visto americano e o de outros países, e também as autorizações eletrônicas de viagem, as ETAs, que alguns destinos passaram a exigir no lugar do visto. Onde cada uma se aplica hoje, para quem viaja com passaporte brasileiro:",
    items: [
      {
        destino: "Estados Unidos",
        texto: "Visto de turismo B1/B2. O Brasil fica fora do programa de isenção de vistos americano, então a ESTA não vale para o passaporte brasileiro.",
      },
      {
        destino: "Reino Unido",
        texto: "ETA, obrigatória para brasileiros desde 8 de janeiro de 2025. Vale para visitas de até 6 meses, cada pessoa precisa da sua, inclusive crianças, e ela é exigida até de quem faz só conexão passando pelo controle de fronteira.",
      },
      {
        destino: "Canadá",
        texto: "eTA para quem chega de avião e teve visto canadense nos últimos 10 anos ou tem visto americano válido. Nos demais casos, e em qualquer chegada por terra ou por mar, incluindo cruzeiro, o visto continua obrigatório.",
      },
      {
        destino: "Europa",
        texto: "O ETIAS foi anunciado para 30 países europeus e ainda não tem data de início. Até lá, a entrada segue sem autorização prévia, com o limite de 90 dias dentro de cada período de 180.",
      },
    ],
    closing: "Regras de entrada mudam com frequência. A gente confere a exigência de cada destino na fonte oficial no momento de montar a sua viagem.",
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
        {questions.map(({ question, answer, items, closing }) => (
          <details key={question} className="group border-b border-[#280046]/15">
            <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer text-[#280046] list-none [&::-webkit-details-marker]:hidden">
              <span className="text-[16px] md:text-[17px] font-semibold leading-snug">{question}</span>
              <Plus size={19} className="shrink-0 text-specialle-violet transition-transform group-open:rotate-45" aria-hidden="true" />
            </summary>
            <div className="pb-6 pr-8">
              <p className="text-[15px] font-light leading-relaxed text-[#231F20]/80">{answer}</p>
              {items && (
                <ul className="mt-4 space-y-3 border-l border-specialle-lilac pl-4">
                  {items.map(({ destino, texto }) => (
                    <li key={destino} className="text-[15px] font-light leading-relaxed text-[#231F20]/80">
                      <strong className="font-semibold text-[#280046]">{destino}:</strong> {texto}
                    </li>
                  ))}
                </ul>
              )}
              {closing && (
                <p className="mt-4 text-[14px] font-light leading-relaxed text-[#231F20]/65">{closing}</p>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FAQSection;

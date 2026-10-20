const bullets = [
  "Voo que conecta errado",
  "Hotel bem avaliado no site e mal localizado na prática",
  "Passeio esgotado três meses antes",
  "Restaurante que só aceita reserva com antecedência",
  "Documento que ninguém avisou que precisava",
];

const ProblemSection = () => {
  return (
    <section id="problema" className="section-padding" style={{ background: "#FFFFFF" }}>
      <div className="container max-w-[1100px]">
        <div className="max-w-[860px]">
          <span className="eyebrow text-specialle-purple mb-5 block">Antes de começar</span>
          <h2 className="leading-[1.1] mb-7 text-[#280046]" style={{ fontSize: "clamp(26px, 4.5vw, 52px)", fontWeight: 600 }}>
            Planejar uma viagem internacional dá{" "}
            <span className="font-light text-specialle-violet">mais trabalho do que parece</span>
          </h2>

          <ul className="space-y-3 mb-8">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 items-start">
                <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-specialle-violet" />
                <span className="text-[15px] md:text-[16px] text-foreground/85 leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          <p className="font-light text-foreground/75 mb-10" style={{ fontSize: "17px", lineHeight: 1.7 }}>
            E se algo sair do roteiro lá fora, você resolve em outro idioma, em outro fuso, sozinho.
          </p>

          <div
            className="p-8 md:p-10 rounded-lg"
            style={{ background: "linear-gradient(135deg, #280046, #6E3B96)", border: "1px solid rgba(201,166,224,0.22)" }}
          >
            <div className="h-[2px] w-10 mb-5" style={{ background: "#C9A6E0" }} />
            <p className="text-white font-light" style={{ fontSize: "clamp(18px, 2.6vw, 24px)", lineHeight: 1.5 }}>
              A maior parte das pessoas monta a viagem entre uma aba e outra do navegador e{" "}
              <strong className="font-semibold text-[#D9BCEC]">descobre o erro já no destino.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

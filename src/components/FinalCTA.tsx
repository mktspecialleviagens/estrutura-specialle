import ctaImg from "@/assets/cta-lisboa.jpg";

const FinalCTA = () => {
  const scrollToForm = () => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="relative overflow-hidden section-padding bg-[#1A002E]">
      <img
        src={ctaImg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(26,0,46,0.88), rgba(40,0,70,0.74))" }}
      />
      {/* Decorative concentric circles */}
      <div className="absolute -top-32 -right-32 pointer-events-none" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="absolute rounded-full border"
            style={{
              borderColor: "rgba(255,255,255,0.07)",
              width: `${n * 180}px`,
              height: `${n * 180}px`,
              top: `${-n * 90}px`,
              right: `${-n * 90}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container max-w-[680px] text-center">
        <span className="eyebrow text-specialle-lilac mb-5 block">Próximo passo</span>
        <h2 className="text-white leading-[1.1] mb-6" style={{ fontSize: "clamp(26px, 4.5vw, 50px)", fontWeight: 600 }}>
          A sua próxima viagem pode começar <span className="font-light text-[#D9BCEC]">resolvida</span>
        </h2>
        <p className="font-light text-white/85 mb-10 max-w-[560px] mx-auto" style={{ fontSize: "17px", lineHeight: 1.7 }}>
          Conte para a gente para onde você quer ir e quando. A partir daí, a Specialle cuida do resto.
        </p>
        <button onClick={scrollToForm} className="btn-on-gradient">
          Quero falar sobre a minha viagem →
        </button>
        <p className="mt-5 text-[13px] text-specialle-lilac">
          Atendimento por WhatsApp ou presencial, na Washington Soares.
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;

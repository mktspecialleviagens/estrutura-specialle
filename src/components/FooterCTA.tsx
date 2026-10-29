const CONTACT_LINK = "/#formulario";

const FooterCTA = () => {
  return (
    <footer style={{ background: "#1A002E" }}>
      <div className="container flex flex-col md:flex-row items-center justify-between gap-5 py-10">
        <img
          src="/brand/logo.webp"
          alt="Specialle Viagens"
          width={2000}
          height={667}
          loading="lazy"
          className="h-11 w-auto"
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <div className="text-center text-[13px] leading-relaxed text-specialle-lilac md:text-right">
          <p>Avenida Washington Soares, Fortaleza</p>
          <p className="mt-2 text-white/80">
            Escritório: segunda a sexta, das 9h às 18h. Atendimento presencial com horário marcado ou por ordem de chegada.
          </p>
          <p className="text-white/80">Sábado e domingo: escritório fechado.</p>
          {/* O plantão é assistência a quem já está viajando, não canal de vendas
              fora do horário. Em caixa destacada porque é o que tranquiliza quem
              ainda está decidindo, e como linha solta passava despercebido. */}
          <div className="mt-3 inline-flex items-start gap-2.5 rounded-xl border border-specialle-lilac/40 bg-white/[.07] px-4 py-3 text-left">
            <span aria-hidden="true" className="text-base leading-none">🛟</span>
            <span className="text-[12.5px] leading-relaxed">
              <strong className="font-semibold text-specialle-lilac">Plantão 24h no WhatsApp</strong>
              <span className="block text-white/80">
                Assistência a quem já está em viagem, sete dias por semana, inclusive feriados.
              </span>
            </span>
          </div>
          <p className="mt-3 text-white/55">
            © {new Date().getFullYear()} Specialle Viagens. Todos os direitos reservados.
          </p>
        </div>
      </div>

      <div
        className="border-t border-white/10 px-5 py-4"
        style={{ background: "rgba(0,0,0,.18)" }}
      >
        <p className="text-center text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,.55)" }}>
          Viagens internacionais desde 1996 ·{" "}
          <a
            href={CONTACT_LINK}
            style={{ color: "rgba(255,255,255,.8)" }}
            className="underline underline-offset-2 hover:text-white transition-colors"
          >
            Fale com a gente
          </a>
        </p>
      </div>
    </footer>
  );
};

export default FooterCTA;

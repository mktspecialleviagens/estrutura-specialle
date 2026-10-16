const CONTACT_LINK = "/#formulario";

const FooterCTA = () => {
  return (
    <footer style={{ background: "#2C0640" }}>
      <div className="container flex flex-col md:flex-row items-center justify-between gap-5 py-10">
        <div className="flex flex-col items-center leading-none md:items-start">
          <span className="script text-offwhite text-[38px] -mb-1">Specialle</span>
          <span className="text-[8px] font-semibold tracking-[0.42em] text-specialle-lilac">VIAGENS</span>
        </div>
        <p className="text-center text-[13px] text-specialle-lilac md:text-right">
          Avenida Washington Soares, Fortaleza · Atendimento com hora marcada
          <span className="mt-1 block text-white/55">
            © {new Date().getFullYear()} Specialle Viagens. Todos os direitos reservados.
          </span>
        </p>
      </div>

      <div
        className="border-t border-white/10 py-4"
        style={{ background: "rgba(0,0,0,.18)" }}
      >
        <p className="text-center text-[12px]" style={{ color: "rgba(255,255,255,.55)" }}>
          Viagens internacionais desde 1997 ·{" "}
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

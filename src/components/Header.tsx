import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links: Array<[string, string]> = [
  ["Como funciona", "como-funciona"],
  ["Destinos", "destinos"],
  ["Sobre", "sobre"],
  ["Dúvidas", "perguntas"],
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-slide-down ${
        scrolled ? "py-3 shadow-lg" : "py-5"
      }`}
      style={{
        background: scrolled ? "rgba(44,6,64, 0.9)" : "rgba(44,6,64, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="container flex items-center justify-between gap-5">
        <button onClick={() => scrollTo("hero")} aria-label="Specialle Viagens" className="flex flex-col items-start leading-none">
          <span className="script text-offwhite text-[40px] md:text-[48px] -mb-1">Specialle</span>
          <span className="font-sans text-[8px] md:text-[9px] font-semibold tracking-[0.42em] text-specialle-lilac">VIAGENS</span>
        </button>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
          {links.map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="nav-link text-[13px] font-semibold uppercase tracking-[0.16em] text-offwhite hover:text-specialle-lilac"
            >
              {label}
            </button>
          ))}
          <button onClick={() => scrollTo("formulario")} className="btn-brand !py-2.5 !px-5 !text-[12px]">
            Falar sobre minha viagem
          </button>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-offwhite p-2"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden mt-3 mx-4 rounded-lg border border-white/20" style={{ background: "rgba(44, 6, 64, 0.97)", backdropFilter: "blur(16px)" }}>
          <nav className="flex flex-col py-4 px-5 gap-3">
            {links.map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-[14px] font-semibold uppercase tracking-[0.16em] text-offwhite hover:text-specialle-lilac py-2"
              >
                {label}
              </button>
            ))}
            <button onClick={() => scrollTo("formulario")} className="btn-brand mt-2 !py-3">
              Falar sobre minha viagem
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

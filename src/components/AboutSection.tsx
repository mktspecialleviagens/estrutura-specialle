import sobreImg from "@/assets/sobre-specialle.jpg";

const AboutSection = () => (
  <section id="sobre" className="section-padding bg-offwhite">
    <div className="container max-w-[1200px] grid items-center gap-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] md:gap-14 lg:gap-24">
      <figure className="relative min-w-0 w-full">
        {/* PLACEHOLDER — trocar pelas fotos do escritório da Specialle (varanda e mapa de acrílico). */}
        <img
          src={sobreImg}
          alt="Mapa, passaporte e câmera sobre a mesa durante o planejamento de uma viagem"
          className="w-full aspect-[4/4.2] object-cover rounded-[5px] md:aspect-[4/5]"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-sm bg-[#280046] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
          Foto provisória
        </span>
        <figcaption className="text-xs tracking-[0.12em] uppercase text-foreground/60 mt-4">
          Substituir pelas fotos do escritório · Washington Soares, Fortaleza
        </figcaption>
      </figure>
      <div className="min-w-0">
        <span className="eyebrow text-specialle-violet mb-6 block">Quem está por trás</span>
        <h2 className="max-w-[560px] leading-[1.06] text-[#280046] [text-wrap:balance]" style={{ fontSize: "clamp(28px, 4.5vw, 54px)", fontWeight: 600 }}>
          29 anos <span className="font-light text-specialle-violet">organizando viagens</span>
        </h2>
        <div className="mt-8 space-y-5 border-l border-specialle-lilac pl-5 text-[16px] font-light leading-[1.8] text-foreground/80 md:pl-7">
          <p>A Specialle Viagens nasceu em Fortaleza e desde o começo trabalha com turismo internacional.</p>
          <p>Nesses 29 anos foram milhares de viagens organizadas, clientes que voltam há mais de uma década e uma rede de parceiros construída destino por destino.</p>
          <p>Nosso escritório fica na Avenida Washington Soares, ao lado do Centro de Eventos, e recebe clientes com hora marcada.</p>
        </div>
      </div>
    </div>
  </section>
);
export default AboutSection;

const items = ["Orlando", "Miami", "Portugal", "Espanha", "Itália", "França", "Cruzeiros"];
const loop = [...items, ...items, ...items];

const DestinationsStrip = () => {
  return (
    <section aria-label="Destinos que a Specialle Viagens mais opera" className="overflow-hidden py-5" style={{ background: "#430A62" }}>
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {loop.map((destino, i) => (
          <div key={`${destino}-${i}`} className="flex items-center px-8">
            <span
              className="text-white"
              style={{ fontFamily: '"Montserrat", system-ui, sans-serif', fontSize: "15px", letterSpacing: "0.22em", fontWeight: 500, textTransform: "uppercase" }}
            >
              {destino}
            </span>
            <span className="ml-8 text-specialle-lilac text-xl" aria-hidden>·</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DestinationsStrip;

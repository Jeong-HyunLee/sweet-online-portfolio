const AboutSection = () => (
  <section className="py-20">
    <div className="container max-w-4xl">
      <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        Jeong-Hyun Lee, PhD
      </h2>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
      <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">My research interest mainly lies in paleoecology of the Cambrian and Ordovician</strong>, beginning of the Phanerozoic. In order to understand this time interval, I focus on carbonate sedimentology and invertebrate fossils such as sponges and calcified microbes.
        </p>
        <p>
          Understanding how organisms evolved along with changes in environmental condition is of my primary interest. I also use tools such as chemostratigraphy and provenance of siliciclastic sediment to understand the time interval.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { label: "Focus", value: "Cambrian–Ordovician Paleoecology" },
          { label: "Methods", value: "Carbonate Sedimentology & Chemostratigraphy" },
          { label: "Organisms", value: "Sponges & Calcified Microbes" },
        ].map((item) => (
          <div key={item.label} className="rounded-md border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">{item.label}</p>
            <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;

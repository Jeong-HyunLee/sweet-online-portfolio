import heroImage from "@/assets/hero-geology.jpg";

const HeroSection = () => (
  <section id="home" className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
    <img
      src={heroImage}
      alt="Geological rock formations showing sedimentary strata"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
    <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
      <div className="mb-6 inline-block rounded-sm bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
        Now recruiting MS, PhD &amp; Postdoc researchers
      </div>
      <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
        Invertebrate Paleontology &amp; Carbonate Sedimentology
      </h1>
      <p className="mt-4 text-sm font-medium text-primary-foreground/70 uppercase tracking-widest">
        Prof. Jeong-Hyun Lee
      </p>
      <p className="mt-4 text-lg font-light text-primary-foreground/80">
        Department of Geological Sciences, Chungnam National University
        <br />
        Daejeon 34134, Republic of Korea
      </p>
    </div>
  </section>
);

export default HeroSection;

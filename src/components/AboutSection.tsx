import { GraduationCap, Briefcase, Award, BookOpen } from "lucide-react";

const education = [
  { degree: "Ph.D.", school: "Seoul National University", years: "2010–2014", topic: "Cambrian microbial reefs in Shandong Province, China" },
  { degree: "M.S.", school: "Seoul National University", years: "2008–2010", topic: "Paleoenvironmental implications of extensive maceriate microbialites" },
  { degree: "B.S.", school: "Seoul National University", years: "2004–2008", topic: "Double major in Earth & Environmental Sciences (Geology) and Biology" },
];

const employment = [
  { role: "Professor", place: "Chungnam National University", years: "2026–Present" },
  { role: "Associate Professor", place: "Chungnam National University", years: "2020–2026" },
  { role: "Visiting Associate Professor", place: "University of Tennessee, Knoxville", years: "2022–2023" },
  { role: "Assistant Professor", place: "Chungnam National University", years: "2016–2020" },
  { role: "Postdoctoral Researcher", place: "University of Tennessee, Knoxville", years: "2015–2016" },
];

const awards = [
  { year: "2021", title: "Kamide Lecture Award", org: "Asia Oceania Geosciences Society" },
  { year: "2017", title: "Young Geologist Award", org: "Geological Society of Korea (70th Anniversary)" },
  { year: "2017", title: "Best Reviewer Award", org: "Journal of the Geological Society of Korea" },
  { year: "2017", title: "Young Scientist Award", org: "Joint Conference of Geological Science & Technology of Korea" },
  { year: "2015", title: "Best Presentation Award", org: "Joint Conference of Geological Science & Technology of Korea" },
];

const AboutSection = () => (
  <section id="about" className="py-20">
    <div className="container max-w-5xl">
      {/* Header */}
      <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        Jeong-Hyun Lee, PhD
      </h2>
      <p className="mt-1 text-lg font-medium text-accent">
        Professor of Carbonate Sedimentology &amp; Invertebrate Paleontology
      </p>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      {/* Research description */}
      <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">My research interest mainly lies in paleoecology of the Cambrian and Ordovician</strong>, the beginning of the Phanerozoic. In order to understand this time interval, I focus on carbonate sedimentology and invertebrate fossils such as sponges and calcified microbes.
        </p>
        <p>
          Understanding how organisms evolved along with changes in environmental conditions is of my primary interest. I also use tools such as chemostratigraphy and provenance analysis of siliciclastic sediment. My lab has published 63+ journal articles (h-index 23, 1,466 citations).
        </p>
      </div>

      {/* Research focus cards */}
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

      {/* Education */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="text-accent" size={24} />
          <h3 className="font-display text-2xl font-bold text-primary">Education</h3>
        </div>
        <div className="space-y-4">
          {education.map((e) => (
            <div key={e.degree} className="rounded-md border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-foreground">{e.degree} — {e.school}</p>
                <span className="text-xs font-medium text-accent">{e.years}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{e.topic}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Employment */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="text-accent" size={24} />
          <h3 className="font-display text-2xl font-bold text-primary">Employment</h3>
        </div>
        <div className="relative border-l-2 border-accent/30 pl-6 space-y-6">
          {employment.map((e) => (
            <div key={e.role + e.years} className="relative">
              <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-accent" />
              <p className="font-semibold text-foreground">{e.role}</p>
              <p className="text-sm text-muted-foreground">{e.place}</p>
              <span className="text-xs font-medium text-accent">{e.years}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <Award className="text-accent" size={24} />
          <h3 className="font-display text-2xl font-bold text-primary">Awards &amp; Honors</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {awards.map((a) => (
            <div key={a.title} className="rounded-md border bg-card p-5">
              <span className="text-xs font-semibold text-accent">{a.year}</span>
              <p className="mt-1 font-semibold text-foreground text-sm">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.org}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Grants */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-accent" size={24} />
          <h3 className="font-display text-2xl font-bold text-primary">Selected Grants</h3>
        </div>
        <div className="space-y-4">
          {[
            { years: "2023–2032", title: "Hanwoomul-Phagi Basic Research Grant: Paleoecology and evolution of reefs", amount: "₩1.89B", funder: "National Research Foundation of Korea" },
            { years: "2023–2027", title: "Development of exploration and mining technology on domestic titanium ore", amount: "₩12.4B (CNU ₩1.75B)", funder: "Korea Energy Technology Evaluation and Planning" },
            { years: "2024–2027", title: "Multiscale and multidisciplinary research on the Paleozoic Yeongweol sedimentary complex", amount: "₩900M", funder: "National Research Foundation of Korea" },
            { years: "2019–2022", title: "Outstanding Young Scientist Grant: Comparative study on early Paleozoic paleoecology", amount: "₩550M", funder: "National Research Foundation of Korea" },
          ].map((g) => (
            <div key={g.title} className="rounded-md border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-accent">{g.years}</span>
                <span className="text-xs font-medium text-muted-foreground">{g.amount}</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">{g.title}</p>
              <p className="text-xs text-muted-foreground">{g.funder}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;

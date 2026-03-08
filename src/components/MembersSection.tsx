import { Users, GraduationCap } from "lucide-react";

interface Member {
  name: string;
  role: string;
  topic: string;
  period: string;
}

const currentMembers: Member[] = [
  { name: "María del Mar Simonet Roda", role: "Postdoc", topic: "EBSD analysis of stromatolites and calcimicrobes", period: "2021–present" },
  { name: "Diego Torromé", role: "Postdoc", topic: "Microfacies and geochemistry of Jurassic sponge-microbial reefs", period: "2025–present" },
  { name: "Ja Yeon Sohn", role: "MS Student", topic: "C & O isotope analysis of gypsum-bearing lacustrine stromatolite", period: "2024–present" },
  { name: "Hyungi Lee", role: "MS Student", topic: "Paleontology of mantis shrimp from the Miocene of Pohang", period: "2025–present" },
  { name: "Jung Mi Kim", role: "MS Student", topic: "Paleontology of sunfish from the Miocene of Pohang", period: "2025–present" },
  { name: "Su Yeong Cho", role: "Undergraduate", topic: "Petrography of Recent Great Salt Lake stromatolites", period: "2024–present" },
];

const alumni: Member[] = [
  { name: "Juwan Jeon", role: "Postdoc → Sejong Science Fellow", topic: "Paleontology, paleogeography and paleoecology of stromatoporoids", period: "2023–2025" },
  { name: "Seunghoon Lee", role: "MS → Daejeon City Hall", topic: "Phytoclast tufas in the Jinju Formation (Lower Cretaceous)", period: "2021–2024" },
  { name: "Min-Kyu Oh", role: "MS/PhD → Institute of Mineral and Energy Resources", topic: "Sedimentary facies analysis of the Myobong Formation (lower Cambrian)", period: "2018–2024" },
  { name: "Hoang Duy Phạm", role: "MS → Schlumberger", topic: "Keratose sponge–microbial carbonate consortium in the Lower Ordovician", period: "2018–2020" },
];

const roleColor: Record<string, string> = {
  Postdoc: "bg-accent/15 text-accent",
  "MS Student": "bg-primary/10 text-primary",
  Undergraduate: "bg-secondary text-secondary-foreground",
};

const MembersSection = () => (
  <section id="members" className="py-20">
    <div className="container max-w-5xl">
      <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        Lab Members
      </h2>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      {/* Current — featured layout: first 2 bigger, rest in grid */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-accent" size={22} />
          <h3 className="font-display text-xl font-bold text-primary">Current Members</h3>
        </div>

        {/* Featured postdocs */}
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          {currentMembers.slice(0, 2).map((m) => (
            <div key={m.name} className="rounded-md border-l-4 border-accent bg-card p-6">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-foreground">{m.name}</p>
                <span className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${roleColor[m.role] || "bg-secondary text-secondary-foreground"}`}>
                  {m.role}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{m.topic}</p>
              <p className="mt-2 text-xs font-medium text-accent">{m.period}</p>
            </div>
          ))}
        </div>

        {/* Remaining members in compact grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {currentMembers.slice(2).map((m) => (
            <div key={m.name} className="rounded-md border bg-card p-4">
              <span className={`inline-block rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2 ${roleColor[m.role] || "bg-secondary text-secondary-foreground"}`}>
                {m.role}
              </span>
              <p className="font-semibold text-foreground text-sm">{m.name}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{m.topic}</p>
              <p className="mt-1.5 text-[10px] font-medium text-accent">{m.period}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alumni — horizontal cards with arrow showing career path */}
      <div className="mt-14">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="text-accent" size={22} />
          <h3 className="font-display text-xl font-bold text-primary">Alumni</h3>
        </div>
        <div className="space-y-3">
          {alumni.map((m) => (
            <div key={m.name} className="rounded-md border bg-card/60 p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className="shrink-0 sm:w-48">
                <p className="font-semibold text-foreground text-sm">{m.name}</p>
                <p className="text-[10px] text-muted-foreground/60">{m.period}</p>
              </div>
              <div className="hidden sm:block text-accent text-lg">→</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-accent">{m.role}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.topic}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default MembersSection;

import { Mic } from "lucide-react";

interface Talk {
  date: string;
  venue: string;
  location: string;
  title: string;
  type?: string; // Keynote, Award Lecture, etc.
}

const talks: Talk[] = [
  {
    date: "October 2025",
    venue: "International Conference on the Co-evolution of Life and Environments on the North China Platform",
    location: "Qingdao, China",
    title: "Crystallographic evidence for cyanobacterial filaments in Upper Ordovician Renalcis from North China",
    type: "Keynote",
  },
  {
    date: "October 2024",
    venue: "4th Annual Meeting of IGCP735",
    location: "Córdoba, Argentina",
    title: "Microbial- to metazoan-dominated reef transition in the early Paleozoic",
    type: "Keynote",
  },
  {
    date: "August 2021",
    venue: "Asia Oceania Geosciences Society 18th Annual Meeting",
    location: "Singapore",
    title: "The early development of Paleozoic reefs linked with marine oxygenation",
    type: "Kamide Award Lecture",
  },
  {
    date: "July 2021",
    venue: "IGCP 668: Equatorial Gondwana History 2021 Annual Meeting",
    location: "Japan (Online)",
    title: "How young researchers can become a professional researcher",
    type: "Special Talk",
  },
  {
    date: "November 2019",
    venue: "1st Asian Palaeontological Congress",
    location: "Beijing, China",
    title: "Cambrian fine-grained stromatolites within oolite",
    type: "Keynote",
  },
  {
    date: "September 2022",
    venue: "Purdue University Fort Wayne",
    location: "Indiana, USA",
    title: "Early Paleozoic reef evolution and marine oxygenation",
  },
  {
    date: "April 2022",
    venue: "The University of Tennessee, Knoxville",
    location: "Tennessee, USA",
    title: "Marine oxygenation and the early development of Paleozoic reefs",
  },
  {
    date: "October 2022",
    venue: "Korea Polar Research Institute",
    location: "Korea",
    title: "Great Unconformity in the Korean Peninsula",
  },
  {
    date: "September 2019",
    venue: "Vrije Universiteit Brussel",
    location: "Belgium",
    title: "Marine oxygenation and the early development of Paleozoic reefs",
  },
  {
    date: "November 2016",
    venue: "12th Jeon Jae-Kyu Memorial Conference, Seoul National University",
    location: "Seoul, Korea",
    title: "Microbialites in geologic history: with emphasis on early Paleozoic reef transition",
  },
];

const InvitedTalksSection = () => (
  <section id="talks" className="py-20 bg-card/50">
    <div className="container max-w-5xl">
      <div className="flex items-center gap-3">
        <Mic className="text-accent" size={28} />
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">Invited Talks</h2>
      </div>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      {/* Featured keynotes */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {talks
          .filter((t) => t.type)
          .map((talk, i) => (
            <div key={i} className="rounded-md border-l-4 border-accent bg-card p-5">
              <span className="inline-block rounded-sm bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent mb-2">
                {talk.type}
              </span>
              <p className="text-sm font-semibold text-foreground leading-snug">{talk.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">{talk.venue}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{talk.location}</span>
                <span className="text-[11px] font-medium text-accent">{talk.date}</span>
              </div>
            </div>
          ))}
      </div>

      {/* Other invited talks */}
      <h3 className="mt-10 font-display text-lg font-bold text-primary">Seminar & Departmental Talks</h3>
      <div className="mt-4 space-y-2">
        {talks
          .filter((t) => !t.type)
          .map((talk, i) => (
            <div key={i} className="rounded-md border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <span className="shrink-0 text-xs font-medium text-accent sm:w-32">{talk.date}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">{talk.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{talk.venue} · {talk.location}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  </section>
);

export default InvitedTalksSection;

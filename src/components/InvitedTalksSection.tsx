import { Mic } from "lucide-react";
import { talks } from "@/data/talks";

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

import { useState } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { publications, type Publication } from "@/data/publications";

type TabKey = "all" | "journal" | "book";

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "journal", label: "Journal Articles" },
  { key: "book", label: "Book Chapters" },
];

const PublicationCard = ({ pub }: { pub: Publication }) => (
  <div className="group rounded-md border bg-card p-5 transition-colors hover:border-accent/50 flex gap-5">
    {/* Year pill */}
    <div className="hidden sm:flex flex-col items-center pt-0.5">
      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent whitespace-nowrap">
        {pub.year || "—"}
      </span>
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-2 sm:hidden mb-1">
        <span className="text-xs font-semibold text-accent">{pub.year || "—"}</span>
      </div>
      <p className="text-sm font-semibold text-foreground leading-snug">{pub.title}</p>
      <p className="mt-1.5 text-xs text-muted-foreground">{pub.authors}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <p className="text-xs italic text-muted-foreground">{pub.journal}</p>
        {pub.highlight && (
          <span className="rounded-sm bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
            {pub.highlight}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {pub.doi && (
          <a
            href={pub.doi}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-accent/30 bg-accent/5 px-3 py-1 text-[11px] font-semibold text-accent hover:bg-accent/15 transition-colors"
          >
            <ExternalLink size={12} /> DOI
          </a>
        )}
        {pub.pdfUrl && (
          <a
            href={pub.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-accent/30 bg-accent/5 px-3 py-1 text-[11px] font-semibold text-accent hover:bg-accent/15 transition-colors"
          >
            <FileText size={12} /> PDF
          </a>
        )}
      </div>
    </div>
  </div>
);

const PublicationsSection = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filtered = activeTab === "all" ? publications : publications.filter((p) => p.type === activeTab);

  return (
    <section id="publications" className="py-20 bg-card/50">
      <div className="container max-w-5xl">
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Publications
        </h2>
        <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

        {/* Metrics */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "63+", label: "Journal Articles" },
            { value: "23", label: "h-index" },
            { value: "1,496", label: "Citations" },
          ].map((m) => (
            <div key={m.label} className="border-l-4 border-accent rounded-r-md bg-card px-5 py-4">
              <p className="text-2xl font-bold text-primary font-display">{m.value}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">{m.label}</p>
            </div>
          ))}
          <a
            href="https://scholar.google.com/citations?user=siOMho4AAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/80"
          >
            Google Scholar <ExternalLink size={14} />
          </a>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex items-end gap-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">* corresponding author · § supervised student · # supervised postdoc</p>

        {/* Publication list */}
        <div className="mt-6 space-y-3">
          {filtered.map((pub, i) => (
            <PublicationCard key={i} pub={pub} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          View the complete list on{" "}
          <a
            href="https://scholar.google.com/citations?user=siOMho4AAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:underline"
          >
            Google Scholar
          </a>
        </p>
      </div>
    </section>
  );
};

export default PublicationsSection;

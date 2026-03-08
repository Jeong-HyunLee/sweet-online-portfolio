import { useState } from "react";
import { ExternalLink, FileText } from "lucide-react";

interface Publication {
  authors: string;
  year: string;
  title: string;
  journal: string;
  doi: string;
  highlight?: string;
  type: "journal" | "book";
  pdfUrl?: string;
}

const publications: Publication[] = [
  {
    authors: "Lee, H., Choi, T., Lee, J.-H.*",
    year: "2026",
    title: "Facies control on provenance shift during the early Cambrian transgression in Korea: Detrital zircon and geochemical evidence",
    journal: "Sedimentology, v. 73, 418–440",
    doi: "https://doi.org/10.1111/sed.70067",
    type: "journal",
  },
  {
    authors: "Lee, J.-H., Park, J.*, Seo, J., Choi, T., Park, S.-I., Lee, Y.-J., Lee, G.-J.",
    year: "2025",
    title: "The Great Unconformity in the eastern Sino-Korean Block: A synthesis",
    journal: "Earth-Science Reviews, v. 270, 105244",
    doi: "https://doi.org/10.1016/j.earscirev.2025.105244",
    type: "journal",
  },
  {
    authors: "Jeon, J., Li, Q.-J., Lee, J.-H.*",
    year: "2025",
    title: "Preservation bias obscures gradual Ordovician reef evolution",
    journal: "Proceedings of the National Academy of Sciences, v. 122",
    doi: "https://doi.org/10.1073/pnas.251140612",
    highlight: "PNAS",
    type: "journal",
  },
  {
    authors: "Jeon, J., Simonet Roda, M., Chen, Z.-Y., Luo, C., Kershaw, S., Kim, D., Ma, J.-Y., Lee, J.-H.*, Zhang, Y.-D.*",
    year: "2025",
    title: "Phosphatic stromatoporoid sponges formed reefs ~480 Mya",
    journal: "Proceedings of the National Academy of Sciences, v. 122",
    doi: "https://doi.org/10.1073/pnas.242610512",
    highlight: "PNAS · In This Issue",
    type: "journal",
  },
  {
    authors: "Simonet Roda, M., Kim, D., Brasier, A., Griesshaber, E., Lee, J.-H.*",
    year: "2024",
    title: "Exploring EBSD analysis as a tool for understanding stromatolite",
    journal: "Sedimentology, v. 71, 2448–2469",
    doi: "https://doi.org/10.1111/sed.13222",
    type: "journal",
  },
  {
    authors: "Lee, J.-H.*, Riding, R.",
    year: "2023",
    title: "Stromatolite-rimmed thrombolite columns and domes in late Cambrian biostromes, Texas, USA",
    journal: "Sedimentology, v. 70, 293–334",
    doi: "https://doi.org/10.1111/sed.13048",
    highlight: "Editors' Picks 2023",
    type: "journal",
  },
  {
    authors: "Lee, J.-H.*, Riding, R.",
    year: "2021",
    title: "The classic stromatolite Cryptozoön is a keratose sponge-microbial consortium",
    journal: "Geobiology, v. 19, 189–198",
    doi: "http://dx.doi.org/10.1111/GBI.12422",
    highlight: "Journal Cover · Most Cited 2020–22",
    type: "journal",
  },
  {
    authors: "Lee, J.-H.*, Riding, R.",
    year: "2018",
    title: "Marine oxygenation, lithistid sponges, and the early history of Paleozoic skeletal reefs",
    journal: "Earth-Science Reviews, v. 181, 98–121",
    doi: "https://doi.org/10.1016/j.earscirev.2018.04.003",
    type: "journal",
  },
  {
    authors: "Lee, J.-H.*, Chen, J., Chough, S.K.",
    year: "2015",
    title: "The middle–late Cambrian reef transition and related geological events: a review and new view",
    journal: "Earth-Science Reviews, v. 145, 66–84",
    doi: "https://doi.org/10.1016/j.earscirev.2015.03.002",
    type: "journal",
  },
  {
    authors: "Lee, J.-H.*",
    year: "2021",
    title: "Stromatolites (Encyclopedia of Geology, 2nd edition)",
    journal: "Elsevier, pp. 375–388",
    doi: "https://doi.org/10.1016/B978-0-12-409548-9.11974-8",
    highlight: "Book Chapter",
    type: "book",
  },
];

// PDF URLs are stored in Supabase storage. To add a PDF to a publication,
// upload it via the admin panel at /admin/publications, or manually set the
// pdfUrl field above to a public URL from the 'publication-pdfs' bucket.

type TabKey = "all" | "journal" | "book";

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "journal", label: "Journal Articles" },
  { key: "book", label: "Book Chapters" },
];

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
            { value: "1,466", label: "Citations" },
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
            <div
              key={i}
              className="group rounded-md border bg-card p-5 transition-colors hover:border-accent/50 flex gap-5"
            >
              {/* Year pill */}
              <div className="hidden sm:flex flex-col items-center pt-0.5">
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent whitespace-nowrap">
                  {pub.year}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:hidden mb-1">
                  <span className="text-xs font-semibold text-accent">{pub.year}</span>
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
                {/* Action links — visible on all sizes */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={pub.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-accent/30 bg-accent/5 px-3 py-1 text-[11px] font-semibold text-accent hover:bg-accent/15 transition-colors"
                  >
                    <ExternalLink size={12} /> DOI
                  </a>
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

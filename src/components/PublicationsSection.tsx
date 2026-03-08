import { useState, useMemo, useEffect, useCallback } from "react";
import { ExternalLink, FileText, Search, X, Tag, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { publications as staticPublications, type Publication, type ResearchTopic } from "@/data/publications";

type TabKey = "all" | "journal" | "book";

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "journal", label: "Journal Articles" },
  { key: "book", label: "Book Chapters" },
];

const topicColors: Record<ResearchTopic, string> = {
  "Phanerozoic Reef Evolution": "bg-blue-100 text-blue-800 border-blue-200",
  "Microbialites": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Sponge Paleontology": "bg-amber-100 text-amber-800 border-amber-200",
  "Joseon Supergroup": "bg-rose-100 text-rose-800 border-rose-200",
  "Other Studies": "bg-slate-100 text-slate-700 border-slate-200",
};

// Map topic names to Research section anchor IDs
const topicAnchors: Record<ResearchTopic, string> = {
  "Phanerozoic Reef Evolution": "research-phanerozoic-reef-evolution",
  "Microbialites": "research-microbialites",
  "Sponge Paleontology": "research-sponge-paleontology",
  "Joseon Supergroup": "research-joseon-supergroup",
  "Other Studies": "research-other-studies",
};

const PublicationCard = ({ pub }: { pub: Publication }) => (
  <div className="group rounded-md border bg-card p-5 transition-colors hover:border-accent/50 flex gap-5">
    <div className="hidden sm:flex flex-col items-center pt-0.5">
      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent whitespace-nowrap">
        {pub.year || "—"}
      </span>
    </div>
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

      {/* Research topic tags */}
      {pub.researchTopics && pub.researchTopics.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {pub.researchTopics.map((topic) => (
            <a
              key={topic}
              href={`#${topicAnchors[topic]}`}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium hover:opacity-80 transition-opacity cursor-pointer ${topicColors[topic]}`}
              title={`View "${topic}" in Research Topics`}
            >
              <Tag size={9} />
              {topic}
            </a>
          ))}
        </div>
      )}

      {/* Keyword pills */}
      {pub.keywords && pub.keywords.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {pub.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

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
            className="inline-flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary hover:bg-primary/15 transition-colors"
          >
            <FileText size={12} /> PDF
          </a>
        )}
      </div>
    </div>
  </div>
);

const PublicationMetrics = ({ totalPubs }: { totalPubs: number }) => {
  const { data: metricsContent } = useQuery({
    queryKey: ["site-content-pub-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "publication_metrics")
        .limit(1);
      if (error) throw error;
      return data?.[0]?.content as unknown as { hIndex: string; citations: string } | undefined;
    },
  });

  const hIndex = metricsContent?.hIndex || "23";
  const citations = metricsContent?.citations || "1,496";

  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-4">
      <div className="border-l-4 border-accent rounded-r-md bg-card px-5 py-4">
        <p className="text-2xl font-bold text-primary font-display">{totalPubs}</p>
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">Publications</p>
      </div>
      <div className="border-l-4 border-accent rounded-r-md bg-card px-5 py-4">
        <p className="text-2xl font-bold text-primary font-display">{hIndex}</p>
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">h-index</p>
      </div>
      <div className="border-l-4 border-accent rounded-r-md bg-card px-5 py-4">
        <p className="text-2xl font-bold text-primary font-display">{citations}</p>
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">Citations</p>
      </div>
      <a
        href="https://scholar.google.com/citations?user=siOMho4AAAAJ"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/80"
      >
        Google Scholar <ExternalLink size={14} />
      </a>
      <a
        href="https://www.researchgate.net/profile/Jeong-Hyun-Lee-6"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-md border border-accent/30 px-5 py-4 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
      >
        ResearchGate <ExternalLink size={14} />
      </a>
    </div>
  );
};
const PublicationsSection = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<ResearchTopic | null>(null);
  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const topic = (e as CustomEvent).detail as ResearchTopic;
      setTopicFilter(topic);
    };
    window.addEventListener("filter-publications-topic", handler);
    return () => window.removeEventListener("filter-publications-topic", handler);
  }, []);

  // Fetch from DB, merge with static data
  const { data: dbPubs } = useQuery({
    queryKey: ["publications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .order("year", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const publicPubs = useMemo(() => {
    // Convert DB pubs to Publication format
    const dbConverted: Publication[] = (dbPubs || [])
      .filter((p) => p.visibility === "public")
      .map((p) => ({
        authors: p.authors,
        year: p.year,
        title: p.title,
        journal: p.journal,
        doi: p.doi,
        type: p.type as "journal" | "book",
        highlight: p.highlight || undefined,
        pdfUrl: p.pdf_url || undefined,
        visibility: p.visibility as "public" | "private",
        keywords: p.keywords || [],
        researchTopics: (p.research_topics || []) as ResearchTopic[],
      }));

    // Merge: DB pubs take priority (match by title), then add static pubs not in DB
    const dbTitles = new Set(dbConverted.map((p) => p.title.toLowerCase()));
    const staticOnly = staticPublications
      .filter((p) => (p.visibility ?? "public") === "public")
      .filter((p) => !dbTitles.has(p.title.toLowerCase()));

    return [...dbConverted, ...staticOnly];
  }, [dbPubs]);

  const filtered = useMemo(() => {
    let result = activeTab === "all" ? publicPubs : publicPubs.filter((p) => p.type === activeTab);

    if (topicFilter) {
      result = result.filter((p) => p.researchTopics?.includes(topicFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.authors.toLowerCase().includes(q) ||
          p.journal.toLowerCase().includes(q) ||
          p.year.includes(q) ||
          (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(q))) ||
          (p.highlight && p.highlight.toLowerCase().includes(q)) ||
          (p.researchTopics && p.researchTopics.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [activeTab, searchQuery, topicFilter, publicPubs]);

  // Group by year
  const grouped = useMemo(() => {
    const map = new Map<string, Publication[]>();
    for (const pub of filtered) {
      const yr = pub.year || "Undated";
      if (!map.has(yr)) map.set(yr, []);
      map.get(yr)!.push(pub);
    }
    // Sort years descending
    return Array.from(map.entries()).sort((a, b) => {
      if (a[0] === "Undated") return 1;
      if (b[0] === "Undated") return -1;
      return parseInt(b[0]) - parseInt(a[0]);
    });
  }, [filtered]);

  const allTopics: ResearchTopic[] = [
    "Phanerozoic Reef Evolution",
    "Microbialites",
    "Sponge Paleontology",
    "Joseon Supergroup",
    "Other Studies",
  ];

  return (
    <section id="publications" className="py-20 bg-card/50">
      <div className="container max-w-5xl">
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Publications
        </h2>
        <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

        {/* Metrics */}
        <PublicationMetrics totalPubs={publicPubs.length} />

        {/* Research topic filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center mr-1">Filter by topic:</span>
          {allTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setTopicFilter(topicFilter === topic ? null : topic)}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                topicFilter === topic
                  ? topicColors[topic] + " ring-2 ring-offset-1 ring-accent/30"
                  : "border-border text-muted-foreground hover:border-accent/40"
              }`}
            >
              <Tag size={10} />
              {topic}
            </button>
          ))}
          {topicFilter && (
            <button
              onClick={() => setTopicFilter(null)}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search bar */}
        <div className="mt-6 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, author, journal, year, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border bg-card pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-6 flex items-end gap-6 border-b border-border">
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
          <span className="ml-auto pb-3 text-xs text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">* corresponding author · § supervised student · # supervised postdoc</p>

        {/* Expand/Collapse all button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setExpandAll((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors"
          >
            <ChevronsUpDown size={14} />
            {expandAll ? "모두 접기" : "모두 펼치기"}
          </button>
        </div>

        {/* Publication list grouped by year */}
        <div className="mt-6 space-y-8">
          {grouped.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No publications found matching "{searchQuery}"
            </div>
          ) : (
            grouped.map(([year, pubs], groupIndex) => {
              const currentYear = new Date().getFullYear();
              const yearNum = parseInt(year);
              const isRecent = isNaN(yearNum) || yearNum >= currentYear - 4;
              const isSearching = searchQuery.trim() !== "" || topicFilter !== null;

              if (isRecent || isSearching) {
                return (
                  <div key={year}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-px flex-1 bg-border" />
                      <h3 className="text-lg font-display font-bold text-primary">{year}</h3>
                      <span className="text-xs text-muted-foreground">({pubs.length})</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="space-y-3">
                      {pubs.map((pub, i) => (
                        <PublicationCard key={`${year}-${i}`} pub={pub} />
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Collapsible key={year} open={expandAll || undefined}>
                  <CollapsibleTrigger className="w-full group/collapsible">
                    <div className="flex items-center gap-4 mb-4 cursor-pointer">
                      <div className="h-px flex-1 bg-border" />
                      <h3 className="text-lg font-display font-bold text-primary">{year}</h3>
                      <span className="text-xs text-muted-foreground">({pubs.length})</span>
                      <ChevronDown size={16} className="text-muted-foreground transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-3">
                      {pubs.map((pub, i) => (
                        <PublicationCard key={`${year}-${i}`} pub={pub} />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          )}
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

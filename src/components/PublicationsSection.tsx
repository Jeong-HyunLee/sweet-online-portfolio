import { ExternalLink } from "lucide-react";

interface Publication {
  authors: string;
  year: string;
  title: string;
  journal: string;
  doi: string;
  highlight?: string;
}

const publications: Publication[] = [
  {
    authors: "Lee, H., Choi, T., Lee, J.-H.*",
    year: "2026",
    title: "Facies control on provenance shift during the early Cambrian transgression in Korea: Detrital zircon and geochemical evidence",
    journal: "Sedimentology, v. 73, 418–440",
    doi: "https://doi.org/10.1111/sed.70067",
  },
  {
    authors: "Lee, J.-H., Park, J.*, Seo, J., Choi, T., Park, S.-I., Lee, Y.-J., Lee, G.-J.",
    year: "2025",
    title: "The Great Unconformity in the eastern Sino-Korean Block: A synthesis",
    journal: "Earth-Science Reviews, v. 270, 105244",
    doi: "https://doi.org/10.1016/j.earscirev.2025.105244",
  },
  {
    authors: "Jeon, J., Li, Q.-J., Lee, J.-H.*",
    year: "2025",
    title: "Preservation bias obscures gradual Ordovician reef evolution",
    journal: "Proceedings of the National Academy of Sciences, v. 122",
    doi: "https://doi.org/10.1073/pnas.251140612",
    highlight: "PNAS",
  },
  {
    authors: "Jeon, J., Simonet Roda, M., Chen, Z.-Y., Luo, C., Kershaw, S., Kim, D., Ma, J.-Y., Lee, J.-H.*, Zhang, Y.-D.*",
    year: "2025",
    title: "Phosphatic stromatoporoid sponges formed reefs ~480 Mya",
    journal: "Proceedings of the National Academy of Sciences, v. 122",
    doi: "https://doi.org/10.1073/pnas.242610512",
    highlight: "PNAS · In This Issue",
  },
  {
    authors: "Simonet Roda, M., Kim, D., Brasier, A., Griesshaber, E., Lee, J.-H.*",
    year: "2024",
    title: "Exploring EBSD analysis as a tool for understanding stromatolite",
    journal: "Sedimentology, v. 71, 2448–2469",
    doi: "https://doi.org/10.1111/sed.13222",
  },
  {
    authors: "Lee, J.-H.*, Riding, R.",
    year: "2023",
    title: "Stromatolite-rimmed thrombolite columns and domes in late Cambrian biostromes, Texas, USA",
    journal: "Sedimentology, v. 70, 293–334",
    doi: "https://doi.org/10.1111/sed.13048",
    highlight: "Editors' Picks 2023",
  },
  {
    authors: "Lee, J.-H.*, Riding, R.",
    year: "2021",
    title: "The classic stromatolite Cryptozoön is a keratose sponge-microbial consortium",
    journal: "Geobiology, v. 19, 189–198",
    doi: "http://dx.doi.org/10.1111/GBI.12422",
    highlight: "Journal Cover · Most Cited 2020–22",
  },
  {
    authors: "Lee, J.-H.*, Riding, R.",
    year: "2018",
    title: "Marine oxygenation, lithistid sponges, and the early history of Paleozoic skeletal reefs",
    journal: "Earth-Science Reviews, v. 181, 98–121",
    doi: "https://doi.org/10.1016/j.earscirev.2018.04.003",
  },
  {
    authors: "Lee, J.-H.*, Chen, J., Chough, S.K.",
    year: "2015",
    title: "The middle–late Cambrian reef transition and related geological events: a review and new view",
    journal: "Earth-Science Reviews, v. 145, 66–84",
    doi: "https://doi.org/10.1016/j.earscirev.2015.03.002",
  },
  {
    authors: "Lee, J.-H.*",
    year: "2021",
    title: "Stromatolites (Encyclopedia of Geology, 2nd edition)",
    journal: "Elsevier, pp. 375–388",
    doi: "https://doi.org/10.1016/B978-0-12-409548-9.11974-8",
    highlight: "Book Chapter",
  },
];

const PublicationsSection = () => (
  <section id="publications" className="py-20 bg-card/50">
    <div className="container max-w-5xl">
      <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        Publications
      </h2>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      {/* Metrics */}
      <div className="mt-8 flex flex-wrap gap-6">
        <div className="rounded-md border bg-card px-6 py-4 text-center">
          <p className="text-2xl font-bold text-primary">63+</p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Journal Articles</p>
        </div>
        <div className="rounded-md border bg-card px-6 py-4 text-center">
          <p className="text-2xl font-bold text-primary">23</p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">h-index</p>
        </div>
        <div className="rounded-md border bg-card px-6 py-4 text-center">
          <p className="text-2xl font-bold text-primary">1,466</p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Citations</p>
        </div>
        <a
          href="https://scholar.google.com/citations?user=siOMho4AAAAJ"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border bg-accent px-6 py-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/80"
        >
          Google Scholar <ExternalLink size={14} />
        </a>
      </div>

      {/* Selected publications */}
      <h3 className="mt-12 font-display text-xl font-bold text-primary">Selected Publications</h3>
      <p className="mt-1 text-sm text-muted-foreground">* corresponding author · § supervised student · # supervised postdoc</p>

      <div className="mt-6 space-y-4">
        {publications.map((pub, i) => (
          <div key={i} className="rounded-md border bg-card p-5 transition-colors hover:border-accent/50">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <span className="text-xs font-semibold text-accent">{pub.year}</span>
              {pub.highlight && (
                <span className="rounded-sm bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                  {pub.highlight}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-semibold text-foreground leading-snug">{pub.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{pub.authors}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs italic text-muted-foreground">{pub.journal}</p>
              <a
                href={pub.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
              >
                DOI <ExternalLink size={10} />
              </a>
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

export default PublicationsSection;

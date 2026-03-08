import { useMemo } from "react";
import galleryOutcrop from "@/assets/gallery-outcrop.jpg";
import galleryThinsection from "@/assets/gallery-thinsection.jpg";
import galleryFossils from "@/assets/gallery-fossils.jpg";
import galleryLab from "@/assets/gallery-lab.jpg";
import { publications } from "@/data/publications";

interface ResearchTopic {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
}

const topics: ResearchTopic[] = [
  {
    id: "research-cambro-ordovician-reefs",
    title: "Cambro-Ordovician Reefs",
    subtitle: "The dawn of metazoan reef ecosystems",
    description:
      "Our lab investigates how the earliest animal-built reefs evolved during the Cambrian and Ordovician periods (~540–440 Ma). We study the transition from microbial-dominated reefs to frameworks constructed by sponges, bryozoans, and other metazoans — tracking how biological innovation and environmental change reshaped marine ecosystems.",
    image: galleryOutcrop,
    tags: ["Paleoecology", "Reef Evolution", "Early Paleozoic"],
  },
  {
    id: "research-stromatolites-microbialites",
    title: "Stromatolites & Microbialites",
    subtitle: "Earth's oldest living structures",
    description:
      "Stromatolites are laminated sedimentary structures formed by microbial communities and represent some of the earliest evidence of life on Earth. We combine field observation, petrography, EBSD crystallography, and geochemistry to understand how these structures form, what they tell us about ancient environments, and how to distinguish biogenic from abiotic origins.",
    image: galleryThinsection,
    tags: ["Microbial Carbonates", "EBSD", "Biosignatures"],
  },
  {
    id: "research-sponge-paleontology",
    title: "Sponge Paleontology",
    subtitle: "Ancient reef-builders and their ecological roles",
    description:
      "Sponges — particularly lithistids, stromatoporoids, and keratose sponges — were critical reef builders throughout the Paleozoic. Our work has revealed that some classic 'stromatolites' are actually sponge-microbial consortia, fundamentally reinterpreting the fossil record. We study their taxonomy, paleoecology, and role in reef construction across multiple continents.",
    image: galleryFossils,
    tags: ["Stromatoporoids", "Lithistid Sponges", "Keratose Sponges"],
  },
  {
    id: "research-korean-geology",
    title: "Korean Geology & the Great Unconformity",
    subtitle: "Decoding the Sino-Korean Block",
    description:
      "Korea preserves a remarkable record of Paleozoic sedimentation on the eastern Sino-Korean Block. We study the Great Unconformity, Cambrian transgression sequences, and provenance shifts using detrital zircon geochronology, sedimentary facies analysis, and chemostratigraphy to reconstruct the tectonic and environmental history of the Korean Peninsula.",
    image: galleryOutcrop,
    tags: ["Stratigraphy", "Provenance Analysis", "Detrital Zircon"],
  },
  {
    id: "research-other-studies",
    title: "Other Studies",
    subtitle: "Broader geological investigations",
    description:
      "Beyond our core research themes, our lab contributes to diverse geological studies including Cretaceous sedimentology, impact crater analysis, ichnology (trace fossils), Miocene basin analysis, vertebrate paleontology, and geoarchaeology. These collaborative projects reflect the breadth of our geological expertise and our commitment to advancing Earth science across disciplines.",
    image: galleryLab,
    tags: ["Sedimentology", "Impact Craters", "Ichnology", "Basin Analysis"],
  },
];

const handleTopicClick = (topicTitle: string) => {
  const pubSection = document.getElementById("publications");
  if (pubSection) {
    pubSection.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("filter-publications-topic", { detail: topicTitle }));
    }, 400);
  }
};

const ResearchSection = () => {
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const publicPubs = publications.filter((p) => (p.visibility ?? "public") === "public");
    for (const pub of publicPubs) {
      pub.researchTopics?.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    }
    return counts;
  }, []);

  return (
  <section id="research" className="py-20 bg-card/50">
    <div className="container max-w-5xl">
      <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        Research Topics
      </h2>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      <div className="mt-10 space-y-8">
        {topics.map((topic, i) => (
          <div
            key={topic.id}
            id={topic.id}
            className={`group rounded-md border bg-card overflow-hidden flex flex-col scroll-mt-24 ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Image */}
            <div className="md:w-2/5 shrink-0 overflow-hidden">
              <img
                src={topic.image}
                alt={topic.title}
                className="h-56 md:h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
                {topic.subtitle}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-primary md:text-2xl">
                {topic.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {topic.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {topic.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleTopicClick(topic.title)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline self-start"
              >
                View Publications →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ResearchSection;

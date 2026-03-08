import { useMemo } from "react";
import researchReef from "@/assets/research-reef-evolution.jpg";
import researchMicrobialites from "@/assets/research-microbialites.jpg";
import researchSponge from "@/assets/research-sponge.jpg";
import researchJoseon from "@/assets/research-joseon.jpg";
import researchOther from "@/assets/research-other.jpg";
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
    id: "research-phanerozoic-reef-evolution",
    title: "Phanerozoic Reef Evolution",
    subtitle: "The rise and fall of reef ecosystems through time",
    description:
      "Our lab investigates how reef ecosystems evolved throughout the Phanerozoic Eon (~540 Ma–present). We examine how biological innovation, mass extinctions, and oceanic environmental changes — including oxygenation events and seawater chemistry shifts — have repeatedly reshaped marine reef ecosystems. Our work spans from early Cambrian archaeocyath–microbial reefs through Ordovician sponge–microbial buildups to Mississippian frameworks, revealing patterns of reef decline, recovery, and ecological reorganization across deep time.",
    image: researchReef,
    tags: ["Reef Ecology", "Mass Extinctions", "Oxygenation Events", "Reef Recovery"],
  },
  {
    id: "research-microbialites",
    title: "Microbialites",
    subtitle: "Earth's oldest living structures",
    description:
      "Microbialites — including stromatolites, thrombolites, tufas, and other microbially-mediated carbonate structures — represent some of the earliest evidence of life on Earth. We combine field observation, petrography, EBSD crystallography, and geochemistry to understand how these structures form, what they reveal about ancient and modern environments, and how to distinguish biogenic from abiotic origins. Our research extends from Precambrian–Paleozoic marine microbialites to Cretaceous freshwater tufas, exploring the full spectrum of microbially influenced carbonate precipitation.",
    image: researchMicrobialites,
    tags: ["Stromatolites", "Thrombolites", "Tufas", "EBSD", "Biosignatures"],
  },
  {
    id: "research-sponge-paleontology",
    title: "Sponge Paleontology",
    subtitle: "Ancient reef-builders and their ecological roles",
    description:
      "Sponges — particularly lithistids, stromatoporoids, and keratose sponges — were critical reef builders throughout the Paleozoic. Our work has revealed that some classic 'stromatolites' are actually keratose sponge–microbial consortia, fundamentally reinterpreting the fossil record. We study their taxonomy, paleoecology, and role in reef construction from the Cambrian to the Carboniferous across multiple continents, including the recent discovery of the earliest phosphatic stromatoporoid reefs from the Early Ordovician.",
    image: researchSponge,
    tags: ["Stromatoporoids", "Lithistid Sponges", "Keratose Sponges", "Sponge–Microbe Consortia"],
  },
  {
    id: "research-joseon-supergroup",
    title: "Joseon Supergroup",
    subtitle: "Paleozoic sedimentary record of the Korean Peninsula",
    description:
      "The Joseon Supergroup preserves a remarkable record of Cambrian–Ordovician sedimentation on the eastern Sino-Korean Block. We study the Great Unconformity, Cambrian transgression sequences, provenance shifts, and bioerosion records using detrital zircon geochronology, sedimentary facies analysis, and chemostratigraphy. Our research also encompasses the broader Paleozoic stratigraphy of the Korean Peninsula, including the Devonian Imjin System and Ordovician reef and platform development in the Taebaek and Yeongwol groups.",
    image: researchJoseon,
    tags: ["Great Unconformity", "Detrital Zircon", "Taebaek Group", "Bioerosion"],
  },
  {
    id: "research-other-studies",
    title: "Other Studies",
    subtitle: "Broader geological investigations",
    description:
      "Beyond our core research themes, our lab contributes to diverse geological studies including Cretaceous alluvial and lacustrine sedimentology, impact crater analysis (Jeokjung–Chogye structure), ichnology (trace fossils), Miocene basin analysis and igneous geochemistry, vertebrate paleontology (Elasmobranchii, dinosaur tracks), and geoarchaeology. These collaborative projects reflect the breadth of our geological expertise and our commitment to advancing Earth science across disciplines.",
    image: researchOther,
    tags: ["Impact Craters", "Ichnology", "Miocene Basins", "Vertebrate Paleontology"],
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
              <div className="mt-2 flex items-center gap-2">
                <h3 className="font-display text-xl font-bold text-primary md:text-2xl">
                  {topic.title}
                </h3>
                {topicCounts[topic.title] && (
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                    {topicCounts[topic.title]} papers
                  </span>
                )}
              </div>
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
};

export default ResearchSection;

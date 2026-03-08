import { GraduationCap, Briefcase, Award, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { education as staticEdu, employment as staticEmp, awards as staticAwards, grants as staticGrants } from "@/data/about";
import professorField from "@/assets/professor-field.jpg";

const AboutSection = () => {
  const { data: dbContent } = useQuery({
    queryKey: ["site-content-about"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .in("section", ["education", "employment", "award", "grant"])
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const dbEdu = dbContent?.filter((c) => c.section === "education").map((c) => c.content as any) || [];
  const dbEmp = dbContent?.filter((c) => c.section === "employment").map((c) => c.content as any) || [];
  const dbAwards = dbContent?.filter((c) => c.section === "award").map((c) => c.content as any) || [];
  const dbGrants = dbContent?.filter((c) => c.section === "grant").map((c) => c.content as any) || [];

  const education = dbEdu.length > 0 ? dbEdu : staticEdu;
  const employment = dbEmp.length > 0 ? dbEmp : staticEmp;
  const awards = dbAwards.length > 0 ? dbAwards : staticAwards;
  const grants = dbGrants.length > 0 ? dbGrants : staticGrants;

  return (
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

        {/* Research description with photo */}
        <div className="mt-8 grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3 space-y-4 text-base leading-relaxed text-muted-foreground">
            <div className="float-left mr-6 mb-4">
              <img
                src={professorField}
                alt="Prof. Jeong-Hyun Lee"
                className="w-36 rounded-md border shadow-sm"
              />
            </div>
            <p>
              <strong className="text-foreground">My research interest mainly lies in paleoecology of the Cambrian and Ordovician</strong>, the beginning of the Phanerozoic. In order to understand this time interval, I focus on carbonate sedimentology and invertebrate fossils such as sponges and calcified microbes.
            </p>
            <p>
              Understanding how organisms evolved along with changes in environmental conditions is of my primary interest. I also use tools such as chemostratigraphy and provenance analysis of siliciclastic sediment.
            </p>
          </div>
          <div className="md:col-span-2 space-y-3">
            {[
              { label: "Focus", value: "Cambrian–Ordovician Paleoecology" },
              { label: "Methods", value: "Carbonate Sedimentology & Chemostratigraphy" },
              { label: "Organisms", value: "Sponges & Calcified Microbes" },
            ].map((item) => (
              <div key={item.label} className="border-l-4 border-accent rounded-r-md bg-card px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Employment */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="text-accent" size={24} />
              <h3 className="font-display text-2xl font-bold text-primary">Education</h3>
            </div>
            <div className="relative border-l-2 border-accent/30 pl-6 space-y-6">
              {education.map((e: any) => (
                <div key={e.degree} className="relative">
                  <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-accent" />
                  <p className="font-semibold text-foreground">{e.degree} — {e.school}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{e.topic}</p>
                  <span className="text-xs font-medium text-accent">{e.years}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="text-accent" size={24} />
              <h3 className="font-display text-2xl font-bold text-primary">Employment</h3>
            </div>
            <div className="relative border-l-2 border-accent/30 pl-6 space-y-6">
              {employment.map((e: any) => (
                <div key={e.role + e.years} className="relative">
                  <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-accent" />
                  <p className="font-semibold text-foreground">{e.role}</p>
                  <p className="text-sm text-muted-foreground">{e.place}</p>
                  <span className="text-xs font-medium text-accent">{e.years}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards & Grants */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-accent" size={24} />
              <h3 className="font-display text-2xl font-bold text-primary">Awards &amp; Honors</h3>
            </div>
            <div className="space-y-3">
              {awards.map((a: any) => (
                <div key={a.title} className="flex gap-4 items-start rounded-md border bg-card p-4">
                  <span className="shrink-0 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                    {a.year}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.org}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-accent" size={24} />
              <h3 className="font-display text-2xl font-bold text-primary">Selected Grants</h3>
            </div>
            <div className="space-y-3">
              {grants.map((g: any) => (
                <div key={g.title} className="rounded-md border bg-card p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-accent">{g.years}</span>
                    <span className="text-xs font-bold text-primary">{g.amount}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-foreground leading-snug">{g.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{g.funder}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

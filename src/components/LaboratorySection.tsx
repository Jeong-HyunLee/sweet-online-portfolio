import { useState } from "react";
import { Microscope, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import labHeader from "@/assets/lab-header.jpg";

interface LabEquipment {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
}

const LaboratorySection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: labContent } = useQuery({
    queryKey: ["site-content-laboratory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "laboratory")
        .order("sort_order")
        .limit(1);
      if (error) throw error;
      return data?.[0]?.content as unknown as { title: string; description: string } | undefined;
    },
  });

  const { data: equipment = [] } = useQuery({
    queryKey: ["lab-equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_equipment")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as LabEquipment[];
    },
  });

  const title = labContent?.title || "Thin Section Laboratory";
  const description = labContent?.description || "";

  return (
    <section id="laboratory" className="py-20 bg-card/50">
      <div className="container max-w-5xl">
        {/* Header with background */}
        <div className="relative rounded-md overflow-hidden mb-10">
          <img
            src={labHeader}
            alt="Thin section laboratory"
            className="w-full h-48 md:h-64 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl text-center">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Microscope className="text-accent" size={24} />
          <h3 className="font-display text-2xl font-bold text-primary">Facilities</h3>
        </div>

        {description && (
          <p className="text-base leading-relaxed text-muted-foreground max-w-3xl">
            {description}
          </p>
        )}

        {/* Equipment list with click-to-expand images */}
        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          {equipment.map((item) => (
            <div key={item.id} className="rounded-md border bg-card overflow-hidden">
              <button
                onClick={() => item.image_url && setExpandedId(expandedId === item.id ? null : item.id)}
                className={`w-full flex items-start gap-3 p-3 text-left transition-colors ${
                  item.image_url ? "cursor-pointer hover:bg-accent/5" : "cursor-default"
                }`}
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  )}
                </div>
                {item.image_url && (
                  <ChevronDown
                    size={14}
                    className={`shrink-0 text-muted-foreground transition-transform duration-200 mt-0.5 ${
                      expandedId === item.id ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {expandedId === item.id && item.image_url && (
                <div className="px-3 pb-3">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full max-h-64 object-contain rounded-md bg-muted"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LaboratorySection;

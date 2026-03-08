import { Microscope } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import labMk5005s from "@/assets/lab-mk5005s.jpg";
import labMk101 from "@/assets/lab-mk101.jpg";
import labBd7 from "@/assets/lab-bd7.jpg";
import labHp30 from "@/assets/lab-hp30.jpg";
import labLabopol from "@/assets/lab-labopol30.jpg";
import labHillquist from "@/assets/lab-hillquist.jpg";
import labVibrating from "@/assets/lab-vibrating-lap.jpg";
import labUltrasonic from "@/assets/lab-ultrasonic.jpg";
import labSecotom from "@/assets/lab-secotom.jpg";
import labAccutom from "@/assets/lab-accutom.jpg";
import labHotplate from "@/assets/lab-hotplate.jpg";
import labHeader from "@/assets/lab-header.jpg";

const staticEquipmentImages = [
  { src: labMk5005s, label: "MK-5005S" },
  { src: labMk101, label: "MK-101" },
  { src: labBd7, label: "BD7" },
  { src: labHp30, label: "HP30" },
  { src: labLabopol, label: "LaboPol-30" },
  { src: labHillquist, label: "Hillquist" },
  { src: labVibrating, label: "Vibrating Lap" },
  { src: labUltrasonic, label: "Ultrasonic Cleaner" },
  { src: labSecotom, label: "Secotom-50" },
  { src: labHotplate, label: "Hot Plates" },
  { src: labAccutom, label: "Accutom-100" },
];

const staticData = {
  title: "Thin Section Laboratory",
  description:
    "Our Thin Section Laboratory at CNU produces thin sections and polished samples of solid rock samples. The laboratory is capable of producing large polished slabs (~30 cm in diameter), large (7.6×5.2 cm) and small (5.2×2.6 cm) petrographic thin sections of finest quality. Both slabs and thin sections can be polished up to 1 micron.",
  equipment: [
    "Leica M205C stereo microscope equipped with DMC6200 camera",
    "Nikon polarizing microscopes equipped with camera",
    'HP30: 30" slab saw for large samples',
    'MK-5005S: 14" or 20" rock saw for hard rock samples',
    'MK-101: 10" rock saw for soft rock samples',
    'BD7: 7" trim saw for small samples',
    "LaboPol-30: four automatic polishers for 100, 200, 400 and 800 mesh (and up to 1 micron)",
    '24" vibrating lap: for polishing slabs up to 8000 mesh (~1.5 micron)',
    "20L ultrasonic cleaner",
    "Digital hot plates",
    "Vacuum oven",
    "Hillquist thin section machine: a manual thin section machine for large thin sections",
    "Secotom-50: high precision cutting machine",
    "Accutom-100: high precision cutting and grinding machine",
  ],
};

const LaboratorySection = () => {
  const { data: dbContent } = useQuery({
    queryKey: ["site-content-laboratory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "laboratory")
        .order("sort_order")
        .limit(1);
      if (error) throw error;
      return data?.[0]?.content as typeof staticData | undefined;
    },
  });

  const lab = dbContent || staticData;

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
              {lab.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Microscope className="text-accent" size={24} />
          <h3 className="font-display text-2xl font-bold text-primary">Facilities</h3>
        </div>

        <p className="text-base leading-relaxed text-muted-foreground max-w-3xl">
          {lab.description}
        </p>

        {/* Equipment list */}
        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          {lab.equipment.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-md border bg-card p-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <p className="text-sm text-foreground">{item}</p>
            </div>
          ))}
        </div>

        {/* Equipment photos */}
        <div className="mt-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {staticEquipmentImages.map((img, i) => (
            <div key={i} className="group relative overflow-hidden rounded-md">
              <img
                src={img.src}
                alt={img.label}
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-colors flex items-end">
                <p className="text-primary-foreground text-[10px] font-medium p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LaboratorySection;

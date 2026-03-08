import { Users, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { currentMembers as staticCurrent, alumni as staticAlumni, type Member } from "@/data/members";

const roleColor: Record<string, string> = {
  Postdoc: "bg-accent/15 text-accent",
  "MS Student": "bg-primary/10 text-primary",
  Undergraduate: "bg-secondary text-secondary-foreground",
};

const MembersSection = () => {
  const { data: dbMembers } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const hasDbData = dbMembers && dbMembers.length > 0;
  const currentMembers = hasDbData
    ? dbMembers.filter((m) => !m.is_alumni).map((m) => ({ id: m.id, name: m.name, role: m.role, topic: m.topic, period: m.period }))
    : staticCurrent.map((m, i) => ({ id: `static-${i}`, ...m }));
  const alumni = hasDbData
    ? dbMembers.filter((m) => m.is_alumni).map((m) => ({ id: m.id, name: m.name, role: m.role, topic: m.topic, period: m.period }))
    : staticAlumni.map((m, i) => ({ id: `alumni-${i}`, ...m }));

  return (
    <section id="members" className="py-20">
      <div className="container max-w-5xl">
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Lab Members
        </h2>
        <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

        {/* Current — featured layout */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-accent" size={22} />
            <h3 className="font-display text-xl font-bold text-primary">Current Members</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            {currentMembers.slice(0, 2).map((m) => (
              <div key={m.name} className="rounded-md border-l-4 border-accent bg-card p-6">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{m.name}</p>
                  <span className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${roleColor[m.role] || "bg-secondary text-secondary-foreground"}`}>
                    {m.role}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{m.topic}</p>
                <p className="mt-2 text-xs font-medium text-accent">{m.period}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {currentMembers.slice(2).map((m) => (
              <div key={m.name} className="rounded-md border bg-card p-4">
                <span className={`inline-block rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2 ${roleColor[m.role] || "bg-secondary text-secondary-foreground"}`}>
                  {m.role}
                </span>
                <p className="font-semibold text-foreground text-sm">{m.name}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{m.topic}</p>
                <p className="mt-1.5 text-[10px] font-medium text-accent">{m.period}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alumni */}
        <div className="mt-14">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="text-accent" size={22} />
            <h3 className="font-display text-xl font-bold text-primary">Alumni</h3>
          </div>
          <div className="space-y-3">
            {alumni.map((m) => (
              <div key={m.name} className="rounded-md border bg-card/60 p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="shrink-0 sm:w-48">
                  <p className="font-semibold text-foreground text-sm">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground/60">{m.period}</p>
                </div>
                <div className="hidden sm:block text-accent text-lg">→</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-accent">{m.role}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{m.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembersSection;

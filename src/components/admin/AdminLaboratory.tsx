import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LabData {
  title: string;
  description: string;
  equipment: string[];
}

const AdminLaboratory = () => {
  const [title, setTitle] = useState("Thin Section Laboratory");
  const [description, setDescription] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: labContent } = useQuery({
    queryKey: ["admin-laboratory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "laboratory")
        .order("sort_order")
        .limit(1);
      if (error) throw error;
      return data?.[0];
    },
  });

  useEffect(() => {
    if (labContent) {
      const c = labContent.content as unknown as LabData;
      setTitle(c.title || "");
      setDescription(c.description || "");
      setEquipment(c.equipment || []);
      setExistingId(labContent.id);
    }
  }, [labContent]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const content = { title, description, equipment } as unknown as Record<string, any>;
      if (existingId) {
        const { error } = await supabase.from("site_content").update({ content: content as any }).eq("id", existingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_content").insert([{ section: "laboratory", content: content as any, sort_order: 1 }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-laboratory"] });
      toast({ title: "Laboratory info saved!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const inputClass = "w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-primary">Manage Laboratory</h1>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      <div className="mt-8 rounded-md border bg-card p-6 space-y-4">
        <input
          placeholder="Laboratory Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
        <textarea
          placeholder="Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} resize-y`}
        />

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Equipment List:</p>
          <div className="space-y-2">
            {equipment.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const updated = [...equipment];
                    updated[i] = e.target.value;
                    setEquipment(updated);
                  }}
                  className={`flex-1 ${inputClass}`}
                />
                <button
                  onClick={() => setEquipment(equipment.filter((_, j) => j !== i))}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                ><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              placeholder="Add equipment..."
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newEquipment.trim()) {
                  setEquipment([...equipment, newEquipment.trim()]);
                  setNewEquipment("");
                }
              }}
              className={`flex-1 ${inputClass}`}
            />
            <button
              onClick={() => { if (newEquipment.trim()) { setEquipment([...equipment, newEquipment.trim()]); setNewEquipment(""); } }}
              className="rounded-md border px-3 py-2 text-muted-foreground hover:text-accent transition-colors"
            ><Plus size={16} /></button>
          </div>
        </div>

        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save size={16} />
          {saveMutation.isPending ? "Saving..." : "Save Laboratory Info"}
        </button>
      </div>
    </>
  );
};

export default AdminLaboratory;

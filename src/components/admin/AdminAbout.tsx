import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SectionType = "education" | "employment" | "award" | "grant";

const sectionLabels: Record<SectionType, string> = {
  education: "Education",
  employment: "Employment",
  award: "Awards & Honors",
  grant: "Selected Grants",
};

const sectionFields: Record<SectionType, string[]> = {
  education: ["degree", "school", "years", "topic"],
  employment: ["role", "place", "years"],
  award: ["year", "title", "org"],
  grant: ["years", "title", "amount", "funder"],
};

const AdminAbout = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("education");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSortOrder, setEditSortOrder] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items } = useQuery({
    queryKey: ["admin-about", activeSection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", activeSection)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ content, id, sort_order }: { content: Record<string, string>; id?: string; sort_order: number }) => {
      if (id) {
        const { error } = await supabase.from("site_content").update({ content, sort_order }).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_content").insert({ section: activeSection, content, sort_order });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-about", activeSection] });
      setFormData({});
      setEditingId(null);
      setEditSortOrder(0);
      toast({ title: "Saved!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-about", activeSection] });
      toast({ title: "Deleted" });
    },
  });

  const fields = sectionFields[activeSection];
  const inputClass = "w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-primary">Manage About / CV</h1>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      {/* Section tabs */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {(Object.keys(sectionLabels) as SectionType[]).map((key) => (
          <button
            key={key}
            onClick={() => { setActiveSection(key); setFormData({}); setEditingId(null); }}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeSection === key
                ? "bg-accent text-accent-foreground border-accent"
                : "border-border text-muted-foreground hover:border-accent/40"
            }`}
          >
            {sectionLabels[key]}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="mt-6 rounded-md border bg-card p-6">
        <h3 className="font-display text-lg font-bold text-primary">
          {editingId ? "Edit" : "Add"} {sectionLabels[activeSection]}
        </h3>
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field] || ""}
                onChange={(e) => setFormData((f) => ({ ...f, [field]: e.target.value }))}
                className={inputClass}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Sort order"
              value={editSortOrder}
              onChange={(e) => setEditSortOrder(parseInt(e.target.value) || 0)}
              className="w-24 rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={() => saveMutation.mutate({ content: formData, id: editingId || undefined, sort_order: editSortOrder })}
              disabled={!formData[fields[0]] || saveMutation.isPending}
              className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                onClick={() => { setFormData({}); setEditingId(null); setEditSortOrder(0); }}
                className="rounded-md border px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >Cancel</button>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <p className="mt-6 text-xs text-muted-foreground">{items?.length || 0} items</p>
      <div className="mt-2 space-y-2">
        {items?.map((item) => {
          const c = item.content as Record<string, string>;
          return (
            <div key={item.id} className="rounded-md border bg-card p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                {fields.map((field, i) => (
                  <p key={field} className={`text-sm ${i === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {i > 0 && <span className="text-[10px] uppercase text-accent mr-1">{field}:</span>}
                    {c[field] || ""}
                  </p>
                ))}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => { setFormData(c); setEditingId(item.id); setEditSortOrder(item.sort_order); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="text-muted-foreground hover:text-accent"
                ><Edit2 size={16} /></button>
                <button
                  onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(item.id); }}
                  className="text-muted-foreground hover:text-destructive"
                ><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AdminAbout;

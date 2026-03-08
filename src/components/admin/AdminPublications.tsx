import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── Metrics Editor (h-index, citations) ── */
const MetricsEditor = () => {
  const [hIndex, setHIndex] = useState("");
  const [citations, setCitations] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: metricsRow } = useQuery({
    queryKey: ["admin-pub-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "publication_metrics")
        .limit(1);
      if (error) throw error;
      return data?.[0];
    },
  });

  useEffect(() => {
    if (metricsRow) {
      const c = metricsRow.content as unknown as { hIndex: string; citations: string };
      setHIndex(c.hIndex || "");
      setCitations(c.citations || "");
      setExistingId(metricsRow.id);
    }
  }, [metricsRow]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const content = { hIndex, citations } as unknown as Record<string, any>;
      if (existingId) {
        const { error } = await supabase.from("site_content").update({ content: content as any }).eq("id", existingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_content").insert([{ section: "publication_metrics", content: content as any, sort_order: 0 }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pub-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["site-content-pub-metrics"] });
      toast({ title: "Metrics saved!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const inputClass = "w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="rounded-md border bg-card p-5 mb-6 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Publication Metrics (Google Scholar)</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">h-index</label>
          <input value={hIndex} onChange={(e) => setHIndex(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Citations</label>
          <input value={citations} onChange={(e) => setCitations(e.target.value)} className={inputClass} />
        </div>
      </div>
      <button
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending}
        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        <Save size={14} /> {saveMutation.isPending ? "Saving..." : "Save Metrics"}
      </button>
    </div>
  );
};

const RESEARCH_TOPICS = [
  "Phanerozoic Reef Evolution",
  "Microbialites",
  "Sponge Paleontology",
  "Joseon Supergroup",
  "Other Studies",
];

interface PubForm {
  id?: string;
  authors: string;
  year: string;
  title: string;
  journal: string;
  doi: string;
  type: string;
  highlight: string;
  pdf_url: string;
  visibility: string;
  keywords: string;
  research_topics: string[];
  sort_order: number;
}

const emptyForm: PubForm = {
  authors: "", year: "", title: "", journal: "", doi: "", type: "journal",
  highlight: "", pdf_url: "", visibility: "public", keywords: "",
  research_topics: [], sort_order: 0,
};

const AdminPublications = () => {
  const [form, setForm] = useState<PubForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pubs } = useQuery({
    queryKey: ["admin-publications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .order("year", { ascending: false })
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (f: PubForm) => {
      const payload = {
        authors: f.authors,
        year: f.year,
        title: f.title,
        journal: f.journal,
        doi: f.doi,
        type: f.type,
        highlight: f.highlight || null,
        pdf_url: f.pdf_url || null,
        visibility: f.visibility,
        keywords: f.keywords ? f.keywords.split(",").map((k) => k.trim()).filter(Boolean) : [],
        research_topics: f.research_topics,
        sort_order: f.sort_order,
      };
      if (f.id) {
        const { error } = await supabase.from("publications").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("publications").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
      setForm(emptyForm);
      setEditing(false);
      toast({ title: "Saved!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("publications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
      toast({ title: "Deleted" });
    },
  });

  const toggleTopic = (topic: string) => {
    setForm((f) => ({
      ...f,
      research_topics: f.research_topics.includes(topic)
        ? f.research_topics.filter((t) => t !== topic)
        : [...f.research_topics, topic],
    }));
  };

  const filtered = pubs?.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q) || p.year.includes(q);
  });

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-primary">Manage Publications</h1>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
      <p className="mt-2 text-xs text-muted-foreground">
        DB에 없는 기존 논문은 정적 데이터에서 표시됩니다. 새 논문을 추가하거나 기존 논문을 수정하세요.
      </p>

      <div className="mt-8 rounded-md border bg-card p-6">
        <h3 className="font-display text-lg font-bold text-primary">
          {editing ? "Edit Publication" : "Add Publication"}
        </h3>
        <div className="mt-4 space-y-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            placeholder="Authors (e.g. Lee, J.-H.*, Kim, S.)"
            value={form.authors}
            onChange={(e) => setForm((f) => ({ ...f, authors: e.target.value }))}
            className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              placeholder="Year"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              placeholder="Journal (e.g. PNAS, v. 122)"
              value={form.journal}
              onChange={(e) => setForm((f) => ({ ...f, journal: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent sm:col-span-2"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              placeholder="DOI link"
              value={form.doi}
              onChange={(e) => setForm((f) => ({ ...f, doi: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent sm:col-span-2"
            />
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="journal">Journal Article</option>
              <option value="book">Book Chapter</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              placeholder="Highlight (e.g. PNAS · Cover)"
              value={form.highlight}
              onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              placeholder="PDF URL"
              value={form.pdf_url}
              onChange={(e) => setForm((f) => ({ ...f, pdf_url: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <select
              value={form.visibility}
              onChange={(e) => setForm((f) => ({ ...f, visibility: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <input
            placeholder="Keywords (comma separated)"
            value={form.keywords}
            onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
            className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div>
            <p className="text-xs text-muted-foreground mb-2">Research Topics:</p>
            <div className="flex flex-wrap gap-2">
              {RESEARCH_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    form.research_topics.includes(topic)
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-border text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => saveMutation.mutate(form)}
              disabled={!form.title || !form.authors || saveMutation.isPending}
              className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {saveMutation.isPending ? "Saving..." : editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button
                onClick={() => { setForm(emptyForm); setEditing(false); }}
                className="rounded-md border px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >Cancel</button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search publications..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mt-6 w-full rounded-md border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
      />

      <p className="mt-2 text-xs text-muted-foreground">{filtered?.length || 0} publications in DB</p>

      <div className="mt-4 space-y-2">
        {filtered?.map((pub) => (
          <div key={pub.id} className="rounded-md border bg-card p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-accent">{pub.year}</span>
                {pub.highlight && (
                  <span className="text-[10px] font-bold uppercase text-accent bg-accent/10 px-1.5 py-0.5 rounded">{pub.highlight}</span>
                )}
                {pub.visibility === "private" && (
                  <span className="text-[10px] text-destructive font-medium">PRIVATE</span>
                )}
              </div>
              <p className="mt-1 font-semibold text-foreground text-sm leading-snug">{pub.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{pub.authors}</p>
              <p className="text-xs text-muted-foreground italic">{pub.journal}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => {
                  setForm({
                    id: pub.id,
                    authors: pub.authors,
                    year: pub.year,
                    title: pub.title,
                    journal: pub.journal,
                    doi: pub.doi,
                    type: pub.type,
                    highlight: pub.highlight || "",
                    pdf_url: pub.pdf_url || "",
                    visibility: pub.visibility,
                    keywords: (pub.keywords || []).join(", "),
                    research_topics: pub.research_topics || [],
                    sort_order: pub.sort_order,
                  });
                  setEditing(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-muted-foreground hover:text-accent"
              ><Edit2 size={16} /></button>
              <button
                onClick={() => { if (confirm("Delete this publication?")) deleteMutation.mutate(pub.id); }}
                className="text-muted-foreground hover:text-destructive"
              ><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminPublications;

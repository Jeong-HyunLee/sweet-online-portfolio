import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MemberForm {
  id?: string;
  name: string;
  role: string;
  topic: string;
  period: string;
  is_alumni: boolean;
  sort_order: number;
}

const emptyForm: MemberForm = {
  name: "", role: "", topic: "", period: "", is_alumni: false, sort_order: 0,
};

const AdminMembers = () => {
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ["admin-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("is_alumni")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (f: MemberForm) => {
      const payload = { name: f.name, role: f.role, topic: f.topic, period: f.period, is_alumni: f.is_alumni, sort_order: f.sort_order };
      if (f.id) {
        const { error } = await supabase.from("members").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("members").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
      setForm(emptyForm);
      setEditing(false);
      toast({ title: "Saved!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
      toast({ title: "Deleted" });
    },
  });

  const currentMembers = members?.filter((m) => !m.is_alumni) || [];
  const alumni = members?.filter((m) => m.is_alumni) || [];

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-primary">Manage Members</h1>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      <div className="mt-8 rounded-md border bg-card p-6">
        <h3 className="font-display text-lg font-bold text-primary">
          {editing ? "Edit Member" : "Add Member"}
        </h3>
        <div className="mt-4 space-y-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Role (e.g. Postdoc, MS Student)"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              placeholder="Period (e.g. 2021–present)"
              value={form.period}
              onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <input
            placeholder="Research topic"
            value={form.topic}
            onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
            className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.is_alumni}
                onChange={(e) => setForm((f) => ({ ...f, is_alumni: e.target.checked }))}
                className="rounded"
              />
              Alumni (졸업생)
            </label>
            <input
              type="number"
              placeholder="Sort order"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-24 rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => saveMutation.mutate(form)}
              disabled={!form.name || saveMutation.isPending}
              className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {saveMutation.isPending ? "Saving..." : editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button
                onClick={() => { setForm(emptyForm); setEditing(false); }}
                className="rounded-md border px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Current Members */}
      <h3 className="mt-10 font-display text-lg font-bold text-primary">Current Members ({currentMembers.length})</h3>
      <div className="mt-4 space-y-2">
        {currentMembers.map((m) => (
          <div key={m.id} className="rounded-md border bg-card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.role} · {m.period}</p>
              <p className="text-xs text-muted-foreground truncate">{m.topic}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setForm({ id: m.id, name: m.name, role: m.role, topic: m.topic, period: m.period, is_alumni: m.is_alumni, sort_order: m.sort_order }); setEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-muted-foreground hover:text-accent"
              ><Edit2 size={16} /></button>
              <button
                onClick={() => { if (confirm(`Delete ${m.name}?`)) deleteMutation.mutate(m.id); }}
                className="text-muted-foreground hover:text-destructive"
              ><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Alumni */}
      <h3 className="mt-10 font-display text-lg font-bold text-primary">Alumni ({alumni.length})</h3>
      <div className="mt-4 space-y-2">
        {alumni.map((m) => (
          <div key={m.id} className="rounded-md border bg-card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.role} · {m.period}</p>
              <p className="text-xs text-muted-foreground truncate">{m.topic}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setForm({ id: m.id, name: m.name, role: m.role, topic: m.topic, period: m.period, is_alumni: m.is_alumni, sort_order: m.sort_order }); setEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-muted-foreground hover:text-accent"
              ><Edit2 size={16} /></button>
              <button
                onClick={() => { if (confirm(`Delete ${m.name}?`)) deleteMutation.mutate(m.id); }}
                className="text-muted-foreground hover:text-destructive"
              ><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminMembers;

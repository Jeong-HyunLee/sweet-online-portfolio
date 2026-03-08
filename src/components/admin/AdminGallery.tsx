import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit2, Upload, X, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GalleryForm {
  id?: string;
  image_url: string;
  alt: string;
  caption: string;
  sort_order: number;
}

const emptyForm: GalleryForm = {
  image_url: "", alt: "", caption: "", sort_order: 0,
};

const AdminGallery = () => {
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (f: GalleryForm) => {
      const payload = { image_url: f.image_url, alt: f.alt, caption: f.caption, sort_order: f.sort_order };
      if (f.id) {
        const { error } = await supabase.from("gallery").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      setForm(emptyForm);
      setEditing(false);
      toast({ title: "Saved!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({ title: "Deleted" });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `gallery/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("gallery-images").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("gallery-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    setUploading(false);
  };

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-primary">Manage Gallery</h1>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      <div className="mt-8 rounded-md border bg-card p-6">
        <h3 className="font-display text-lg font-bold text-primary">
          {editing ? "Edit Image" : "Add Image"}
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex gap-4 items-end">
            <label className="flex items-center gap-2 cursor-pointer rounded-md border bg-background px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
            <span className="text-xs text-muted-foreground">or</span>
            <input
              placeholder="Image URL"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              className="flex-1 rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {form.image_url && (
            <div className="relative inline-block">
              <img src={form.image_url} alt="Preview" className="h-24 rounded-md object-cover" />
              <button
                onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground"
              ><X size={12} /></button>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Alt text"
              value={form.alt}
              onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              placeholder="Caption"
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <input
            type="number"
            placeholder="Sort order"
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            className="w-24 rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="flex gap-3">
            <button
              onClick={() => saveMutation.mutate(form)}
              disabled={!form.image_url || saveMutation.isPending}
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

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item) => (
          <div key={item.id} className="rounded-md border bg-card overflow-hidden">
            <img src={item.image_url} alt={item.alt} className="aspect-video w-full object-cover" />
            <div className="p-3 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{item.caption || item.alt}</p>
                <p className="text-[10px] text-muted-foreground">Order: {item.sort_order}</p>
              </div>
              <button
                onClick={() => { setForm({ id: item.id, image_url: item.image_url, alt: item.alt, caption: item.caption, sort_order: item.sort_order }); setEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-muted-foreground hover:text-accent"
              ><Edit2 size={14} /></button>
              <button
                onClick={() => { if (confirm("Delete this image?")) deleteMutation.mutate(item.id); }}
                className="text-muted-foreground hover:text-destructive"
              ><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items?.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground py-8">
            No gallery images yet. Add one above!
          </p>
        )}
      </div>
    </>
  );
};

export default AdminGallery;

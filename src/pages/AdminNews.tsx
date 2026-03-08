import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, LogOut, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { value: "paper", label: "📄 Publication" },
  { value: "grant", label: "💰 Grant" },
  { value: "fieldwork", label: "🏔️ Fieldwork" },
  { value: "meeting", label: "🎤 Conference" },
  { value: "award", label: "🏆 Award" },
  { value: "general", label: "📢 General" },
];

interface NewsForm {
  id?: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  published_at: string;
}

const emptyForm: NewsForm = {
  title: "",
  content: "",
  category: "general",
  image_url: "",
  published_at: new Date().toISOString().slice(0, 16),
};

const AdminNews = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: news } = useQuery({
    queryKey: ["admin-lab-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_news")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: NewsForm) => {
      if (formData.id) {
        const { error } = await supabase
          .from("lab_news")
          .update({
            title: formData.title,
            content: formData.content,
            category: formData.category,
            image_url: formData.image_url || null,
            published_at: formData.published_at,
          })
          .eq("id", formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lab_news").insert({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          image_url: formData.image_url || null,
          published_at: formData.published_at,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lab-news"] });
      queryClient.invalidateQueries({ queryKey: ["lab-news"] });
      setForm(emptyForm);
      setEditing(false);
      toast({ title: "News saved!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lab_news").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lab-news"] });
      queryClient.invalidateQueries({ queryKey: ["lab-news"] });
      toast({ title: "Deleted" });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("news-images").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    setUploading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Login failed", description: error.message, variant: "destructive" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Login screen
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-md border bg-card p-8">
          <h2 className="font-display text-2xl font-bold text-primary text-center">Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to site
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b bg-card">
        <div className="container flex h-14 items-center justify-between">
          <a href="/" className="font-display text-lg font-bold text-primary">JH Lee Lab</a>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{session.user.email}</span>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl py-10">
        <h1 className="font-display text-3xl font-bold text-primary">Manage Lab News</h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

        {/* Form */}
        <div className="mt-8 rounded-md border bg-card p-6">
          <h3 className="font-display text-lg font-bold text-primary">
            {editing ? "Edit Post" : "New Post"}
          </h3>
          <div className="mt-4 space-y-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <textarea
              placeholder="Content"
              rows={4}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <label className="flex items-center gap-2 cursor-pointer rounded-md border bg-background px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Upload size={16} />
                {uploading ? "Uploading..." : "Image (optional)"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            {form.image_url && (
              <div className="relative inline-block">
                <img src={form.image_url} alt="Preview" className="h-20 rounded-md object-cover" />
                <button
                  onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                  className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => saveMutation.mutate(form)}
                disabled={!form.title || !form.content || saveMutation.isPending}
                className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50"
              >
                {saveMutation.isPending ? "Saving..." : editing ? "Update" : "Post"}
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

        {/* Existing posts */}
        <div className="mt-10 space-y-3">
          {news?.map((item) => (
            <div key={item.id} className="rounded-md border bg-card p-5 flex items-start gap-4">
              {item.image_url && (
                <img src={item.image_url} alt="" className="h-16 w-24 rounded object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(item.published_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 font-semibold text-foreground text-sm">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.content}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setForm({
                      id: item.id,
                      title: item.title,
                      content: item.content,
                      category: item.category,
                      image_url: item.image_url || "",
                      published_at: item.published_at.slice(0, 16),
                    });
                    setEditing(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-muted-foreground hover:text-accent"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this news post?")) deleteMutation.mutate(item.id);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {news?.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No news posts yet. Create your first one above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNews;

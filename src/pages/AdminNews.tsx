import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit2, LogOut, Upload, X, FileText, Newspaper, ShieldAlert, KeyRound, Users, Image, BookOpen, User, Microscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminMembers from "@/components/admin/AdminMembers";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminPublications from "@/components/admin/AdminPublications";
import AdminAbout from "@/components/admin/AdminAbout";
import AdminLaboratory from "@/components/admin/AdminLaboratory";

// ── News Management ──
const newsCategories = [
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
  doi: string;
}

const emptyNewsForm: NewsForm = {
  title: "", content: "", category: "general", image_url: "",
  published_at: new Date().toISOString().slice(0, 16), doi: "",
};

type TabKey = "news" | "publications" | "members" | "gallery" | "about" | "laboratory" | "pdfs" | "settings";

const AdminPage = () => {
  const { session, isAdmin, loading, signOut } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<NewsForm>(emptyNewsForm);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("news");
  const [pdfUploading, setPdfUploading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: news } = useQuery({
    queryKey: ["admin-lab-news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lab_news").select("*").order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session && isAdmin === true,
  });

  const { data: pdfs, refetch: refetchPdfs } = useQuery({
    queryKey: ["admin-pdfs"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("publication-pdfs").list("", { sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      return (data || []).map((f) => ({
        name: f.name,
        url: supabase.storage.from("publication-pdfs").getPublicUrl(f.name).data.publicUrl,
        created_at: f.created_at,
      }));
    },
    enabled: !!session && isAdmin === true,
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: NewsForm) => {
      const payload = { title: formData.title, content: formData.content, category: formData.category, image_url: formData.image_url || null, published_at: formData.published_at, doi: formData.doi || null };
      if (formData.id) {
        const { error } = await supabase.from("lab_news").update(payload).eq("id", formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lab_news").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lab-news"] });
      queryClient.invalidateQueries({ queryKey: ["lab-news"] });
      setForm(emptyNewsForm); setEditing(false);
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
    const path = `${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("news-images").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    setUploading(false);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith(".pdf")) { toast({ title: "Only PDF files", variant: "destructive" }); return; }
    setPdfUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const { error } = await supabase.storage.from("publication-pdfs").upload(safeName, file, { upsert: true });
    if (error) toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    else { toast({ title: "PDF uploaded!", description: safeName }); refetchPdfs(); }
    setPdfUploading(false);
  };

  const handleDeletePdf = async (name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    const { error } = await supabase.storage.from("publication-pdfs").remove([name]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "PDF deleted" }); refetchPdfs(); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Login failed", description: error.message, variant: "destructive" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-md border bg-card p-8">
          <h2 className="font-display text-2xl font-bold text-primary text-center">Admin Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required />
          <button type="submit" className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors">Sign In</button>
          <button type="button" onClick={() => navigate("/")} className="w-full text-xs text-muted-foreground hover:text-foreground">← Back to site</button>
        </form>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-4 rounded-md border bg-card p-8 text-center">
          <ShieldAlert size={48} className="mx-auto text-destructive" />
          <h2 className="font-display text-xl font-bold text-primary">접근 권한 없음</h2>
          <p className="text-sm text-muted-foreground">관리자 권한이 없습니다.<br /><span className="text-xs">{session.user.email}</span></p>
          <div className="flex gap-2">
            <button onClick={signOut} className="flex-1 rounded-md border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">로그아웃</button>
            <button onClick={() => navigate("/")} className="flex-1 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors">홈으로</button>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "news", label: "News", icon: <Newspaper size={16} /> },
    { key: "publications", label: "Publications", icon: <BookOpen size={16} /> },
    { key: "members", label: "Members", icon: <Users size={16} /> },
    { key: "gallery", label: "Gallery", icon: <Image size={16} /> },
    { key: "about", label: "About/CV", icon: <User size={16} /> },
    { key: "laboratory", label: "Laboratory", icon: <Microscope size={16} /> },
    { key: "pdfs", label: "PDFs", icon: <FileText size={16} /> },
    { key: "settings", label: "Settings", icon: <KeyRound size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container flex h-14 items-center justify-between">
          <a href="/" className="font-display text-lg font-bold text-primary">JH Lee Lab</a>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{session.user.email}</span>
            <button onClick={signOut} className="text-muted-foreground hover:text-foreground"><LogOut size={18} /></button>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl py-10">
        <div className="flex gap-2 flex-wrap border-b border-border mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 flex items-center gap-1.5 text-xs sm:text-sm font-semibold uppercase tracking-widest border-b-2 -mb-px transition-colors ${
                activeTab === tab.key ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "news" && (
          <>
            <h1 className="font-display text-3xl font-bold text-primary">Manage Lab News</h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
            <div className="mt-8 rounded-md border bg-card p-6">
              <h3 className="font-display text-lg font-bold text-primary">{editing ? "Edit Post" : "New Post"}</h3>
              <div className="mt-4 space-y-4">
                <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                <textarea placeholder="Content" rows={4} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
                <input placeholder="DOI link (optional)" value={form.doi} onChange={(e) => setForm((f) => ({ ...f, doi: e.target.value }))}
                  className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                    {newsCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <input type="datetime-local" value={form.published_at} onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                    className="rounded-md border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                  <label className="flex items-center gap-2 cursor-pointer rounded-md border bg-background px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Upload size={16} />{uploading ? "Uploading..." : "Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
                {form.image_url && (
                  <div className="relative inline-block">
                    <img src={form.image_url} alt="Preview" className="h-20 rounded-md object-cover" />
                    <button onClick={() => setForm((f) => ({ ...f, image_url: "" }))} className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground"><X size={12} /></button>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => saveMutation.mutate(form)} disabled={!form.title || !form.content || saveMutation.isPending}
                    className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50">
                    {saveMutation.isPending ? "Saving..." : editing ? "Update" : "Post"}
                  </button>
                  {editing && <button onClick={() => { setForm(emptyNewsForm); setEditing(false); }} className="rounded-md border px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>}
                </div>
              </div>
            </div>
            <div className="mt-10 space-y-3">
              {news?.map((item) => (
                <div key={item.id} className="rounded-md border bg-card p-5 flex items-start gap-4">
                  {item.image_url && <img src={item.image_url} alt="" className="h-16 w-24 rounded object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">{item.category}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(item.published_at).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-1 font-semibold text-foreground text-sm">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                    {(item as any).doi && <p className="mt-0.5 text-[10px] text-accent truncate">{(item as any).doi}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setForm({ id: item.id, title: item.title, content: item.content, category: item.category, image_url: item.image_url || "", published_at: item.published_at.slice(0, 16), doi: (item as any).doi || "" }); setEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="text-muted-foreground hover:text-accent"><Edit2 size={16} /></button>
                    <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(item.id); }}
                      className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {news?.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No news yet.</p>}
            </div>
          </>
        )}

        {activeTab === "publications" && <AdminPublications />}
        {activeTab === "members" && <AdminMembers />}
        {activeTab === "gallery" && <AdminGallery />}
        {activeTab === "about" && <AdminAbout />}
        {activeTab === "laboratory" && <AdminLaboratory />}

        {activeTab === "pdfs" && (
          <>
            <h1 className="font-display text-3xl font-bold text-primary">Publication PDFs</h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
            <div className="mt-6">
              <label className="inline-flex items-center gap-2 cursor-pointer rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors">
                <Upload size={16} />{pdfUploading ? "Uploading..." : "Upload PDF"}
                <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} disabled={pdfUploading} />
              </label>
            </div>
            <div className="mt-8 space-y-3">
              {pdfs?.map((pdf) => (
                <div key={pdf.name} className="rounded-md border bg-card p-4 flex items-center gap-4">
                  <FileText size={20} className="text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{pdf.name}</p>
                    <button onClick={() => { navigator.clipboard.writeText(pdf.url); toast({ title: "URL copied!" }); }} className="text-[11px] text-accent hover:underline mt-0.5">Copy URL</button>
                  </div>
                  <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary shrink-0"><FileText size={16} /></a>
                  <button onClick={() => handleDeletePdf(pdf.name)} className="text-muted-foreground hover:text-destructive shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
              {pdfs?.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No PDFs yet.</p>}
            </div>
          </>
        )}

        {activeTab === "settings" && (
          <>
            <h1 className="font-display text-3xl font-bold text-primary">Settings</h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
            <div className="mt-8 rounded-md border bg-card p-6 max-w-md">
              <h3 className="font-display text-lg font-bold text-primary">비밀번호 변경</h3>
              <div className="mt-4 space-y-4">
                <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                <input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                <button
                  onClick={async () => {
                    if (newPassword.length < 6) { toast({ title: "비밀번호는 6자 이상", variant: "destructive" }); return; }
                    if (newPassword !== confirmPassword) { toast({ title: "비밀번호 불일치", variant: "destructive" }); return; }
                    const { error } = await supabase.auth.updateUser({ password: newPassword });
                    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
                    else { toast({ title: "비밀번호 변경 완료!" }); setNewPassword(""); setConfirmPassword(""); }
                  }}
                  disabled={!newPassword || !confirmPassword}
                  className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50"
                >변경하기</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

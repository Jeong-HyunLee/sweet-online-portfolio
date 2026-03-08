import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, Upload, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LabEquipment {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
}

const AdminLaboratory = () => {
  const [title, setTitle] = useState("Thin Section Laboratory");
  const [description, setDescription] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Lab info from site_content
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

  // Equipment from lab_equipment table
  const { data: equipment = [] } = useQuery({
    queryKey: ["admin-lab-equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_equipment")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as LabEquipment[];
    },
  });

  useEffect(() => {
    if (labContent) {
      const c = labContent.content as unknown as { title: string; description: string };
      setTitle(c.title || "");
      setDescription(c.description || "");
      setExistingId(labContent.id);
    }
  }, [labContent]);

  const saveInfoMutation = useMutation({
    mutationFn: async () => {
      const content = { title, description } as unknown as Record<string, any>;
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
      queryClient.invalidateQueries({ queryKey: ["site-content-laboratory"] });
      toast({ title: "Laboratory info saved!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const addEquipmentMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      const maxSort = equipment.length > 0 ? Math.max(...equipment.map((e) => e.sort_order)) + 1 : 0;
      const { error } = await supabase.from("lab_equipment").insert([{ name, description, sort_order: maxSort }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lab-equipment"] });
      queryClient.invalidateQueries({ queryKey: ["lab-equipment"] });
      toast({ title: "Equipment added!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateEquipmentMutation = useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description: string }) => {
      const { error } = await supabase.from("lab_equipment").update({ name, description }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lab-equipment"] });
      queryClient.invalidateQueries({ queryKey: ["lab-equipment"] });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteEquipmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lab_equipment").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lab-equipment"] });
      queryClient.invalidateQueries({ queryKey: ["lab-equipment"] });
      toast({ title: "Equipment deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const ext = file.name.split(".").pop();
      const path = `${id}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("lab-equipment-images").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("lab-equipment-images").getPublicUrl(path);
      const imageUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      const { error } = await supabase.from("lab_equipment").update({ image_url: imageUrl }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lab-equipment"] });
      queryClient.invalidateQueries({ queryKey: ["lab-equipment"] });
      toast({ title: "Image uploaded!" });
    },
    onError: (err: any) => toast({ title: "Upload error", description: err.message, variant: "destructive" }),
  });

  const removeImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lab_equipment").update({ image_url: null }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lab-equipment"] });
      queryClient.invalidateQueries({ queryKey: ["lab-equipment"] });
      toast({ title: "Image removed" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const inputClass = "w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-primary">Manage Laboratory</h1>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      {/* Lab Info */}
      <div className="mt-8 rounded-md border bg-card p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">General Info</p>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        <textarea placeholder="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-y`} />
        <button
          onClick={() => saveInfoMutation.mutate()}
          disabled={saveInfoMutation.isPending}
          className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/80 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save size={16} />
          {saveInfoMutation.isPending ? "Saving..." : "Save Info"}
        </button>
      </div>

      {/* Equipment List */}
      <div className="mt-8 rounded-md border bg-card p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equipment ({equipment.length})</p>

        <div className="space-y-3">
          {equipment.map((item) => (
            <EquipmentRow
              key={item.id}
              item={item}
              inputClass={inputClass}
              onUpdate={(name, desc) => updateEquipmentMutation.mutate({ id: item.id, name, description: desc })}
              onDelete={() => deleteEquipmentMutation.mutate(item.id)}
              onUploadImage={(file) => uploadImageMutation.mutate({ id: item.id, file })}
              onRemoveImage={() => removeImageMutation.mutate(item.id)}
            />
          ))}
        </div>

        {/* Add new */}
        <div className="border-t pt-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Add Equipment:</p>
          <input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} />
          <input placeholder="Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className={inputClass} />
          <button
            onClick={() => {
              if (newName.trim()) {
                addEquipmentMutation.mutate({ name: newName.trim(), description: newDesc.trim() });
                setNewName("");
                setNewDesc("");
              }
            }}
            disabled={addEquipmentMutation.isPending}
            className="rounded-md border px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-colors flex items-center gap-2"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    </>
  );
};

function EquipmentRow({
  item,
  inputClass,
  onUpdate,
  onDelete,
  onUploadImage,
  onRemoveImage,
}: {
  item: LabEquipment;
  inputClass: string;
  onUpdate: (name: string, desc: string) => void;
  onDelete: () => void;
  onUploadImage: (file: File) => void;
  onRemoveImage: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [desc, setDesc] = useState(item.description);
  const fileRef = useRef<HTMLInputElement>(null);
  const changed = name !== item.name || desc !== item.description;

  return (
    <div className="rounded-md border p-3 space-y-2">
      <div className="flex items-center gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} className={`flex-1 ${inputClass}`} />
        <button onClick={onDelete} className="text-muted-foreground hover:text-destructive shrink-0"><Trash2 size={14} /></button>
      </div>
      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className={`${inputClass} text-xs`} />

      {/* Image management */}
      <div className="flex items-center gap-2 flex-wrap">
        {item.image_url ? (
          <>
            <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded object-cover border" />
            <button onClick={onRemoveImage} className="text-xs text-muted-foreground hover:text-destructive">Remove image</button>
          </>
        ) : (
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Image size={12} /> No image</span>
        )}
        <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUploadImage(f);
        }} />
        <button onClick={() => fileRef.current?.click()} className="text-xs text-accent hover:underline flex items-center gap-1">
          <Upload size={12} /> {item.image_url ? "Replace" : "Upload"}
        </button>
      </div>

      {changed && (
        <button onClick={() => onUpdate(name, desc)} className="text-xs text-accent hover:underline flex items-center gap-1">
          <Save size={12} /> Save changes
        </button>
      )}
    </div>
  );
}

export default AdminLaboratory;

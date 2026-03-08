import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Calendar, Tag } from "lucide-react";

const categoryIcon: Record<string, string> = {
  paper: "📄",
  grant: "💰",
  fieldwork: "🏔️",
  meeting: "🎤",
  award: "🏆",
  general: "📢",
};

const categoryLabel: Record<string, string> = {
  paper: "Publication",
  grant: "Grant",
  fieldwork: "Fieldwork",
  meeting: "Conference",
  award: "Award",
  general: "News",
};

const NewsSection = () => {
  const { data: news, isLoading } = useQuery({
    queryKey: ["lab-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_news")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section id="news" className="py-20 bg-card/50">
        <div className="container max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">Lab News</h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-md border bg-card p-5 animate-pulse">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="mt-3 h-5 w-full bg-muted rounded" />
                <div className="mt-2 h-4 w-3/4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!news || news.length === 0) {
    return null; // Don't show section if no news
  }

  return (
    <section id="news" className="py-20 bg-card/50">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3">
          <Newspaper className="text-accent" size={28} />
          <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">Lab News</h2>
        </div>
        <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <article
              key={item.id}
              className="group rounded-md border bg-card overflow-hidden transition-colors hover:border-accent/50"
            >
              {item.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{categoryIcon[item.category] || "📢"}</span>
                  <span className="font-semibold uppercase tracking-wider text-accent">
                    {categoryLabel[item.category] || "News"}
                  </span>
                  <span className="ml-auto flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(item.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-foreground text-sm leading-snug">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-3">
                  {item.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

import { Newspaper, Calendar } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  published_at: string;
  image_url?: string;
}

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

// Static news data — edit this array to add/remove news items for NAS deployment
// For Lovable Cloud deployment, this is overridden by Supabase data
const staticNews: NewsItem[] = [
  {
    id: "1",
    title: "New PNAS paper on Ordovician reef evolution",
    content: "Our paper 'Preservation bias obscures gradual Ordovician reef evolution' has been published in PNAS.",
    category: "paper",
    published_at: "2025-07-01",
  },
  {
    id: "2",
    title: "PNAS paper on phosphatic stromatoporoid sponges",
    content: "Our paper 'Phosphatic stromatoporoid sponges formed reefs ~480 Mya' has been published in PNAS and featured in 'In This Issue'.",
    category: "paper",
    published_at: "2025-04-01",
  },
  {
    id: "3",
    title: "Great Unconformity synthesis published in Earth-Science Reviews",
    content: "A comprehensive synthesis of the Great Unconformity in the eastern Sino-Korean Block is now published.",
    category: "paper",
    published_at: "2025-01-15",
  },
];

const NewsSection = () => {
  const news = staticNews;

  if (!news || news.length === 0) return null;

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

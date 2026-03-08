import { Newspaper, Calendar, ExternalLink } from "lucide-react";
import { newsItems, type NewsItem } from "@/data/news";

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

const NewsCard = ({ item }: { item: NewsItem }) => {
  const isLink = item.category === "paper" && item.doi;

  const cardContent = (
    <>
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
        {isLink && (
          <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
            View Paper <ExternalLink size={10} />
          </span>
        )}
      </div>
    </>
  );

  if (isLink) {
    return (
      <a
        href={item.doi}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-md border bg-card overflow-hidden transition-colors hover:border-accent/50 cursor-pointer"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <article className="group rounded-md border bg-card overflow-hidden transition-colors hover:border-accent/50">
      {cardContent}
    </article>
  );
};

const NewsSection = () => {
  const news = newsItems;

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
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  LAB NEWS — Edit this file to add/remove/update news items         ║
// ║                                                                    ║
// ║  HOW TO ADD A NEW ITEM:                                            ║
// ║  1. Copy a block below and paste at the TOP of the array           ║
// ║  2. Update all fields                                              ║
// ║  3. For publications, set category: "paper" and add doi            ║
// ║                                                                    ║
// ║  CATEGORIES: "paper" | "grant" | "fieldwork" | "meeting"           ║
// ║              | "award" | "general"                                  ║
// ╚══════════════════════════════════════════════════════════════════════╝

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  /** Category determines the icon and label shown on the card */
  category: "paper" | "grant" | "fieldwork" | "meeting" | "award" | "general";
  /** Date in YYYY-MM-DD format */
  published_at: string;
  /** Optional image URL for the card header */
  image_url?: string;
  /** For publication news: DOI link (clicking the card will open this) */
  doi?: string;
}

export const newsItems: NewsItem[] = [
  // ─── Most recent first ───────────────────────────────────────────
  {
    id: "1",
    title: "New PNAS paper on Ordovician reef evolution",
    content:
      "Our paper 'Preservation bias obscures gradual Ordovician reef evolution' has been published in PNAS.",
    category: "paper",
    published_at: "2025-07-01",
    doi: "https://doi.org/10.1073/pnas.251140612",
  },
  {
    id: "2",
    title: "PNAS paper on phosphatic stromatoporoid sponges",
    content:
      "Our paper 'Phosphatic stromatoporoid sponges formed reefs ~480 Mya' has been published in PNAS and featured in 'In This Issue'.",
    category: "paper",
    published_at: "2025-04-01",
    doi: "https://doi.org/10.1073/pnas.242610512",
  },
  {
    id: "3",
    title: "Great Unconformity synthesis published in Earth-Science Reviews",
    content:
      "A comprehensive synthesis of the Great Unconformity in the eastern Sino-Korean Block is now published.",
    category: "paper",
    published_at: "2025-01-15",
    doi: "https://doi.org/10.1016/j.earscirev.2025.105244",
  },
  // ─── Add new items above this line ───────────────────────────────
];

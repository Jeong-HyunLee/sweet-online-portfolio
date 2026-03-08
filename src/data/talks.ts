// ╔══════════════════════════════════════════════════════════════════════╗
// ║  INVITED TALKS — Edit this file to add/remove/update talks         ║
// ║                                                                    ║
// ║  HOW TO ADD A NEW TALK:                                            ║
// ║  1. Copy a block below and paste at the TOP of the array           ║
// ║  2. Update all fields                                              ║
// ║  3. For keynotes/special talks, add type field                     ║
// ║     Types: "Keynote", "Award Lecture", "Special Talk", etc.        ║
// ╚══════════════════════════════════════════════════════════════════════╝

export interface Talk {
  /** e.g. "October 2025" */
  date: string;
  venue: string;
  location: string;
  title: string;
  /** Optional: "Keynote", "Award Lecture", "Special Talk", etc. */
  type?: string;
}

export const talks: Talk[] = [
  // ─── Most recent first ───────────────────────────────────────────
  {
    date: "October 2025",
    venue: "International Conference on the Co-evolution of Life and Environments on the North China Platform",
    location: "Qingdao, China",
    title: "Crystallographic evidence for cyanobacterial filaments in Upper Ordovician Renalcis from North China",
    type: "Keynote",
  },
  {
    date: "October 2024",
    venue: "4th Annual Meeting of IGCP735",
    location: "Córdoba, Argentina",
    title: "Microbial- to metazoan-dominated reef transition in the early Paleozoic",
    type: "Keynote",
  },
  {
    date: "September 2022",
    venue: "Purdue University Fort Wayne",
    location: "Indiana, USA",
    title: "Early Paleozoic reef evolution and marine oxygenation",
  },
  {
    date: "October 2022",
    venue: "Korea Polar Research Institute",
    location: "Korea",
    title: "Great Unconformity in the Korean Peninsula",
  },
  {
    date: "April 2022",
    venue: "The University of Tennessee, Knoxville",
    location: "Tennessee, USA",
    title: "Marine oxygenation and the early development of Paleozoic reefs",
  },
  {
    date: "August 2021",
    venue: "Asia Oceania Geosciences Society 18th Annual Meeting",
    location: "Singapore",
    title: "The early development of Paleozoic reefs linked with marine oxygenation",
    type: "Kamide Award Lecture",
  },
  {
    date: "July 2021",
    venue: "IGCP 668: Equatorial Gondwana History 2021 Annual Meeting",
    location: "Japan (Online)",
    title: "How young researchers can become a professional researcher",
    type: "Special Talk",
  },
  {
    date: "November 2019",
    venue: "1st Asian Palaeontological Congress",
    location: "Beijing, China",
    title: "Cambrian fine-grained stromatolites within oolite",
    type: "Keynote",
  },
  {
    date: "September 2019",
    venue: "Vrije Universiteit Brussel",
    location: "Belgium",
    title: "Marine oxygenation and the early development of Paleozoic reefs",
  },
  {
    date: "November 2016",
    venue: "12th Jeon Jae-Kyu Memorial Conference, Seoul National University",
    location: "Seoul, Korea",
    title: "Microbialites in geologic history: with emphasis on early Paleozoic reef transition",
  },
  // ─── Add new talks above this line ───────────────────────────────
];

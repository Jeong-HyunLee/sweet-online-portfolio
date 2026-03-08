// ╔══════════════════════════════════════════════════════════════════════╗
// ║  LAB MEMBERS — Edit this file to add/remove/update members         ║
// ║                                                                    ║
// ║  HOW TO UPDATE:                                                    ║
// ║  • Add new members at the TOP of the appropriate array             ║
// ║  • When a member graduates, move them to the alumni array          ║
// ║  • Update the role field to show career path (e.g. "MS → Company") ║
// ╚══════════════════════════════════════════════════════════════════════╝

export interface Member {
  name: string;
  /** Role/position: "Postdoc", "MS Student", "PhD Student", "Undergraduate" */
  role: string;
  /** Research topic description */
  topic: string;
  /** Period of membership, e.g. "2021–present" */
  period: string;
}

export const currentMembers: Member[] = [
  // ─── Postdocs first, then students ───────────────────────────────
  { name: "María del Mar Simonet Roda", role: "Postdoc", topic: "EBSD analysis of stromatolites and calcimicrobes", period: "2021–present" },
  { name: "Diego Torromé", role: "Postdoc", topic: "Microfacies and geochemistry of Jurassic sponge-microbial reefs", period: "2025–present" },
  { name: "Ja Yeon Sohn", role: "MS Student", topic: "C & O isotope analysis of gypsum-bearing lacustrine stromatolite", period: "2024–present" },
  { name: "Hyungi Lee", role: "MS Student", topic: "Paleontology of mantis shrimp from the Miocene of Pohang", period: "2025–present" },
  { name: "Jung Mi Kim", role: "MS Student", topic: "Paleontology of sunfish from the Miocene of Pohang", period: "2025–present" },
  { name: "Su Yeong Cho", role: "Undergraduate", topic: "Petrography of Recent Great Salt Lake stromatolites", period: "2024–present" },
];

export const alumni: Member[] = [
  // ─── Most recent graduates first ─────────────────────────────────
  { name: "Juwan Jeon", role: "Postdoc → Sejong Science Fellow", topic: "Paleontology, paleogeography and paleoecology of stromatoporoids", period: "2023–2025" },
  { name: "Seunghoon Lee", role: "MS → Daejeon City Hall", topic: "Phytoclast tufas in the Jinju Formation (Lower Cretaceous)", period: "2021–2024" },
  { name: "Min-Kyu Oh", role: "MS/PhD → Institute of Mineral and Energy Resources", topic: "Sedimentary facies analysis of the Myobong Formation (lower Cambrian)", period: "2018–2024" },
  { name: "Hoang Duy Phạm", role: "MS → Schlumberger", topic: "Keratose sponge–microbial carbonate consortium in the Lower Ordovician", period: "2018–2020" },
];

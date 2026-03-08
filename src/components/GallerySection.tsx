import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import galleryThinsection from "@/assets/gallery-thinsection.jpg";
import galleryOutcrop from "@/assets/gallery-outcrop.jpg";
import galleryLab from "@/assets/gallery-lab.jpg";
import galleryFossils from "@/assets/gallery-fossils.jpg";
import galleryFieldwork from "@/assets/gallery-fieldwork-2.jpg";

interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
}

const images: GalleryItem[] = [
  { src: galleryOutcrop, alt: "Cambrian carbonate outcrop", caption: "Cambrian reef outcrop — layered stratigraphy" },
  { src: galleryThinsection, alt: "Thin section under polarized light", caption: "Petrographic thin section — polarized light" },
  { src: galleryFossils, alt: "Fossil specimens", caption: "Ordovician reef fossil collection" },
  { src: galleryLab, alt: "Research laboratory", caption: "Sedimentology & petrography lab" },
  { src: galleryFieldwork, alt: "Fieldwork expedition", caption: "Field research expedition" },
];

const GallerySection = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((v) => (v !== null ? (v - 1 + images.length) % images.length : null));
  const next = () => setLightbox((v) => (v !== null ? (v + 1) % images.length : null));

  return (
    <section id="gallery" className="py-20">
      <div className="container max-w-6xl">
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Research Gallery
        </h2>
        <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

        {/* Masonry-style grid */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i)}
              className={`group relative overflow-hidden rounded-md ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ aspectRatio: i === 0 ? "4/3" : "3/2" }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-end">
                <p className="text-primary-foreground text-xs font-medium p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/90"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-6 right-6 text-primary-foreground/80 hover:text-primary-foreground"
          >
            <X size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ChevronRight size={36} />
          </button>
          <div className="max-w-4xl max-h-[85vh] px-12" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              className="max-h-[75vh] w-auto mx-auto rounded-md object-contain"
            />
            <p className="mt-3 text-center text-sm text-primary-foreground/70">
              {images[lightbox].caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;

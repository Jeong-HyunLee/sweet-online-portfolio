import { Mail, Phone, ExternalLink, MapPin } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="border-t bg-card py-12">
    <div className="container max-w-5xl">
      <h2 className="font-display text-2xl font-bold text-primary text-center uppercase tracking-wider">
        Contact Information
      </h2>
      <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-accent" />

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Info */}
        <div className="flex flex-col justify-center space-y-6">
          {/* English */}
          <div>
            <h3 className="font-display text-lg font-bold text-primary">JEONG-HYUN LEE</h3>
            <div className="mt-2 flex items-start gap-3">
              <MapPin size={16} className="text-accent mt-1 shrink-0" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                99 Daehak-ro, Yuseong-gu<br />
                Building W11-1, Room 339<br />
                Department of Geological Sciences,<br />
                Chungnam National University,<br />
                Daejeon 34134, Republic of Korea
              </p>
            </div>
            <div className="mt-2 flex items-center gap-3 ml-7">
              <Phone size={14} className="text-accent shrink-0" />
              <span className="text-sm text-muted-foreground">+82-42-821-6425</span>
            </div>
          </div>

          {/* Korean */}
          <div className="border-t pt-4">
            <h3 className="font-display text-lg font-bold text-primary">이정현</h3>
            <div className="mt-2 flex items-start gap-3">
              <MapPin size={16} className="text-accent mt-1 shrink-0" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                대전광역시 유성구 대학로 99<br />
                충남대학교 자연과학대학 지질환경과학과<br />
                자연과학대학 3호관(W11-1) 339호
              </p>
            </div>
            <div className="mt-2 flex items-center gap-3 ml-7">
              <Phone size={14} className="text-accent shrink-0" />
              <span className="text-sm text-muted-foreground">042-821-6425</span>
            </div>
          </div>

          {/* Links */}
          <div className="border-t pt-4 space-y-2">
            <a
              href="mailto:jeonghyunlee@cnu.ac.kr"
              className="inline-flex items-center gap-3 text-sm font-medium text-accent transition-colors hover:text-primary"
            >
              <Mail size={16} /> jeonghyunlee@cnu.ac.kr
            </a>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://scholar.google.com/citations?user=siOMho4AAAAJ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-primary"
              >
                <ExternalLink size={14} /> Google Scholar
              </a>
              <a
                href="https://www.researchgate.net/profile/Jeong-Hyun-Lee-6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-primary"
              >
                <ExternalLink size={14} /> ResearchGate
              </a>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-md overflow-hidden border aspect-[4/3]">
          <iframe
            title="Chungnam National University, Department of Geological Sciences"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=36.3663,127.3400&zoom=16"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} Jeong-Hyun Lee Lab. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;

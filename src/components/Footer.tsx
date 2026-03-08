import { Mail, Phone, ExternalLink, MapPin } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="border-t bg-card py-12">
    <div className="container max-w-5xl">
      <h3 className="font-display text-xl font-bold text-primary text-center">Contact</h3>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {/* Map */}
        <div className="rounded-md overflow-hidden border aspect-[4/3]">
          <iframe
            title="Chungnam National University, College of Natural Sciences Building 3"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1604.5!2d127.3445!3d36.3687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565307d2a16e6c1%3A0x6c1e5c9e9e9e9e9e!2sChungnam+National+University+College+of+Natural+Sciences+Building+3!5e0!3m2!1sen!2skr!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Building 3, College of Natural Sciences
              </p>
              <p className="text-sm text-muted-foreground">
                Chungnam National University
              </p>
              <p className="text-sm text-muted-foreground">
                99 Daehak-ro, Yuseong-gu, Daejeon 34134, Republic of Korea
              </p>
            </div>
          </div>

          <a
            href="mailto:jeonghyunlee@cnu.ac.kr"
            className="inline-flex items-center gap-3 text-sm font-medium text-accent transition-colors hover:text-primary"
          >
            <Mail size={18} /> jeonghyunlee@cnu.ac.kr
          </a>
          <span className="inline-flex items-center gap-3 text-sm text-muted-foreground">
            <Phone size={18} /> +82-42-821-6425
          </span>
          <a
            href="https://scholar.google.com/citations?user=siOMho4AAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm font-medium text-accent transition-colors hover:text-primary"
          >
            <ExternalLink size={18} /> Google Scholar
          </a>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} Jeong-Hyun Lee Lab. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;

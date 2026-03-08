import { Mail, Phone, ExternalLink } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="border-t bg-card py-12">
    <div className="container max-w-4xl text-center">
      <h3 className="font-display text-xl font-bold text-primary">Contact</h3>
      <p className="mt-3 text-sm text-muted-foreground">
        Department of Geological Sciences, Chungnam National University
        <br />
        Daejeon 34134, Republic of Korea
      </p>
      <div className="mt-4 flex flex-col items-center gap-2">
        <a
          href="mailto:jeonghyunlee@cnu.ac.kr"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-primary"
        >
          <Mail size={16} /> jeonghyunlee@cnu.ac.kr
        </a>
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Phone size={16} /> +82-42-821-6425
        </span>
        <a
          href="https://scholar.google.com/citations?user=siOMho4AAAAJ"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-primary"
        >
          <ExternalLink size={16} /> Google Scholar
        </a>
      </div>
      <p className="mt-8 text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} Jeong-Hyun Lee Lab. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;

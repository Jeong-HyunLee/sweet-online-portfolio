import { Mail } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="border-t bg-card py-12">
    <div className="container max-w-4xl text-center">
      <h3 className="font-display text-xl font-bold text-primary">Contact</h3>
      <p className="mt-3 text-sm text-muted-foreground">
        Department of Geological Sciences, Chungnam National University
        <br />
        Daejeon 34134, South Korea
      </p>
      <a
        href="mailto:jeonghyunlee@cnu.ac.kr"
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-primary"
      >
        <Mail size={16} /> jeonghyunlee@cnu.ac.kr
      </a>
      <p className="mt-8 text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} Jeong-Hyun Lee Lab. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;

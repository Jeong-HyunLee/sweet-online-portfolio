import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = ["Home", "Members", "Publications", "Laboratory", "Lectures", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="font-display text-lg font-bold tracking-wide text-primary">
          JH Lee Lab
        </a>
        <ul className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-background px-6 pb-4">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block py-3 text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

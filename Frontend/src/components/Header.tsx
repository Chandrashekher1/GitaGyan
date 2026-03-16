import { Link } from "react-router-dom";

import { BrandMark } from "./BrandMark";
import { Navbar } from "./Navbar";
import { Badge } from "./ui/badge";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background/84 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3 transition-transform duration-300 hover:scale-[1.01]">
          <BrandMark className="h-12 w-12 shrink-0" iconClassName="h-8 w-8" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="display-font truncate text-[2rem] font-semibold leading-none text-foreground sm:text-[2.35rem]">
                GitaGyan
              </span>
              <Badge variant="outline" className="hidden border-primary/15 bg-white/65 text-primary lg:inline-flex">
                Reflective AI
              </Badge>
            </div>
            <p className="hidden text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground md:block">
              Calm intelligence for difficult days
            </p>
          </div>
        </Link>

        <Navbar />
      </div>
    </header>
  );
}

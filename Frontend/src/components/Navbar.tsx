import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Book,
  BookMarked,
  BookOpen,
  ChevronDown,
  Flower2,
  Globe2,
  HeartIcon,
  Home,
  Info,
  LogOutIcon,
  Menu,
  MessageCircle,
  Sparkles,
  UserIcon,
  X,
} from "lucide-react";

import { Language, useLanguage } from "@/context/Language";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("exp");
    localStorage.removeItem("uid");
    navigate("/");
    setMenuOpen(false);
  };

  const handleSignIn = () => {
    navigate(isLoggedIn ? "/profile" : "/login");
    setMenuOpen(false);
  };

  const primaryLinks = [
    { href: "/chapters", label: "Chapters" },
    { href: "/meditation", label: "Meditation" },
    { href: "/check-in", label: "Check-in" },
  ];

  const exploreLinks = [
    {
      href: "/verses",
      label: "Verses",
      description: "Browse verses by chapter and theme.",
      icon: BookOpen,
    },
    {
      href: "/yoga",
      label: "Yoga",
      description: "Move from reflection into guided practice.",
      icon: Flower2,
    },
    {
      href: "/about",
      label: "About",
      description: "See how the platform and backend work together.",
      icon: Info,
    },
  ];

  const mobileLinks = [
    { href: "/", label: "Home", icon: Home, description: "Return to the landing experience.", end: true },
    { href: "/chat", label: "Open chat", icon: MessageCircle, description: "Start a streamed reflection session." },
    { href: "/chapters", label: "Chapters", icon: Book, description: "Navigate the Gita chapter by chapter." },
    { href: "/verses", label: "Verses", icon: BookMarked, description: "Jump directly into specific verses." },
    { href: "/meditation", label: "Meditation", icon: HeartIcon, description: "Breathing and grounding practices." },
    { href: "/check-in", label: "Check-in", icon: Sparkles, description: "Mood check-in and grounding." },
    { href: "/yoga", label: "Yoga", icon: Flower2, description: "Body-based guidance and movement." },
    { href: "/about", label: "About", icon: Info, description: "Product and system overview." },
  ];

  const isChatActive = location.pathname.startsWith("/chat");
  const isExploreActive = exploreLinks.some((item) => location.pathname.startsWith(item.href));
  const languageLabel = language === "en" ? "EN" : "हिं";

  return (
    <nav className="relative flex items-center gap-2">
      <div className="hidden lg:flex items-center gap-1 rounded-full border border-border/70 bg-white/74 p-1.5 shadow-[0_18px_38px_-30px_rgba(55,39,18,0.5)]">
        {primaryLinks.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "relative inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors duration-200",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-bg"
                    className="absolute inset-0 rounded-full bg-primary shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-200 outline-none",
                isExploreActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-white hover:text-foreground"
              )}
            >
              Explore
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80 rounded-[1.75rem] border-border/60 bg-popover/96 p-2">
            <DropdownMenuLabel>More paths</DropdownMenuLabel>
            {exploreLinks.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem key={item.href} asChild className="rounded-[1.25rem] p-0">
                  <Link to={item.href} className="flex items-start gap-3 px-3 py-3">
                    <div className="mt-0.5 rounded-2xl border border-primary/12 bg-primary/8 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full border border-border/70 bg-white/72 px-3.5 text-muted-foreground hover:bg-white"
            >
              <Globe2 className="h-4 w-4" />
              {languageLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-[1.5rem] border-border/60 bg-popover/96">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setLanguage("en" as Language)}
              className={cn(language === "en" && "bg-accent/40 text-foreground")}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage("hi" as Language)}
              className={cn(language === "hi" && "bg-accent/40 text-foreground")}
            >
              हिन्दी
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-border/70 bg-white/72 text-foreground hover:bg-white"
                aria-label="Open account menu"
              >
                <UserIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-[1.5rem] border-border/60 bg-popover/96">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-3">
                  <UserIcon className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut} className="flex items-center gap-3 text-destructive focus:text-destructive">
                <LogOutIcon className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" className="rounded-full border-border/70 bg-white/72 px-5" onClick={handleSignIn}>
            <UserIcon className="h-4 w-4" />
            Sign In
          </Button>
        )}

        <Button asChild className="rounded-full px-5 shadow-sm">
          <Link to="/chat">
            Open Chat
            <Sparkles className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <Button
          asChild
          variant={isChatActive ? "default" : "outline"}
          size="icon"
          className={cn("rounded-full shadow-sm", !isChatActive && "border-border/70 bg-white/82")}
        >
          <Link to="/chat" aria-label="Open chat">
            <MessageCircle className="h-5 w-5" />
          </Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-border/70 bg-white/82 shadow-sm"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+0.8rem)] z-50 w-[min(92vw,24rem)] overflow-hidden rounded-[2rem] border border-border/70 bg-popover/96 shadow-[0_32px_70px_-38px_rgba(45,30,16,0.6)] backdrop-blur-xl lg:hidden"
          >
            <div className="border-b border-border/60 px-5 py-4">
              <p className="text-sm font-semibold text-foreground">Navigate</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Primary actions stay visible. Everything else lives here.
              </p>
            </div>

            <div className="grid gap-2 p-4">
              {mobileLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    end={item.end}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-start gap-3 rounded-[1.5rem] px-4 py-3.5 transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-white/55 text-foreground hover:bg-white/85"
                      )
                    }
                  >
                    <div className="mt-0.5 rounded-2xl border border-black/5 bg-black/5 p-2.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="mt-1 text-xs leading-5 text-current/70">{item.description}</p>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            <div className="border-t border-border/60 px-4 py-4">
              <div className="rounded-[1.6rem] border border-border/70 bg-white/55 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Language</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { value: "en", label: "English" },
                    { value: "hi", label: "हिन्दी" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={language === option.value ? "default" : "outline"}
                      className={cn("rounded-full", language !== option.value && "border-border/70 bg-background/70")}
                      onClick={() => setLanguage(option.value as Language)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 grid gap-2">
                  {isLoggedIn ? (
                    <>
                      <Button
                        variant="outline"
                        className="justify-start rounded-full border-border/70 bg-background/70"
                        onClick={() => {
                          navigate("/profile");
                          setMenuOpen(false);
                        }}
                      >
                        <UserIcon className="h-4 w-4" />
                        Profile
                      </Button>
                      <Button className="justify-start rounded-full" onClick={handleLogOut}>
                        <LogOutIcon className="h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <Button className="justify-start rounded-full" onClick={handleSignIn}>
                      <UserIcon className="h-4 w-4" />
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;

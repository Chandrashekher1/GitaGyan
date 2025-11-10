import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Book,
  BookOpen,
  MessageCircle,
  Info,
  LogOutIcon,
  UserIcon,
  Menu,
  X,
  HeartIcon,
  Flower2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Language, useLanguage } from "@/context/Language";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("uid");
  const { language, setLanguage } = useLanguage();

  const handleLogOut = () => {
    localStorage.removeItem("uid");
    navigate("/");
  };

  const handleSignIn = () => {
    if (localStorage.getItem("uid")) {
      navigate("/profile");
    }
    else {
      navigate("/login");
    }
  };

  const navItems = [
    { id: "", label: "Home", icon: Home },
    { id: "chat", label: "Ask Gita", icon: MessageCircle },
    { id: "about", label: "About Gita", icon: Info },
    { id: "chapters", label: "Chapters", icon: Book },
    { id: "verses", label: "Verses", icon: BookOpen },
    { id: "meditation", label: "Meditation", icon: HeartIcon },
    { id: "yoga", label: "Yoga", icon: Flower2 },
    { id: "profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <nav>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Left side nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/${item.id}`)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-orange-700 hover:bg-orange-100 hover:text-orange-800 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <Select
              value={language}
              onValueChange={(val: Language) => setLanguage(val)}
            >
              <SelectTrigger className="w-24 rounded-xl border border-border hover:bg-primary hover:text-primary-foreground font-semibold">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="py-2 bg-white rounded-xl z-50">
                <SelectItem
                  value="en"
                  className="px-12 border-b py-2 hover:bg-primary hover:text-primary-foreground font-semibold"
                >
                  English
                </SelectItem>
                <SelectItem
                  value="hi"
                  className="px-12 border-b py-2 hover:bg-primary hover:text-primary-foreground font-semibold"
                >
                  हिन्दी
                </SelectItem>
              </SelectContent>
            </Select>

            {isLoggedIn ? (
              <>
                <Button variant="outline" className="rounded-full">
                  <UserIcon />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={handleLogOut}
                >
                  <LogOutIcon />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={handleSignIn}
              >
                <UserIcon />
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-orange-700 p-2 rounded-md hover:bg-orange-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 pb-3 animate-slideDown z-50 bg-white">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/${item.id}`);
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-orange-700 hover:bg-orange-100 hover:text-orange-800 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}

            <Select
              value={language}
              onValueChange={(val: Language) => setLanguage(val)}
            >
              <SelectTrigger className="w-24 rounded-xl border border-border hover:bg-primary hover:text-primary-foreground font-semibold">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="py-2 bg-white rounded-xl z-50">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>

            <div className="border-t border-orange-100 mt-2 pt-2 flex gap-2">
              {isLoggedIn ? (
                <Button variant="outline" className="flex-1" onClick={handleLogOut}>
                  Logout
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" onClick={handleSignIn}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

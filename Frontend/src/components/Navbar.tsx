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
} from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const navItems = [
    { id: "", label: "Home", icon: Home },
    { id: "chat", label: "Ask Gita", icon: MessageCircle },
    { id: "about", label: "About Gita", icon: Info },
    { id: "chapters", label: "Chapters", icon: Book },
    { id: "verses", label: "Verses", icon: BookOpen },
    { id: "meditation", label: "Meditation", icon: BookOpen },
  ];

  return (
    <nav className="">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center ">
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

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="relative group">
                  <Button variant="outline" className="rounded-full">
                    <UserIcon />
                  </Button>
                  <p className="absolute left-1/2 -translate-x-1/2 top-12 text-sm text-orange-700 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
                    Profile
                  </p>
                </div>

                <div className="relative group">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={handleLogOut}
                  >
                    <LogOutIcon />
                  </Button>
                  <p className="absolute left-1/2 -translate-x-1/2 top-12 text-sm text-orange-700 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
                    Logout
                  </p>
                </div>
              </>
            ) : (
              <div className="relative group">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={handleSignIn}
                >
                  <UserIcon />
                </Button>
                <p className="absolute left-1/2 -translate-x-1/2 top-12 text-sm text-orange-700 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
                  Sign In
                </p>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-orange-700 p-2 rounded-md hover:bg-orange-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 pb-3 animate-slideDown">
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

            <div className="border-t border-orange-100 mt-2 pt-2 flex gap-2">
              {isLoggedIn ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleLogOut}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSignIn}
                >
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
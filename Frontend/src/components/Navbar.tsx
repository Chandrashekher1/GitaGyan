import { useNavigate } from "react-router-dom";
import {
  Home,
  Book,
  BookOpen,
  MessageCircle,
  Info,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const navigate = useNavigate();
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
    <nav className="sticky top-0 z-50">
      <div className="mx-auto  sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
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
          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

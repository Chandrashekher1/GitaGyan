import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOutIcon, UserIcon } from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="hidden md:flex items-center gap-6 relative">
      <div className="relative group">
        <Button variant="default" className=" rounded-full">
          <UserIcon />
        </Button>
        <p className="absolute left-1/2 -translate-x-1/2 top-12 text-sm text-primary-foreground bg-primary px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
          Profile
        </p>
      </div>

      <div className="relative group">
        <Button
          variant="default"
          className="rounded-full"
          onClick={handleLogOut}
        >
          <LogOutIcon />
        </Button>
        <p className="absolute left-1/2 -translate-x-1/2 top-12 text-sm text-primary-foreground bg-primary px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
          Logout
        </p>
      </div>
    </div>
  );
}
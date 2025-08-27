import { token } from "@/utils/constant";
import { BookIcon, HeartIcon, MessageCircleIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <div>
      <ul className="flex py-1">
        <li className="mx-4">
          <NavLink
            to={`${token ? '/chat' : 'singIn'}`}
            className={({ isActive }) =>
              `flex font-semibold items-center gap-2 py-2 px-2 rounded-md cursor-pointer transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10 hover:text-primary-foreground text-white/90"
              }`
            }
          >
            <MessageCircleIcon size={20} />
            Chat
          </NavLink>
        </li>

        <li className="mx-4">
          <NavLink
            to="/read"
            className={({ isActive }) =>
              `flex font-semibold items-center gap-2 py-2 px-2 rounded-md cursor-pointer transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10 hover:text-primary-foreground text-white/90"
              }`
            }
          >
            <BookIcon size={20} />
            Read Gita
          </NavLink>
        </li>

        <li className="mx-4">
          <NavLink
            to="/meditation"
            className={({ isActive }) =>
              `flex font-semibold items-center gap-2 py-2 px-2 rounded-md cursor-pointer transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10 hover:text-primary-foreground text-white/90"
              }`
            }
          >
            <HeartIcon size={20} />
            Meditation
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
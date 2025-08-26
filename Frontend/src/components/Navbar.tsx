import { BookIcon, HeartIcon, MessageCircleIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Chat", path: "/chat", icon: <MessageCircleIcon size={20} /> },
    { name: "Read Gita", path: "/gita", icon: <BookIcon size={20} /> },
    { name: "Meditate", path: "/meditate", icon: <HeartIcon size={20} /> },
  ];

  return (
    <div>
      <ul className="flex py-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`mx-4 flex font-semibold items-center py-2 px-2 rounded-md cursor-pointer transition 
                ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary-foreground text-white/90"}`}
            >
              {item.icon}
              <span className="mx-2">{item.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

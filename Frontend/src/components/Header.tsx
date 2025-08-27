import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Navbar } from "./Navbar"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { useContext } from "react"
import AuthContext from "@/context/AuthContext"
import { SpeakerIcon, Volume1Icon } from "lucide-react"

export function Header() {
  const navigate = useNavigate()
  const {token, logout} = useContext(AuthContext)
  

  const handleLogout = () => {
    logout()
    navigate("/signIn")
  }

  return (
    <div className="flex justify-between px-6 md:px-16 border sticky top-0 z-10 bg-accent text-accent-foreground opacity-70">
      <div
        className="font-bold text-2xl py-2 cursor-pointer text-primary flex"
        onClick={() => navigate("/")}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-xl">🕉️</span>
          </div>
          <h2 className="text-2xl font-bold text-accent-foreground">गीताVerse</h2>
        </div>
      </div>

      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="border-l px-2 pt-2 flex gap-4 items-center">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {!token ? (
          <Button
            variant="ghost"
            className="mx-4 hover:bg-secondary cursor-pointer border border-outline"
            onClick={() => navigate("/signIn")}
          >
            Sign In
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="w-8 h-8 rounded-full"
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{localStorage.getItem("user") || "user"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Button onClick={handleLogout} variant="destructive" className="w-full">
                Logout
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div className="">
            <Volume1Icon/>
        </div>
      </div>
    </div>
  )
}

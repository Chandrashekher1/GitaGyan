import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Navbar } from "./Navbar";
import { useTheme } from "./ui/theme-provider";
import { useNavigate } from "react-router-dom";

export function Header() {
    const { setTheme } = useTheme()
    const navigate = useNavigate()

    return (
        <div className="flex justify-between px-16 py-2 border sticky top-0 z-10 bg-accent-foreground opacity-90">
            <div className="font-bold text-2xl py-2 cursor-pointer text-primary flex" onClick={() => navigate('/')}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-xl">🕉️</span>
                    </div>
                    <h2 className="text-2xl font-bold">GitaVerse</h2>
                </div>
            </div>
            <div>
                <Navbar/>
            </div>
            <div className="border-l px-2">
                <DropdownMenu>
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
                </DropdownMenu>
                <Button variant="ghost" className="mx-4 hover:bg-secondary cursor-pointer border border-outline" onClick={() => navigate('/signIn')}>Sign In</Button>
            </div>
        </div>
        
    )
}
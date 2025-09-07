import { Link } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Lotus_Image } from "@/utils/constant";

export function Header() {
    return (
        <div className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 shadow-elevated flex justify-between px-2 md:px-16 py-4 shadow-lg bg-white/70">
            <div>
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
                    <img src={`${Lotus_Image}`} alt="" className="w-10 h-10 rounded-full" />
                    <span className="font-display font-bold text-2xl sacred-text">GitaGyan</span>
                </Link>
            </div>
            <Navbar/>
        </div>
    )
}
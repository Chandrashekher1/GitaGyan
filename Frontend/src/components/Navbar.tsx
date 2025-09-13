import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Krishna_Flute } from "@/utils/constant";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Language, useLanguage } from "@/context/Language";


export function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {language,setLanguage} = useLanguage()

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleSound = () => {
    if (isOpen) {
      audioRef?.current?.pause();
    } else {
      audioRef?.current?.play();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = 1; 
      audioRef.current.loop = true; 
    }
  }, []);

  return (
    <div className="flex items-center gap-6 relative">
      {/* <div className="relative group">
        <Button variant="default" className=" rounded-full">
          <UserIcon />
        </Button>
        <p className="absolute left-1/2 -translate-x-1/2 top-12 text-sm text-primary-foreground bg-primary px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
          Profile
        </p>
      </div> */}

      <div className="">
        <Select value={language} onValueChange={(val: Language) => setLanguage(val)}>
          <SelectTrigger className="w-16 md:w-24 rounded-xl border border-border hover:bg-primary hover:text-primary-foreground font-semibold">
            <SelectValue placeholder={`${language}`} className="font-semibold" />
          </SelectTrigger>
          <SelectContent className="py-2 bg-white rounded-xl">
            <SelectItem value="en" className="px-12 border-b py-2 hover:bg-primary hover:text-primary-foreground font-semibold">english</SelectItem>
            <SelectItem value="hi" className="px-12 border-b py-2 hover:bg-primary hover:text-primary-foreground font-semibold">हिन्दी</SelectItem>
            {/* <SelectItem value="sanskrit" className="px-12 border-b py-2 hover:bg-primary hover:text-primary-foreground font-semibold">संस्कृत</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

        <audio ref={audioRef} src={Krishna_Flute} preload="auto" />
        <div>
          <Button variant="outline" onClick={toggleSound} className="rounded-full w-8 h-8 md:w-10 md:h-10">
            {isOpen ? <Volume2Icon/> : <VolumeOffIcon/>}
          </Button>
        </div>
      <div className="relative group">
        <Button
          variant="default"
          className="rounded-full w-8 h-8 md:w-10 md:h-10"
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
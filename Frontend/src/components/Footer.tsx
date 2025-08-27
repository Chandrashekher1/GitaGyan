import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground border-t border-white/10 mt-16 opacity-70">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-20">
        
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-xl">🕉️</span>
            </div>
            <h2 className="text-2xl font-bold">गीताVerse</h2>
          </div>
          <p className="leading-relaxed">
            Experience the timeless wisdom of the Bhagavad Gita through interactive
            conversations with divine characters. Seek guidance, find peace, and
            discover your spiritual path.
          </p>
          <p className="mt-4 text-lg">
            Made with <span className="text-red-500">❤</span> for spiritual seekers
            worldwide
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-yellow-400 transition">Home</a>
            </li>
            <li>
              <a href="/chat" className="hover:text-yellow-400 transition">Chat with Krishna</a>
            </li>
            <li>
              <a href="/gita" className="hover:text-yellow-400 transition">Read Bhagavad Gita</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Connect</h3>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-yellow-400 transition hover:shadow shadow-amber-700">
              <TwitterIcon size={22} />
            </a>
            <a href="#" className="hover:text-yellow-400 transition">
              <InstagramIcon size={22} />
            </a>
            <a href="#" className="hover:text-yellow-400 transition">
              <FacebookIcon size={22} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm ">
        © 2024 गीताVerse. All rights reserved.{" "}
        <span className="mx-1">🕉️</span> Hare Krishna <span className="mx-1">🕉️</span>
      </div>
    </footer>
  );
}

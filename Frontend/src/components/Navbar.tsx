import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOutIcon, UserIcon } from "lucide-react";

export function Navbar() {
    const navigate = useNavigate()

    const handleLogOut = () => {
        localStorage.removeItem("token");
        navigate("/")
    }

    return(
        <div className="hidden md:flex items-center gap-6">
            {/* <Link to="/chat">Chat</Link> */}
            <div>
                <Button variant="outline" className="mx-4 rounded-full"><UserIcon/></Button>
                <Button variant="outline" className="rounded-full" onClick={handleLogOut}><LogOutIcon/></Button>

            </div>
        </div>
    )
}
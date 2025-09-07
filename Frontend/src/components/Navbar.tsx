import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Navbar() {
    return(
        <div className="hidden md:flex items-center gap-6">
            <Link to="/chat">Chat</Link>

            <div>
                <Button>Profile Icon</Button>
                <Button>SignIn Icon</Button>

            </div>
        </div>
    )
}
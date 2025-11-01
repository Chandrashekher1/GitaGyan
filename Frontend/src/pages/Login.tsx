import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { UserIcon } from "lucide-react";
import { auth, db, provider } from "@/utils/firebase";

export function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem("uid", user.uid);
      navigate("/chat");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: new Date(),
      }, { merge: true });

      localStorage.setItem("uid", user.uid);
      navigate("/chat");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    const guestId = `guest_${Date.now()}`;
    localStorage.setItem("uid", guestId);
    localStorage.setItem("role", "guest");
    alert("Logged In as Guest, 2 min access");

    setTimeout(() => {
      localStorage.clear();
      alert("Guest session expired. Please register to continue.");
      navigate("/login");
    }, 2 * 60 * 1000); 

    navigate("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <Card className="relative overflow-hidden w-full max-w-[95%] md:max-w-[30%] rounded-2xl shadow-xl border border-border/40 backdrop-blur bg-background/80">
        <ShineBorder className="rounded-2xl" shineColor={["#ff6633", "#8ba960", "#fffaf0", "#e9c46a"]} />
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-accent-foreground wave-text">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm md:text-md">
            Sign in to continue your sacred dialogue ✨
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required onChange={(e) => setEmail(e.target.value)} placeholder="arjun@gmail.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            </div>
            <p className="text-sm text-destructive">{error}</p>
            <Button className="w-full rounded-xl py-4 md:py-5 font-semibold shadow-md hover:shadow-lg transition-all" disabled={loading} type="submit">
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button variant="outline" disabled={loading} onClick={handleSignInWithGoogle}>
            <img src="https://storage.googleapis.com/libraries-lib-production/images/GoogleLogo-canvas-404-300px.original.png" alt="google_icon" className="w-5 h-5"/> 
            {loading ? "Logging..." : "Login with Google"}
          </Button>
          <Button variant="outline" disabled={loading} onClick={handleGuest}>
            <UserIcon className="pt-1" /> {loading ? "Logging..." : "Login as Guest"}
          </Button>
          <p className="text-sm text-muted-foreground text-center my-4">
            Don't have an account?
            <Link to="/signup" className="text-primary hover:underline mx-2 font-semibold">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

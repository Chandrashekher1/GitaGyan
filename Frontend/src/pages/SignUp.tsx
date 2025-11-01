import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "@/utils/firebase";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      localStorage.setItem("uid", user.uid);
      navigate("/chat");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      }, { merge: true });

      localStorage.setItem("uid", user.uid);
      navigate("/chat");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="relative overflow-hidden w-full max-w-[95%] md:max-w-[30%] rounded-2xl shadow-xl border border-border/40 backdrop-blur bg-background/80">
        <ShineBorder
          className="rounded-2xl"
          shineColor={["#ff6633", "#8ba960", "#fffaf0", "#e9c46a"]}
        />
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-accent-foreground wave-text">
            Begin Your Journey
          </CardTitle>
          <CardDescription className="text-muted-foreground text-md">
            Create your account to start discovering wisdom 🌿
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => handleSignUp(e)}>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" required onChange={(e) => setName(e.target.value)} placeholder="Arjun" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required onChange={(e) => setEmail(e.target.value)} placeholder="arjun@gmail.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            </div>
            <p className="text-sm text-destructive">{error}</p>
            <Button className="w-full rounded-xl py-5 font-semibold shadow-md hover:shadow-lg transition-all" disabled={loading} type="submit">
              {loading ? "Loading..." : "Create Account"}
            </Button>
            <Button variant="outline" type="button" className="flex items-center justify-center mx-auto" disabled={loading} onClick={handleGoogle}>
              <img src="https://storage.googleapis.com/libraries-lib-production/images/GoogleLogo-canvas-404-300px.original.png" alt="google_icon" className="w-5 h-5"/> 
              {loading ? 'Logging...' : <span className="flex items-center">Signup with Google</span>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground text-center my-4">
            Already have an account?
            <Link to="/login" className="text-primary hover:underline mx-2 font-semibold">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

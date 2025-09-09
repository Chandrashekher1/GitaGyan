import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { Backend_Url } from "@/utils/constant";
import { UserIcon } from "lucide-react";


export function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`${Backend_Url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const json = await response.json();
    if (json?.success) {
      localStorage.setItem("token", json?.token);
      navigate("/chat");
    } else {
      setError("Login failed: " + json.message);
    }
    setLoading(false);
  };

  const handleGuest = async () => {
    setLoading(true);
    const response = await fetch(`${Backend_Url}/user/guest-login`, {
      method: "POST",
    });
    const json = await response.json();
    if (json?.token) {
      alert("Logged in as Guest. You can use 2 minutes.");
      localStorage.setItem("token", json?.token);
      navigate("/chat");
    } else {
      setError("Login failed: " + json.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4 sm:p-6">
      <Card className="relative overflow-hidden w-full max-w-[95%] md:max-w-[30%] rounded-2xl shadow-xl border border-border/40 backdrop-blur bg-background/80">
        <ShineBorder
          className="rounded-2xl"
          shineColor={["#ff6633", "#8ba960", "#fffaf0", "#e9c46a"]}
        />
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-accent-foreground wave-text">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm md:text-md">
            Sign in to continue your sacred dialogue ✨
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => handleLogin(e)}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun@gmail.com"
                className="rounded-lg border-input focus:ring-2 focus:ring-primary text-muted-foreground shadow"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="rounded-lg border shadow focus:ring-2 focus:ring-primary text-muted-foreground"
              />
            </div>
            <p className="text-sm text-destructive">{error}</p>
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-primary hover:underline transition"
              >
                Forgot password?
              </a>
            </div>
            <Button
              className="w-full rounded-xl py-4 md:py-5 font-semibold shadow-md hover:shadow-lg transition-all"
              disabled={loading}
              type="submit"
            >
              {loading ? "Loading..." : "Sign In"}
          </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button variant="outline" type="button" className="relative flex items-center justify-center" disabled={loading} onClick={handleGuest}>
             <UserIcon className="pt-1"/> {loading ? 'Logging...' : (<span className="flex items-center">  Login as Guest</span>)}</Button>
          <p className="text-sm text-muted-foreground text-center my-4">
            Don't have an account?
            <Link
              to="/signup"
              className="text-primary hover:underline mx-2 font-semibold"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

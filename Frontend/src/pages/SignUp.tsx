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
import { useState } from "react";

export function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async() => {
        const response = await fetch("http://localhost:3000/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });
        const json = await response.json();
        console.log(json);

        if (json?.success) {
            localStorage.setItem("token", json?.token);
            navigate("/chat");
        } else {
            alert("Sign up failed: " + json.message);
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 p-6">
      <Card className="relative overflow-hidden w-[30%] rounded-2xl shadow-xl border border-border/40 backdrop-blur bg-background/80">
        <ShineBorder
          className="rounded-2xl"
          shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
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
          <form className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="Arjun"
                className="rounded-lg border-input focus:ring-2 focus:ring-primary text-muted-foreground shadow"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="rounded-lg border shadow focus:ring-2 focus:ring-primary text-muted-foreground"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full rounded-xl py-5 font-semibold shadow-md hover:shadow-lg transition-all" onClick={handleSignUp}>
            Create Account
          </Button>
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

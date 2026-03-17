import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, BookOpenText, Sparkles, Waves } from "lucide-react";
import { toast } from "sonner";

import { Backend_Url } from "@/utils/constant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch(`${Backend_Url}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();
    if (json?.success) {
      localStorage.setItem("token", json?.token);
      if (json?.data?._id) {
        localStorage.setItem("uid", json.data._id);
      }
      navigate("/chat");
      toast.success("Signup successful!");
    } else {
      toast.error(json?.message);
    }

    setLoading(false);
  };

  const handleGoogle = () => {
    setLoading(true);
    window.location.href = `${Backend_Url}/login/auth/google`;
    toast.success("Welcome back!");
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
        <Card className="app-surface border-none bg-card/85 p-0">
          <CardHeader className="space-y-3 px-6 pt-8 sm:px-8">
            <Badge className="w-fit">Create Account</Badge>
            <CardTitle className="display-font text-4xl font-semibold text-foreground">
              Build a calmer digital ritual
            </CardTitle>
            <CardDescription className="max-w-xl text-sm leading-7 text-muted-foreground">
              Start a profile to save conversations, revisit themes, and keep your next best step close.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8">
            <form className="space-y-5" onSubmit={handleSignUp}>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Arjun"
                  className="h-12 rounded-2xl border-border/70 bg-white/70 px-4"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="arjun@gmail.com"
                  className="h-12 rounded-2xl border-border/70 bg-white/70 px-4"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className="h-12 rounded-2xl border-border/70 bg-white/70 px-4"
                />
              </div>

              <Button className="h-12 w-full rounded-full text-sm font-semibold" disabled={loading} type="submit">
                {loading ? "Creating your space..." : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                type="button"
                className="h-11 w-full rounded-full border-border/70 bg-white/65"
                disabled={loading}
                onClick={handleGoogle}
              >
                <img src="https://storage.googleapis.com/libraries-lib-production/images/GoogleLogo-canvas-404-300px.original.png" alt="Google icon" className="h-5 w-5" />
                {loading ? "Connecting..." : "Sign up with Google"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-6 pb-8 sm:px-8">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?
              <Link to="/login" className="ml-2 font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="app-surface flex flex-col justify-between p-8 sm:p-10"
        >
          <div>
            <div className="section-label mb-5">
              <span className="eyebrow-dot" />
              More than a chatbot
            </div>
            <h1 className="display-font text-5xl font-semibold leading-none text-foreground">
              A thoughtful companion for stressful days and meaningful questions.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
              Create an account to unlock a cleaner chat workflow, saved history, and guided rituals grounded in scripture and mental wellness support.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              { icon: Waves, title: "Visible reasoning", description: "See when the system is understanding, retrieving, and composing." },
              { icon: BookOpenText, title: "Contextual verse references", description: "Helpful citations appear only when they strengthen the answer." },
              { icon: Sparkles, title: "Action-oriented follow-ups", description: "Responses point toward grounding, breathing, journaling, and reflection." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[24px] border border-border/70 bg-white/55 p-5">
                  <div className="mb-3 inline-flex rounded-2xl border border-primary/15 bg-primary/8 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

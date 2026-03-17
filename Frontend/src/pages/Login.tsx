import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Sparkles, UserIcon, Waves } from "lucide-react";
import { toast } from "sonner";

import { Backend_Url } from "@/utils/constant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch(`${Backend_Url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();
    if (json?.success) {
      localStorage.setItem("token", json?.token);
      if (json?.data?._id) {
        localStorage.setItem("uid", json.data._id);
      }
      toast.success("Login successfully.");
      navigate("/chat");
    } else {
      toast.error(json?.message);
    }

    setLoading(false);
  };

  const handleGuest = async () => {
    const response = await fetch(`${Backend_Url}/user/guest-login`, { method: "POST" });
    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "guest");
      if (data?.guestId || data?.data?._id) {
        localStorage.setItem("uid", data.guestId ?? data.data._id);
      }
      toast.success("Logged in as guest.");

      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("exp");
        localStorage.removeItem("uid");
        toast.info("Guest session expired. Please register to continue.");
        navigate("/login");
      }, data.expiresIn * 1000);

      navigate("/chat");
    }
  };

  const handleSignInWithGoogle = () => {
    setLoading(true);
    window.location.href = `${Backend_Url}/login/auth/google`;
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="app-surface hidden flex-col justify-between p-8 lg:flex lg:p-10"
        >
          <div>
            <div className="section-label mb-5">
              <span className="eyebrow-dot" />
              Return to your sanctuary
            </div>
            <h1 className="display-font text-5xl font-semibold leading-none text-foreground">
              Pick up the conversation exactly where your reflection paused.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
              Sign in to preserve chat history, revisit guidance, and keep your wellness journey connected across sessions.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              { icon: Waves, title: "Live thinking states", description: "See the assistant reason through your message before it answers." },
              { icon: ShieldCheck, title: "Safer support", description: "Crisis moments trigger clear escalation instead of vague comfort." },
              { icon: Sparkles, title: "Structured guidance", description: "Get a specific ritual, reflection, or insight instead of generic chat filler." },
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
        <Card className="app-surface border-none bg-card/85 p-0">
          <CardHeader className="space-y-3 px-6 pt-8 sm:px-8">
            <Badge className="w-fit">Sign In</Badge>
            <CardTitle className="display-font text-4xl font-semibold text-foreground">Welcome back</CardTitle>
            <CardDescription className="max-w-xl text-sm leading-7 text-muted-foreground">
              Continue your guided dialogue with a calmer, more intentional interface.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8">
            <form className="space-y-5" onSubmit={handleLogin}>
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
                  placeholder="Enter your password"
                  className="h-12 rounded-2xl border-border/70 bg-white/70 px-4"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-white/55 px-4 py-3 text-sm text-muted-foreground">
                <span>Guest access expires automatically after a short session.</span>
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>

              <Button className="h-12 w-full rounded-full text-sm font-semibold" disabled={loading} type="submit">
                {loading ? "Signing in..." : "Enter GitaGyan"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-6 pb-8 sm:px-8">
            <Button
              variant="outline"
              type="button"
              className="h-11 w-full rounded-full border-border/70 bg-white/65"
              disabled={loading}
              onClick={handleSignInWithGoogle}
            >
              <img src="https://storage.googleapis.com/libraries-lib-production/images/GoogleLogo-canvas-404-300px.original.png" alt="Google icon" className="h-5 w-5" />
              {loading ? "Connecting..." : "Continue with Google"}
            </Button>

            <Button
              variant="outline"
              type="button"
              className="h-11 w-full rounded-full border-border/70 bg-white/65"
              disabled={loading}
              onClick={handleGuest}
            >
              <UserIcon className="h-4 w-4" />
              {loading ? "Connecting..." : "Try guest access"}
            </Button>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?
              <Link to="/signup" className="ml-2 font-semibold text-primary hover:underline">
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
        </motion.div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import AuthContext from "@/context/AuthContext"
import { motion } from "framer-motion"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const emailRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = emailRef.current?.value
    const password = passRef.current?.value
    const name = nameRef.current?.value

    const response = await fetch("http://localhost:3000/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const json = await response.json()
    login(json?.token, json?.data?.name || null)

    if (json?.success) {
      navigate("/")
    } else {
      navigate("/signIn")
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full min-h-screen bg-black items-center justify-center px-4",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form
              className="p-6 md:p-8 flex flex-col gap-6"
              onSubmit={handleSignUp}
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your details below
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="krishna"
                  required
                  ref={nameRef}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="krishna@gmail.com"
                  required
                  ref={emailRef}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="krishna@123"
                  required
                  ref={passRef}
                />
              </div>

              <Button type="submit" className="w-full">
                Sign Up
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              <div className="flex justify-center gap-4 w-full">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full flex justify-center items-center gap-2"
                >
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                    alt="google"
                    className="w-6 h-6"
                  />
                  <span className="text-sm">Google</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/signIn" className="underline underline-offset-4">
                  Sign In
                </Link>
              </div>
            </form>

            <div className="relative hidden md:block">
              <img
                src="https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/08/arjun-krishna-during-mahabharata-4.jpg?size=*:900"
                alt="krishna image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

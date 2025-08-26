import { SignUpForm } from "@/components/Signup-form"

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-[#151b23]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/08/arjun-krishna-during-mahabharata-4.jpg?size=*:900"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] dark:"
        />
      </div>
      
    </div>
  )
}

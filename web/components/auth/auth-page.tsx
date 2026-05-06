import Link from "next/link";
import { Orbit } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type AuthPageProps = {
  mode: "login" | "signup";
};

const authCopy = {
  login: {
    title: "Welcome back to the marketplace",
    subtitle: "Log in to continue your WasteStream AI workflow.",
    cta: "Continue with Google",
    secondaryText: "Need an account?",
    secondaryHref: "/signup",
    secondaryLabel: "Create one",
  },
  signup: {
    title: "Join WasteStream AI",
    subtitle: "Create your account as a recycler or provider.",
    cta: "Sign up with Google",
    secondaryText: "Already have an account?",
    secondaryHref: "/login",
    secondaryLabel: "Log in",
  },
} as const;

export function AuthPage({ mode }: AuthPageProps) {
  const copy = authCopy[mode];

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <div className="w-full">
          <Link href="/" className="mb-8 flex items-center justify-between">
            <Logo />
          </Link>

          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">{copy.title}</h2>
            <p className="text-sm leading-6 text-muted">{copy.subtitle}</p>
          </div>

          <div className="mt-8 space-y-4">
            <Button type="button" className="h-12 w-full text-base">
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
              {copy.cta}
            </Button>
          </div>

          <div className="pt-8 text-sm text-muted">
            {copy.secondaryText}{" "}
            <Link href={copy.secondaryHref} className="font-medium text-foreground">
              {copy.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

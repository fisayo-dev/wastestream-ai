"use client";

import Link from "next/link";

import { AuthSessionRedirect } from "@/components/auth/auth-session-redirect";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { Logo } from "@/components/site/logo";

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
      <AuthSessionRedirect />
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
            <GoogleAuthButton label={copy.cta} />
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

import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/login", label: "Login" },
];

export function SiteHeader() {
  return (
    <header className="bg-transparent backdrop-blur-md fade-up sticky top-0 z-40 px-4 pt-4 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl  py-3 ">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/signup">
            <Button>
              Join Marketplace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/6 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

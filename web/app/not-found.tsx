import Link from "next/link";
import { Logo } from "@/components/site/logo";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl text-center">
        <div className="mb-6 flex items-center justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-muted">
          Sorry — we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-2xl border border-border px-4 py-2 text-sm font-medium hover:bg-white/6"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

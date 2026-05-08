"use client";

import * as React from "react";
import { Check, Search } from "lucide-react";

import { cn } from "@/lib/utils";

type CommandProps = React.HTMLAttributes<HTMLDivElement>;

function Command({ className, ...props }: CommandProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-[#101712] text-foreground shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

type CommandInputProps = React.InputHTMLAttributes<HTMLInputElement>;

function CommandInput({ className, ...props }: CommandInputProps) {
  return (
    <div className="flex items-center border-b border-border px-3">
      <Search className="h-4 w-4 text-muted" />
      <input
        className={cn(
          "h-11 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("max-h-64 overflow-auto p-2", className)} {...props} />;
}

function CommandEmpty({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-3 py-6 text-sm text-muted", className)} {...props} />
  );
}

function CommandItem({
  className,
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm outline-none",
        active ? "bg-accent/10 text-foreground" : "hover:bg-white/6",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {active ? <Check className="h-4 w-4 text-accent" /> : null}
    </button>
  );
}

export { Command, CommandInput, CommandList, CommandEmpty, CommandItem };

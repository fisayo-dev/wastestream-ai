import * as React from "react";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white/8 text-sm font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar };

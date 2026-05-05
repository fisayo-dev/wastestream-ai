import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-border bg-white/6 px-3 py-1 text-xs font-medium text-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };

import { Recycle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-[#13210f]">
        <Recycle className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium ">WasteStream AI </p>
      </div>
    </div>
  );
}

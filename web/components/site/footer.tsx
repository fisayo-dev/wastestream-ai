import Link from "next/link";
import { Button } from "../ui/button";

const Footer = () =>{ 
    return (
      <footer className="px-4 pt-6 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 border-t border-border py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">WasteStream AI</p>
            <p className="mt-1 text-sm text-muted">
              Marketplace UI concept for providers and recyclers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="https://github.com/fisayo-dev/wastestream-ai" target="_blank" >
              <Button variant="secondary">Github</Button>
            </Link>
          </div>
        </div>
      </footer>
    );
}

export default Footer
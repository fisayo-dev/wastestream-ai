"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useBackendSession } from "@/hooks/use-backend-session";

export function AuthSessionRedirect() {
  const router = useRouter();
  const { data, isLoading } = useBackendSession();

  useEffect(() => {
    if (!isLoading && data) {
      router.replace("/dashboard");
    }
  }, [data, isLoading, router]);

  return null;
}

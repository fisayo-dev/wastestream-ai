"use client";

import { useEffect, useState } from "react";

import { authProfileUrl, type BackendAuthProfile } from "@/lib/auth";

type SessionState = {
  data: BackendAuthProfile | null;
  isLoading: boolean;
};

export function useBackendSession() {
  const [state, setState] = useState<SessionState>({
    data: null,
    isLoading: true,
  });

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch(authProfileUrl, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to load session");
        }

        const payload = (await response.json()) as BackendAuthProfile | null;
        if (active) {
          setState({
            data: payload,
            isLoading: false,
          });
        }
      } catch {
        if (active) {
          setState({
            data: null,
            isLoading: false,
          });
        }
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  return state;
}

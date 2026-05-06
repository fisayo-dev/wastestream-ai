export const apiBaseUrl =
  process.env.NEXT_BACKEND_PUBLIC_URL ?? "http://localhost:2300/v1";

export const authBaseUrl =
  process.env.NEXT_BACKEND_AUTH_PUBLIC_URL ?? "http://localhost:2300/api/auth";

export const googleAuthUrl = `${authBaseUrl}/sign-in/social`;
export const sessionUrl = `${apiBaseUrl}/auth/session`;
export const logoutUrl = `${apiBaseUrl}/auth/logout`;

export type BackendSession = {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

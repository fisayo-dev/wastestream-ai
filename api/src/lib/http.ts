import type { Response } from "express";

export function applyHeadersToResponse(res: Response, headers: Headers) {
  for (const [key, value] of headers.entries()) {
    if (key.toLowerCase() === "set-cookie") {
      continue;
    }

    res.setHeader(key, value);
  }

  const setCookies = headers.getSetCookie();
  if (setCookies.length > 0) {
    res.setHeader("Set-Cookie", setCookies);
  }
}

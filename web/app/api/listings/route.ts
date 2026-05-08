import { apiBaseUrl, authProfileUrl } from "@/lib/auth";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";

  // Verify session with backend profile endpoint
  const authRes = await fetch(authProfileUrl, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!authRes.ok) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const payload = await req.json();

  // Forward creation to backend listings endpoint (backend enforces ownership/validation)
  const createRes = await fetch(`${apiBaseUrl}/listings`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await createRes.text();

  return new Response(text, {
    status: createRes.status,
    headers: {
      "content-type":
        createRes.headers.get("content-type") ?? "application/json",
    },
  });
}

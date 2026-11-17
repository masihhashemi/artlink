import { NextRequest } from "next/server";
import { corsHeaders, json } from "@/lib/api-auth";
import { readStore } from "@/lib/demo/store";

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  const store = await readStore();
  const user = store.users.find(
    (u) => u.email === email && u.password === password,
  );
  if (!user) {
    return json({ error: "Invalid email or password." }, { status: 401, origin });
  }

  const profile = store.profiles.find((p) => p.id === user.id);
  return json(
    {
      token: user.id,
      user: { id: user.id, email: user.email },
      profile,
    },
    { origin },
  );
}

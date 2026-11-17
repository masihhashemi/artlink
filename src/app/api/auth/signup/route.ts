import { NextRequest } from "next/server";
import { corsHeaders, json } from "@/lib/api-auth";
import { uid, updateStore } from "@/lib/demo/store";

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
  const fullName = String(body.full_name || "").trim();

  if (!email || !password || password.length < 6 || !fullName) {
    return json(
      { error: "Please fill all fields (password min 6 characters)." },
      { status: 400, origin },
    );
  }

  let userId = "";
  let error: string | null = null;

  await updateStore((store) => {
    if (store.users.some((u) => u.email === email)) {
      error = "An account with that email already exists.";
      return;
    }
    userId = uid("user");
    const now = new Date().toISOString();
    store.users.push({
      id: userId,
      email,
      password,
      full_name: fullName,
    });
    store.profiles.push({
      id: userId,
      full_name: fullName,
      headline: "",
      description: "",
      avatar_url: null,
      onboarded: false,
      created_at: now,
      updated_at: now,
    });
  });

  if (error) return json({ error }, { status: 400, origin });

  const { readStore } = await import("@/lib/demo/store");
  const store = await readStore();
  const profile = store.profiles.find((p) => p.id === userId);

  return json(
    {
      token: userId,
      user: { id: userId, email },
      profile,
    },
    { origin },
  );
}

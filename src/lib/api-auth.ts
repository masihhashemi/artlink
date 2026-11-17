import { NextRequest } from "next/server";
import { readStore } from "@/lib/demo/store";
import type { Profile } from "@/lib/types";

export function corsHeaders(origin?: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-User-Id",
    "Access-Control-Max-Age": "86400",
  };
}

export function json(
  data: unknown,
  init: { status?: number; origin?: string | null } = {},
) {
  return Response.json(data, {
    status: init.status ?? 200,
    headers: corsHeaders(init.origin),
  });
}

/** Demo mobile auth: Bearer <userId> or X-User-Id header. */
export async function getApiUserId(
  request: NextRequest,
): Promise<string | null> {
  const auth = request.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice(7).trim();
    if (token) return token;
  }
  const headerId = request.headers.get("x-user-id");
  return headerId?.trim() || null;
}

export async function requireApiUser(
  request: NextRequest,
): Promise<{ userId: string; profile: Profile } | Response> {
  const origin = request.headers.get("origin");
  const userId = await getApiUserId(request);
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401, origin });
  }
  const store = await readStore();
  const profile = store.profiles.find((p) => p.id === userId);
  if (!profile) {
    return json({ error: "User not found" }, { status: 401, origin });
  }
  return { userId, profile };
}

export function isErrorResponse(
  value: { userId: string; profile: Profile } | Response,
): value is Response {
  return value instanceof Response;
}

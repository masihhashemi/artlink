import { NextRequest } from "next/server";
import {
  corsHeaders,
  isErrorResponse,
  json,
  requireApiUser,
} from "@/lib/api-auth";
import { getProfileById } from "@/lib/queries";
import { readStore } from "@/lib/demo/store";

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const origin = request.headers.get("origin");
  const auth = await requireApiUser(request);
  if (isErrorResponse(auth)) return auth;

  const { id } = await context.params;
  const profile = await getProfileById(id);
  if (!profile) {
    return json({ error: "Profile not found" }, { status: 404, origin });
  }

  const store = await readStore();
  const connection = store.connections.find(
    (c) =>
      (c.requester_id === auth.userId && c.recipient_id === id) ||
      (c.requester_id === id && c.recipient_id === auth.userId),
  );

  return json({ profile, connection: connection ?? null }, { origin });
}

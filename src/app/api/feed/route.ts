import { NextRequest } from "next/server";
import {
  corsHeaders,
  isErrorResponse,
  json,
  requireApiUser,
} from "@/lib/api-auth";
import { getFeed } from "@/lib/queries";

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const auth = await requireApiUser(request);
  if (isErrorResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const posts = await getFeed({
    viewerId: auth.userId,
    type: searchParams.get("type") || undefined,
    skillSlug: searchParams.get("skill") || undefined,
  });

  return json({ posts }, { origin });
}

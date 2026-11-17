import { NextRequest } from "next/server";
import {
  corsHeaders,
  isErrorResponse,
  json,
  requireApiUser,
} from "@/lib/api-auth";
import {
  recommendOpportunities,
  recommendPeople,
} from "@/lib/recommendations";

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

  const [people, opportunities] = await Promise.all([
    recommendPeople(auth.userId),
    recommendOpportunities(auth.userId),
  ]);

  return json({ people, opportunities }, { origin });
}

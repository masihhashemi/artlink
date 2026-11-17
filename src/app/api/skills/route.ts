import { NextRequest } from "next/server";
import { corsHeaders, json } from "@/lib/api-auth";
import { getAllSkills } from "@/lib/queries";

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const skills = await getAllSkills();
  return json({ skills }, { origin });
}

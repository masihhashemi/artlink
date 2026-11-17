import { NextRequest } from "next/server";
import {
  corsHeaders,
  isErrorResponse,
  json,
  requireApiUser,
} from "@/lib/api-auth";
import { readStore } from "@/lib/demo/store";
import type { Skill } from "@/lib/types";

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

  const store = await readStore();
  const me = auth.userId;

  const skillsFor = (profileId: string): Skill[] =>
    store.profile_skills
      .filter((ps) => ps.profile_id === profileId)
      .map((ps) => store.skills.find((s) => s.id === ps.skill_id))
      .filter((s): s is Skill => Boolean(s));

  const withPerson = (
    list: typeof store.connections,
    pickId: (c: (typeof store.connections)[0]) => string,
  ) =>
    list
      .map((c) => {
        const person = store.profiles.find((p) => p.id === pickId(c));
        if (!person) return null;
        return {
          connection: c,
          profile: person,
          skills: skillsFor(person.id),
        };
      })
      .filter(Boolean);

  const incoming = withPerson(
    store.connections.filter(
      (c) => c.recipient_id === me && c.status === "pending",
    ),
    (c) => c.requester_id,
  );
  const outgoing = withPerson(
    store.connections.filter(
      (c) => c.requester_id === me && c.status === "pending",
    ),
    (c) => c.recipient_id,
  );
  const accepted = withPerson(
    store.connections.filter(
      (c) =>
        c.status === "accepted" &&
        (c.requester_id === me || c.recipient_id === me),
    ),
    (c) => (c.requester_id === me ? c.recipient_id : c.requester_id),
  );

  return json({ incoming, outgoing, accepted }, { origin });
}

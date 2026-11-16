import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { PersonCard } from "@/components/people/PersonCard";
import { requireProfile } from "@/lib/auth";
import { readStore } from "@/lib/demo/store";
import { respondToConnection } from "@/lib/actions/connections";
import { startOrOpenThread } from "@/lib/actions/messages";
import type { Skill } from "@/lib/types";

export default async function NetworkPage() {
  const me = await requireProfile();
  const store = await readStore();

  const incoming = store.connections.filter(
    (c) => c.recipient_id === me.id && c.status === "pending",
  );
  const outgoing = store.connections.filter(
    (c) => c.requester_id === me.id && c.status === "pending",
  );
  const accepted = store.connections.filter(
    (c) =>
      c.status === "accepted" &&
      (c.requester_id === me.id || c.recipient_id === me.id),
  );

  const profileMap = Object.fromEntries(store.profiles.map((p) => [p.id, p]));
  const skillsFor = (profileId: string): Skill[] =>
    store.profile_skills
      .filter((ps) => ps.profile_id === profileId)
      .map((ps) => store.skills.find((s) => s.id === ps.skill_id))
      .filter((s): s is Skill => Boolean(s));

  return (
    <AppShell>
      <div className="mb-8">
        <span className="sticker bg-[var(--mint)] mb-3">✦ your circle</span>
        <h1 className="section-title">Network</h1>
        <p className="mt-2 text-[var(--muted)] font-semibold">
          Manage connections with other art alumni.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold mb-4">
          Incoming requests
          {incoming.length > 0 && (
            <span className="ml-2 sticker bg-[var(--sun)] align-middle">
              {incoming.length} waiting
            </span>
          )}
        </h2>
        {incoming.length === 0 ? (
          <div className="panel p-6 text-sm font-semibold text-[var(--muted)]">
            No pending requests.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {incoming.map((conn, index) => {
              const person = profileMap[conn.requester_id];
              if (!person) return null;
              return (
                <PersonCard
                  key={conn.id}
                  profile={person}
                  skills={skillsFor(person.id)}
                  index={index}
                  action={
                    <div className="flex gap-2">
                      <form action={respondToConnection}>
                        <input
                          type="hidden"
                          name="connection_id"
                          value={conn.id}
                        />
                        <input type="hidden" name="decision" value="accepted" />
                        <button type="submit" className="btn-primary text-sm">
                          Accept
                        </button>
                      </form>
                      <form action={respondToConnection}>
                        <input
                          type="hidden"
                          name="connection_id"
                          value={conn.id}
                        />
                        <input type="hidden" name="decision" value="rejected" />
                        <button type="submit" className="btn-secondary text-sm">
                          Decline
                        </button>
                      </form>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold mb-4">
          Your connections
        </h2>
        {accepted.length === 0 ? (
          <EmptyState
            title="No connections yet"
            description="Discover people with complementary skills and send a request."
            action={
              <Link href="/discover" className="btn-primary">
                Go to Discover
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {accepted.map((conn, index) => {
              const otherId =
                conn.requester_id === me.id
                  ? conn.recipient_id
                  : conn.requester_id;
              const person = profileMap[otherId];
              if (!person) return null;
              return (
                <PersonCard
                  key={conn.id}
                  profile={person}
                  skills={skillsFor(person.id)}
                  index={index}
                  action={
                    <form action={startOrOpenThread}>
                      <input type="hidden" name="other_id" value={person.id} />
                      <button type="submit" className="btn-secondary text-sm">
                        Message
                      </button>
                    </form>
                  }
                />
              );
            })}
          </div>
        )}
      </section>

      {outgoing.length > 0 && (
        <section className="panel p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold mb-4">
            Sent requests
          </h2>
          <div className="space-y-3">
            {outgoing.map((conn) => {
              const person = profileMap[conn.recipient_id];
              if (!person) return null;
              return (
                <div key={conn.id} className="flex items-center gap-3">
                  <Avatar
                    name={person.full_name}
                    src={person.avatar_url}
                    size="sm"
                  />
                  <div className="text-sm font-semibold">
                    <span>{person.full_name}</span>
                    <span className="text-[var(--muted)]"> · pending</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </AppShell>
  );
}

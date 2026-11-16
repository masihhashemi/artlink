import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { PostCard } from "@/components/posts/PostCard";
import { PersonCard } from "@/components/people/PersonCard";
import { ConnectActions } from "@/components/connections/ConnectActions";
import { requireProfile } from "@/lib/auth";
import { readStore } from "@/lib/demo/store";
import {
  recommendOpportunities,
  recommendPeople,
} from "@/lib/recommendations";

export default async function DiscoverPage() {
  const profile = await requireProfile();
  const store = await readStore();
  const [people, opportunities] = await Promise.all([
    recommendPeople(profile.id),
    recommendOpportunities(profile.id),
  ]);

  const connectionFor = (otherId: string) =>
    store.connections.find(
      (c) =>
        (c.requester_id === profile.id && c.recipient_id === otherId) ||
        (c.requester_id === otherId && c.recipient_id === profile.id),
    );

  return (
    <AppShell>
      <div className="mb-8 relative">
        <div className="art-blob mint absolute -right-4 -top-6 h-24 w-24 opacity-50" />
        <span className="sticker bg-[var(--sky)] mb-3">✦ match magic</span>
        <h1 className="section-title">Discover</h1>
        <p className="mt-2 text-[var(--muted)] font-semibold">
          People and projects that vibe with your skills.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold mb-4">
          People for you
        </h2>
        {people.length === 0 ? (
          <EmptyState
            title="No matches yet"
            description="Add more skills or create looking-for / offering posts to improve recommendations."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {people.map((item, index) => (
              <PersonCard
                key={item.profile.id}
                profile={item.profile}
                skills={item.skills}
                reasons={item.reasons}
                score={item.score}
                index={index}
                action={
                  <ConnectActions
                    viewerId={profile.id}
                    profileId={item.profile.id}
                    connection={connectionFor(item.profile.id)}
                    compact
                  />
                }
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold mb-4">
          Opportunities for you
        </h2>
        {opportunities.length === 0 ? (
          <EmptyState
            title="No opportunities matched"
            description="When someone posts looking for your skills, they'll show up here."
          />
        ) : (
          <div className="space-y-4">
            {opportunities.map((item) => (
              <div key={item.post.id}>
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="sticker bg-[var(--sun)]">
                    Match {item.score}
                  </span>
                  {item.reasons.map((reason) => (
                    <span key={reason} className="skill-chip">
                      {reason}
                    </span>
                  ))}
                </div>
                <PostCard post={item.post} />
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

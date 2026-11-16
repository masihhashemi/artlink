import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { SkillChips } from "@/components/ui/SkillChips";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireProfile } from "@/lib/auth";
import { getProfileById } from "@/lib/queries";
import { readStore } from "@/lib/demo/store";
import { ConnectActions } from "@/components/connections/ConnectActions";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await requireProfile();
  const profile = await getProfileById(id);
  if (!profile) notFound();

  const store = await readStore();
  const connection = store.connections.find(
    (c) =>
      (c.requester_id === me.id && c.recipient_id === id) ||
      (c.requester_id === id && c.recipient_id === me.id),
  );
  const isMe = me.id === id;

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="person-card">
          <div className="person-card-banner tall alt-1" />
          <div className="px-6 pb-6 md:px-8">
            <div className="-mt-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                <div className="rounded-full border border-[var(--line)] bg-white p-1.5 shadow-[var(--shadow-sm)]">
                  <Avatar
                    name={profile.full_name}
                    src={profile.avatar_url}
                    size="xl"
                  />
                </div>
                <div className="pb-1">
                  <h1 className="font-[family-name:var(--font-display)] text-3xl font-normal tracking-tight">
                    {profile.full_name}
                  </h1>
                  <p className="font-medium text-[var(--muted)]">
                    {profile.headline || "Art Link member"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {isMe ? (
                  <Link href="/profile/edit" className="btn-secondary">
                    Edit profile
                  </Link>
                ) : (
                  <ConnectActions
                    viewerId={me.id}
                    profileId={id}
                    connection={connection}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-normal tracking-tight mb-3">
            About
          </h2>
          <p className="whitespace-pre-wrap text-[var(--ink-soft)] leading-relaxed">
            {profile.description || "No description yet."}
          </p>
          <div className="mt-4">
            <SkillChips skills={profile.skills} />
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl mb-4">
            Education
          </h2>
          {profile.education.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No education listed.</p>
          ) : (
            <div className="space-y-4">
              {profile.education.map((edu) => (
                <div key={edu.id} className="border-t border-[var(--line)] pt-4 first:border-0 first:pt-0">
                  <div className="font-semibold">{edu.university}</div>
                  <div className="text-sm text-[var(--muted)]">
                    {[edu.degree_or_program, edu.field_of_study]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                  {(edu.start_date || edu.end_date || edu.is_current) && (
                    <div className="text-xs text-[var(--muted)] mt-1">
                      {edu.start_date || "?"} —{" "}
                      {edu.is_current ? "Present" : edu.end_date || "?"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl mb-4">
            Experience
          </h2>
          {profile.experiences.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No experience listed.</p>
          ) : (
            <div className="space-y-4">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="border-t border-[var(--line)] pt-4 first:border-0 first:pt-0">
                  <div className="font-semibold">{exp.title}</div>
                  <div className="text-sm text-[var(--muted)]">
                    {[exp.organization, exp.location].filter(Boolean).join(" · ")}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1">
                    {exp.start_date || "?"} —{" "}
                    {exp.is_current ? "Present" : exp.end_date || "?"}
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm text-[var(--ink-soft)]">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl mb-4">
            Portfolio
          </h2>
          {profile.portfolio_images.length === 0 ? (
            <EmptyState
              title="No portfolio images yet"
              description={
                isMe
                  ? "Add photos of your work from the edit profile page."
                  : "This member hasn't uploaded portfolio images."
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {profile.portfolio_images.map((image) => (
                <figure key={image.id} className="overflow-hidden border border-[var(--line)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.image_url}
                    alt={image.caption || "Portfolio piece"}
                    className="aspect-square w-full object-cover"
                  />
                  {image.caption && (
                    <figcaption className="px-2 py-2 text-xs text-[var(--muted)]">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

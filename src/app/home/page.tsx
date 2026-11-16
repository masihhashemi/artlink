import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PostCard } from "@/components/posts/PostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireProfile } from "@/lib/auth";
import { getAllSkills, getFeed } from "@/lib/queries";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; skill?: string }>;
}) {
  const profile = await requireProfile();
  const params = await searchParams;
  const [posts, skills] = await Promise.all([
    getFeed({
      viewerId: profile.id,
      type: params.type,
      skillSlug: params.skill,
    }),
    getAllSkills(),
  ]);

  return (
    <AppShell>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="sticker bg-[var(--accent-soft)] mb-3">
            hey {profile.full_name.split(" ")[0]} ✦
          </span>
          <h1 className="section-title">Studio wall</h1>
          <p className="mt-2 text-[var(--muted)] font-semibold">
            Opportunities, offerings, and updates from art alumni.
          </p>
        </div>
        <Link href="/posts/new" className="btn-primary">
          Create post
        </Link>
      </div>

      <form className="mb-6 flex flex-wrap gap-3">
        <select
          name="type"
          defaultValue={params.type || "all"}
          className="input select-input appearance-none max-w-[180px]"
        >
          <option value="all">All posts</option>
          <option value="looking_for">Looking for</option>
          <option value="offering">Offering</option>
          <option value="update">Updates</option>
        </select>
        <select
          name="skill"
          defaultValue={params.skill || ""}
          className="input select-input appearance-none max-w-[220px]"
        >
          <option value="">All skills</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.slug}>
              {skill.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-secondary">
          Filter
        </button>
      </form>

      {posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Be the first to share what you're looking for or offering."
          action={
            <Link href="/posts/new" className="btn-primary">
              Create post
            </Link>
          }
        />
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </AppShell>
  );
}

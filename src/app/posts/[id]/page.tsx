import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { AppShell } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { SkillChips } from "@/components/ui/SkillChips";
import { ApplyButton } from "@/components/posts/ApplyButton";
import { requireProfile } from "@/lib/auth";
import { addComment, toggleLike } from "@/lib/actions/posts";
import { hydratePost } from "@/lib/queries";
import { readStore } from "@/lib/demo/store";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();
  const store = await readStore();
  const raw = store.posts.find((p) => p.id === id);
  if (!raw) notFound();

  const post = await hydratePost(raw, profile.id);
  const comments = store.comments
    .filter((c) => c.post_id === id)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .map((c) => ({
      ...c,
      author: store.profiles.find((p) => p.id === c.author_id)!,
    }));

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/home" className="text-sm text-[var(--muted)]">
          ← Back to feed
        </Link>

        <article className="panel p-6 md:p-8">
          <div className="mb-4 flex items-center gap-3">
            <Avatar name={post.author.full_name} src={post.author.avatar_url} />
            <div>
              <Link
                href={`/profile/${post.author.id}`}
                className="font-semibold"
              >
                {post.author.full_name}
              </Link>
              <div className="text-sm text-[var(--muted)]">
                {post.type.replace("_", " ")} ·{" "}
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
          <p className="text-lg leading-relaxed whitespace-pre-wrap mb-4">
            {post.body}
          </p>
          <SkillChips skills={post.skills} />

          {post.matches_me && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="sticker bg-[var(--mint)]">
                You match ·{" "}
                {post.matched_skills.map((s) => s.name).join(", ")}
              </span>
              <ApplyButton
                postId={post.id}
                matchedSkillNames={post.matched_skills.map((s) => s.name)}
                applied={post.applied_by_me}
              />
            </div>
          )}

          <form action={toggleLike} className="mt-5">
            <input type="hidden" name="post_id" value={post.id} />
            <button type="submit" className="btn-secondary text-sm">
              {post.liked_by_me ? "Unlike" : "Like"} · {post.like_count}
            </button>
          </form>
        </article>

        <section className="panel p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl mb-4">
            Comments
          </h2>
          <form action={addComment} className="mb-6 space-y-3">
            <input type="hidden" name="post_id" value={post.id} />
            <textarea
              name="body"
              required
              className="textarea min-h-[90px]"
              placeholder="Write a comment..."
            />
            <button type="submit" className="btn-primary">
              Comment
            </button>
          </form>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-t border-[var(--line)] pt-4">
                <div className="mb-2 flex items-center gap-2">
                  <Avatar
                    name={comment.author.full_name}
                    src={comment.author.avatar_url}
                    size="sm"
                  />
                  <div>
                    <div className="text-sm font-semibold">
                      {comment.author.full_name}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
                <p className="text-[var(--ink-soft)]">{comment.body}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-[var(--muted)]">No comments yet.</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

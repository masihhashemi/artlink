import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SkillChips } from "@/components/ui/SkillChips";
import { ApplyButton } from "@/components/posts/ApplyButton";
import { toggleLike } from "@/lib/actions/posts";
import type { PostWithRelations } from "@/lib/types";

const typeLabels = {
  looking_for: "Looking for",
  offering: "Offering",
  update: "Studio note",
};

const typeStyles = {
  looking_for: "bg-[var(--accent-soft)]",
  offering: "bg-[var(--mint)]",
  update: "bg-[var(--sun)]",
};

export function PostCard({ post }: { post: PostWithRelations }) {
  return (
    <article className="panel relative overflow-hidden p-5 md:p-6 fade-up">
      <div className="art-blob sky absolute -right-10 -top-12 h-28 w-28 opacity-40" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <Link
            href={`/profile/${post.author.id}`}
            className="flex items-center gap-3"
          >
            <div className="rounded-full border-2 border-[var(--ink)] p-0.5 bg-white shadow-[2px_2px_0_var(--ink)]">
              <Avatar name={post.author.full_name} src={post.author.avatar_url} />
            </div>
            <div>
              <div className="font-extrabold">{post.author.full_name}</div>
              <div className="text-sm text-[var(--muted)]">
                {post.author.headline || "Art Link member"}
              </div>
            </div>
          </Link>
          <div className="text-right">
            <span className={`skill-chip ${typeStyles[post.type]}`}>
              {typeLabels[post.type]}
            </span>
            <div className="mt-2 text-xs font-bold text-[var(--muted)]">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>

        <Link href={`/posts/${post.id}`}>
          <p className="text-[1.08rem] leading-relaxed whitespace-pre-wrap mb-4">
            {post.body}
          </p>
        </Link>

        <SkillChips skills={post.skills} />

        {post.matches_me && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="sticker bg-[var(--mint)]">
              Skill match · {post.matched_skills.map((s) => s.name).join(", ")}
            </span>
            <ApplyButton
              postId={post.id}
              matchedSkillNames={post.matched_skills.map((s) => s.name)}
              applied={post.applied_by_me}
              compact
            />
          </div>
        )}

        <div className="mt-5 flex items-center gap-4 border-t-2 border-dashed border-[var(--line)] pt-4">
          <form action={toggleLike}>
            <input type="hidden" name="post_id" value={post.id} />
            <button
              type="submit"
              className={`inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] px-3 py-1.5 text-sm font-bold shadow-[2px_2px_0_var(--ink)] ${
                post.liked_by_me
                  ? "bg-[var(--accent)] text-white"
                  : "bg-white text-[var(--ink)]"
              }`}
            >
              <Heart
                size={16}
                fill={post.liked_by_me ? "currentColor" : "none"}
              />
              {post.like_count}
            </button>
          </form>
          <Link
            href={`/posts/${post.id}`}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1.5 text-sm font-bold shadow-[2px_2px_0_var(--ink)]"
          >
            <MessageSquare size={16} />
            {post.comment_count}
          </Link>
        </div>
      </div>
    </article>
  );
}

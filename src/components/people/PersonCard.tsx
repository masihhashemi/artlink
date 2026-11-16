import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { SkillChips } from "@/components/ui/SkillChips";
import type { Profile, Skill } from "@/lib/types";

type PersonCardProps = {
  profile: Profile;
  skills?: Skill[];
  reasons?: string[];
  score?: number;
  action?: React.ReactNode;
  index?: number;
};

const banners = ["", "alt-1", "alt-2", "alt-3"];

export function PersonCard({
  profile,
  skills = [],
  reasons = [],
  score,
  action,
  index = 0,
}: PersonCardProps) {
  const banner = banners[index % banners.length];

  return (
    <article className="person-card fade-up">
      <div className={`person-card-banner ${banner}`} />
      <div className="px-5 pb-5">
        <div className="-mt-8 mb-4 flex items-end justify-between gap-3">
          <Link href={`/profile/${profile.id}`} className="flex items-end gap-3">
            <div className="rounded-full border-2 border-[var(--ink)] bg-white p-1 shadow-[3px_3px_0_var(--ink)]">
              <Avatar name={profile.full_name} src={profile.avatar_url} size="lg" />
            </div>
            <div className="pb-1">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-extrabold leading-tight">
                {profile.full_name}
              </h3>
              <p className="text-sm text-[var(--muted)]">
                {profile.headline || "Art Link member"}
              </p>
            </div>
          </Link>
          {typeof score === "number" && (
            <span className="sticker bg-[var(--sun)]">Match {score}</span>
          )}
        </div>

        {skills.length > 0 && (
          <div className="mb-3">
            <SkillChips skills={skills} />
          </div>
        )}

        {reasons.length > 0 && (
          <ul className="mb-4 space-y-1 text-sm text-[var(--ink-soft)]">
            {reasons.slice(0, 3).map((reason) => (
              <li key={reason}>✦ {reason}</li>
            ))}
          </ul>
        )}

        {action && <div className="mt-2">{action}</div>}
      </div>
    </article>
  );
}

"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { applyToPost } from "@/lib/actions/applications";

type ApplyButtonProps = {
  postId: string;
  matchedSkillNames: string[];
  applied?: boolean;
  compact?: boolean;
};

export function ApplyButton({
  postId,
  matchedSkillNames,
  applied = false,
  compact = false,
}: ApplyButtonProps) {
  const [open, setOpen] = useState(false);

  if (applied) {
    return (
      <span className="sticker bg-[var(--mint)]">Applied ✦</span>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        className={compact ? "btn-primary text-sm" : "btn-primary"}
        onClick={() => setOpen(true)}
      >
        <Sparkles size={16} />
        Apply
      </button>
    );
  }

  return (
    <form
      action={applyToPost}
      className="w-full basis-full rounded-[1.25rem] border-2 border-[var(--ink)] bg-[var(--sun)]/40 p-4 space-y-3"
    >
      <input type="hidden" name="post_id" value={postId} />
      <div>
        <div className="text-sm font-extrabold mb-1">Apply & connect</div>
        <p className="text-xs font-semibold text-[var(--ink-soft)]">
          Sends your profile info and matched skills
          {matchedSkillNames.length
            ? ` (${matchedSkillNames.join(", ")})`
            : ""}{" "}
          to the poster, connects you, and opens a chat.
        </p>
      </div>
      <textarea
        name="note"
        className="textarea min-h-[80px]"
        placeholder="Optional note — why you're a good fit..."
      />
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary text-sm">
          <Sparkles size={14} />
          Send application
        </button>
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import type { Skill } from "@/lib/types";

type SkillPickerProps = {
  skills: Skill[];
  selectedIds?: string[];
  name?: string;
};

export function SkillPicker({
  skills,
  selectedIds = [],
  name = "skill_ids",
}: SkillPickerProps) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(selectedIds),
  );
  const [custom, setCustom] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const catalog = useMemo(() => skills, [skills]);

  function addCustom() {
    const value = draft.trim();
    if (!value) return;
    const existing = skills.find(
      (s) => s.name.toLowerCase() === value.toLowerCase(),
    );
    if (existing) {
      setSelected((prev) => new Set(prev).add(existing.id));
    } else if (!custom.some((c) => c.toLowerCase() === value.toLowerCase())) {
      setCustom((prev) => [...prev, value]);
    }
    setDraft("");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {catalog.map((skill) => {
          const checked = selected.has(skill.id);
          return (
            <label key={skill.id} className="skill-option">
              <input
                type="checkbox"
                name={name}
                value={skill.id}
                checked={checked}
                onChange={() => {
                  setSelected((prev) => {
                    const next = new Set(prev);
                    if (next.has(skill.id)) next.delete(skill.id);
                    else next.add(skill.id);
                    return next;
                  });
                }}
              />
              <span>{skill.name}</span>
            </label>
          );
        })}

        {custom.map((skillName) => (
          <span key={skillName} className="skill-option bg-[var(--accent-soft)]">
            <input type="hidden" name="custom_skills" value={skillName} />
            <span>{skillName}</span>
            <button
              type="button"
              aria-label={`Remove ${skillName}`}
              onClick={() =>
                setCustom((prev) =>
                  prev.filter((c) => c.toLowerCase() !== skillName.toLowerCase()),
                )
              }
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="Don't see your skill? Add it (e.g. Set designer)"
        />
        <button
          type="button"
          className="btn-secondary shrink-0"
          onClick={addCustom}
        >
          <Plus size={16} />
          Add skill
        </button>
      </div>
      <p className="text-xs font-semibold text-[var(--muted)]">
        Custom skills join the shared list so other alumni can pick them too.
      </p>
    </div>
  );
}

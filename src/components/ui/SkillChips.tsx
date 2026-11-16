import type { Skill } from "@/lib/types";

export function SkillChips({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span key={skill.id} className="skill-chip">
          {skill.name}
        </span>
      ))}
    </div>
  );
}

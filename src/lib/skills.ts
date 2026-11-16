import { uid } from "@/lib/demo/store";
import type { Store } from "@/lib/types";

export function slugifySkill(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Resolve existing skill ids + create any custom skill names. */
export function resolveSkillIds(
  store: Store,
  skillIds: string[],
  customNames: string[],
): string[] {
  const resolved = new Set<string>();

  for (const id of skillIds) {
    if (store.skills.some((s) => s.id === id)) resolved.add(id);
  }

  for (const raw of customNames) {
    const name = raw.trim();
    if (!name) continue;
    const slug = slugifySkill(name);
    if (!slug) continue;

    let skill = store.skills.find(
      (s) =>
        s.slug === slug || s.name.toLowerCase() === name.toLowerCase(),
    );
    if (!skill) {
      skill = {
        id: uid("skill"),
        name,
        slug,
      };
      store.skills.push(skill);
    }
    resolved.add(skill.id);
  }

  return [...resolved];
}

export function parseCustomSkills(formData: FormData): string[] {
  const fromList = formData.getAll("custom_skills").map(String);
  const fromCsv = String(formData.get("custom_skills_csv") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...fromList, ...fromCsv];
}

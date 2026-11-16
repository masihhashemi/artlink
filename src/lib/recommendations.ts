import { readStore } from "@/lib/demo/store";
import type {
  RecommendationOpportunity,
  RecommendationPerson,
  Skill,
} from "@/lib/types";
import { hydratePost } from "@/lib/queries";

export async function recommendPeople(
  userId: string,
  limit = 8,
): Promise<RecommendationPerson[]> {
  const store = await readStore();
  const mySkillIds = new Set(
    store.profile_skills
      .filter((ps) => ps.profile_id === userId)
      .map((ps) => ps.skill_id),
  );
  const myUnis = new Set(
    store.education
      .filter((e) => e.profile_id === userId)
      .map((e) => e.university.toLowerCase()),
  );
  const myLookingSkillIds = new Set(
    store.posts
      .filter((p) => p.author_id === userId && p.type === "looking_for")
      .flatMap((p) =>
        store.post_skills
          .filter((ps) => ps.post_id === p.id)
          .map((ps) => ps.skill_id),
      ),
  );
  const myOfferingSkillIds = new Set(
    store.posts
      .filter((p) => p.author_id === userId && p.type === "offering")
      .flatMap((p) =>
        store.post_skills
          .filter((ps) => ps.post_id === p.id)
          .map((ps) => ps.skill_id),
      ),
  );

  const connected = new Set<string>();
  for (const c of store.connections) {
    if (c.status !== "accepted") continue;
    if (c.requester_id === userId) connected.add(c.recipient_id);
    if (c.recipient_id === userId) connected.add(c.requester_id);
  }

  const results: RecommendationPerson[] = [];

  for (const profile of store.profiles) {
    if (profile.id === userId || !profile.onboarded) continue;
    if (connected.has(profile.id)) continue;

    const theirSkills = store.profile_skills
      .filter((ps) => ps.profile_id === profile.id)
      .map((ps) => store.skills.find((s) => s.id === ps.skill_id))
      .filter(Boolean) as Skill[];

    let score = 0;
    const reasons: string[] = [];

    const shared = theirSkills.filter((s) => mySkillIds.has(s.id));
    if (shared.length) {
      score += shared.length * 3;
      reasons.push(`Shared skills: ${shared.map((s) => s.name).join(", ")}`);
    }

    const complementaryOffer = theirSkills.filter((s) =>
      myLookingSkillIds.has(s.id),
    );
    if (complementaryOffer.length) {
      score += complementaryOffer.length * 5;
      reasons.push(
        `They have skills you're looking for: ${complementaryOffer.map((s) => s.name).join(", ")}`,
      );
    }

    const complementaryNeed = theirSkills.filter((s) =>
      myOfferingSkillIds.has(s.id),
    );
    // Also check their looking_for posts vs my skills
    const theirLooking = store.posts
      .filter((p) => p.author_id === profile.id && p.type === "looking_for")
      .flatMap((p) =>
        store.post_skills
          .filter((ps) => ps.post_id === p.id)
          .map((ps) => ps.skill_id),
      );
    const iCanHelp = [...mySkillIds].filter((id) => theirLooking.includes(id));
    if (iCanHelp.length) {
      const skillNames = iCanHelp
        .map((id) => store.skills.find((s) => s.id === id)?.name)
        .filter(Boolean);
      score += iCanHelp.length * 5;
      reasons.push(`They need skills you have: ${skillNames.join(", ")}`);
    } else if (complementaryNeed.length) {
      score += complementaryNeed.length * 2;
    }

    const theirUnis = store.education
      .filter((e) => e.profile_id === profile.id)
      .map((e) => e.university.toLowerCase());
    if (theirUnis.some((u) => myUnis.has(u))) {
      score += 1;
      reasons.push("Same university");
    }

    if (score > 0) {
      results.push({ profile, skills: theirSkills, score, reasons });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export async function recommendOpportunities(
  userId: string,
  limit = 8,
): Promise<RecommendationOpportunity[]> {
  const store = await readStore();
  const mySkillIds = new Set(
    store.profile_skills
      .filter((ps) => ps.profile_id === userId)
      .map((ps) => ps.skill_id),
  );

  const results: RecommendationOpportunity[] = [];

  for (const post of store.posts) {
    if (post.author_id === userId) continue;
    if (post.type === "update") continue;

    const postSkillIds = store.post_skills
      .filter((ps) => ps.post_id === post.id)
      .map((ps) => ps.skill_id);
    const overlap = postSkillIds.filter((id) => mySkillIds.has(id));
    if (!overlap.length) continue;

    let score = overlap.length * 5;
    const skillNames = overlap
      .map((id) => store.skills.find((s) => s.id === id)?.name)
      .filter(Boolean) as string[];

    const ageHours =
      (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
    if (ageHours < 72) score += 2;
    else if (ageHours < 168) score += 1;

    const reasons =
      post.type === "looking_for"
        ? [`Matches your skills: ${skillNames.join(", ")}`]
        : [`Relevant to your skills: ${skillNames.join(", ")}`];

    results.push({
      post: await hydratePost(post, userId),
      score,
      reasons,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

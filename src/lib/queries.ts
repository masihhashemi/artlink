import { readStore } from "@/lib/demo/store";
import type {
  Post,
  PostWithRelations,
  ProfileWithRelations,
  Skill,
} from "@/lib/types";

export async function getProfileById(
  id: string,
): Promise<ProfileWithRelations | null> {
  const store = await readStore();
  const profile = store.profiles.find((p) => p.id === id);
  if (!profile) return null;

  const skills = store.profile_skills
    .filter((ps) => ps.profile_id === id)
    .map((ps) => store.skills.find((s) => s.id === ps.skill_id))
    .filter(Boolean) as Skill[];

  return {
    ...profile,
    skills,
    education: store.education
      .filter((e) => e.profile_id === id)
      .sort((a, b) => a.sort_order - b.sort_order),
    experiences: store.experiences
      .filter((e) => e.profile_id === id)
      .sort((a, b) => a.sort_order - b.sort_order),
    portfolio_images: store.portfolio_images
      .filter((p) => p.profile_id === id)
      .sort((a, b) => a.sort_order - b.sort_order),
  };
}

export async function hydratePost(
  post: Post,
  viewerId?: string | null,
): Promise<PostWithRelations> {
  const store = await readStore();
  const author = store.profiles.find((p) => p.id === post.author_id)!;
  const skills = store.post_skills
    .filter((ps) => ps.post_id === post.id)
    .map((ps) => store.skills.find((s) => s.id === ps.skill_id))
    .filter(Boolean) as Skill[];
  const likes = store.likes.filter((l) => l.post_id === post.id);
  const comments = store.comments.filter((c) => c.post_id === post.id);

  const mySkillIds = viewerId
    ? new Set(
        store.profile_skills
          .filter((ps) => ps.profile_id === viewerId)
          .map((ps) => ps.skill_id),
      )
    : new Set<string>();
  const matchedSkills = skills.filter((s) => mySkillIds.has(s.id));
  const isOwn = Boolean(viewerId && post.author_id === viewerId);
  const canMatchType = post.type === "looking_for" || post.type === "offering";

  return {
    ...post,
    author,
    skills,
    like_count: likes.length,
    comment_count: comments.length,
    liked_by_me: viewerId
      ? likes.some((l) => l.profile_id === viewerId)
      : false,
    is_own: isOwn,
    matches_me: Boolean(
      viewerId && !isOwn && canMatchType && matchedSkills.length > 0,
    ),
    applied_by_me: viewerId
      ? store.applications.some(
          (a) => a.post_id === post.id && a.applicant_id === viewerId,
        )
      : false,
    matched_skills: matchedSkills,
  };
}

export async function getFeed(options: {
  viewerId: string;
  type?: string;
  skillSlug?: string;
}): Promise<PostWithRelations[]> {
  const store = await readStore();
  let posts = [...store.posts].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  if (options.type && options.type !== "all") {
    posts = posts.filter((p) => p.type === options.type);
  }

  if (options.skillSlug) {
    const skill = store.skills.find((s) => s.slug === options.skillSlug);
    if (skill) {
      const postIds = new Set(
        store.post_skills
          .filter((ps) => ps.skill_id === skill.id)
          .map((ps) => ps.post_id),
      );
      posts = posts.filter((p) => postIds.has(p.id));
    }
  }

  return Promise.all(posts.map((p) => hydratePost(p, options.viewerId)));
}

export async function getUnreadNotificationCount(
  userId: string,
): Promise<number> {
  const store = await readStore();
  return store.notifications.filter((n) => n.user_id === userId && !n.read)
    .length;
}

export async function getPendingIncomingConnectionCount(
  userId: string,
): Promise<number> {
  const store = await readStore();
  return store.connections.filter(
    (c) => c.recipient_id === userId && c.status === "pending",
  ).length;
}

export async function getAllSkills(): Promise<Skill[]> {
  const store = await readStore();
  return store.skills;
}

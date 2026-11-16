"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/auth";
import { uid, updateStore } from "@/lib/demo/store";
import { parseCustomSkills, resolveSkillIds } from "@/lib/skills";
import type { PostType } from "@/lib/types";

export async function createPost(formData: FormData) {
  const userId = await requireUserId();
  const type = String(formData.get("type") || "update") as PostType;
  const body = String(formData.get("body") || "").trim();
  const skillIds = formData.getAll("skill_ids").map(String);
  const customSkills = parseCustomSkills(formData);

  if (!body) throw new Error("Post body is required.");

  let postId = "";
  await updateStore((store) => {
    postId = uid("post");
    const now = new Date().toISOString();
    const resolved = resolveSkillIds(store, skillIds, customSkills);
    store.posts.unshift({
      id: postId,
      author_id: userId,
      type,
      body,
      created_at: now,
      updated_at: now,
    });
    for (const skillId of resolved) {
      store.post_skills.push({ post_id: postId, skill_id: skillId });
    }

    // Notify users with matching skills
    if (type === "looking_for" || type === "offering") {
      const author = store.profiles.find((p) => p.id === userId);
      const skillNames = resolved
        .map((id) => store.skills.find((s) => s.id === id)?.name)
        .filter(Boolean);

      for (const profile of store.profiles) {
        if (profile.id === userId || !profile.onboarded) continue;
        const theirSkills = new Set(
          store.profile_skills
            .filter((ps) => ps.profile_id === profile.id)
            .map((ps) => ps.skill_id),
        );
        const overlap = resolved.filter((id) => theirSkills.has(id));
        if (!overlap.length) continue;

        const overlapNames = overlap
          .map((id) => store.skills.find((s) => s.id === id)?.name)
          .filter(Boolean);

        const message =
          type === "looking_for"
            ? `${author?.full_name ?? "Someone"} is looking for skills you have: ${overlapNames.join(", ")}`
            : `${author?.full_name ?? "Someone"} is offering skills relevant to you: ${overlapNames.join(", ")}`;

        store.notifications.unshift({
          id: uid("notif"),
          user_id: profile.id,
          type: "skill_match_post",
          payload: {
            post_id: postId,
            author_id: userId,
            message,
            skills: skillNames,
          },
          read: false,
          created_at: now,
        });
      }
    }
  });

  revalidatePath("/home");
  revalidatePath("/notifications");
  redirect(`/posts/${postId}`);
}

export async function toggleLike(formData: FormData) {
  const userId = await requireUserId();
  const postId = String(formData.get("post_id") || "");

  await updateStore((store) => {
    const existing = store.likes.find(
      (l) => l.post_id === postId && l.profile_id === userId,
    );
    if (existing) {
      store.likes = store.likes.filter(
        (l) => !(l.post_id === postId && l.profile_id === userId),
      );
    } else {
      store.likes.push({
        post_id: postId,
        profile_id: userId,
        created_at: new Date().toISOString(),
      });
      const post = store.posts.find((p) => p.id === postId);
      const me = store.profiles.find((p) => p.id === userId);
      if (post && post.author_id !== userId) {
        store.notifications.unshift({
          id: uid("notif"),
          user_id: post.author_id,
          type: "like",
          payload: {
            post_id: postId,
            actor_id: userId,
            message: `${me?.full_name ?? "Someone"} liked your post`,
          },
          read: false,
          created_at: new Date().toISOString(),
        });
      }
    }
  });

  revalidatePath("/home");
  revalidatePath(`/posts/${postId}`);
}

export async function addComment(formData: FormData) {
  const userId = await requireUserId();
  const postId = String(formData.get("post_id") || "");
  const body = String(formData.get("body") || "").trim();
  if (!body) throw new Error("Comment cannot be empty.");

  await updateStore((store) => {
    store.comments.push({
      id: uid("comment"),
      post_id: postId,
      author_id: userId,
      body,
      created_at: new Date().toISOString(),
    });
    const post = store.posts.find((p) => p.id === postId);
    const me = store.profiles.find((p) => p.id === userId);
    if (post && post.author_id !== userId) {
      store.notifications.unshift({
        id: uid("notif"),
        user_id: post.author_id,
        type: "comment",
        payload: {
          post_id: postId,
          actor_id: userId,
          message: `${me?.full_name ?? "Someone"} commented on your post`,
        },
        read: false,
        created_at: new Date().toISOString(),
      });
    }
  });

  revalidatePath("/home");
  revalidatePath(`/posts/${postId}`);
}

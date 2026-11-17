import { NextRequest } from "next/server";
import {
  corsHeaders,
  isErrorResponse,
  json,
  requireApiUser,
} from "@/lib/api-auth";
import { uid, updateStore } from "@/lib/demo/store";

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const origin = request.headers.get("origin");
  const auth = await requireApiUser(request);
  if (isErrorResponse(auth)) return auth;

  const { id: postId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const note = String(body.note || "").trim();
  let threadId = "";

  try {
    await updateStore((store) => {
      const post = store.posts.find((p) => p.id === postId);
      if (!post) throw new Error("Post not found.");
      if (post.author_id === auth.userId) {
        throw new Error("You can't apply to your own post.");
      }
      if (post.type === "update") {
        throw new Error("You can only apply to looking-for or offering posts.");
      }

      const already = store.applications.find(
        (a) => a.post_id === postId && a.applicant_id === auth.userId,
      );
      if (already) {
        threadId = already.thread_id || "";
        return;
      }

      const mySkillIds = new Set(
        store.profile_skills
          .filter((ps) => ps.profile_id === auth.userId)
          .map((ps) => ps.skill_id),
      );
      const postSkillIds = store.post_skills
        .filter((ps) => ps.post_id === postId)
        .map((ps) => ps.skill_id);
      const matchedSkills = postSkillIds
        .filter((id) => mySkillIds.has(id))
        .map((id) => store.skills.find((s) => s.id === id)?.name)
        .filter(Boolean) as string[];

      if (!matchedSkills.length) {
        throw new Error("Apply is available when your skills match this post.");
      }

      const me = store.profiles.find((p) => p.id === auth.userId);
      const education = store.education.filter(
        (e) => e.profile_id === auth.userId,
      );
      const mySkills = store.profile_skills
        .filter((ps) => ps.profile_id === auth.userId)
        .map((ps) => store.skills.find((s) => s.id === ps.skill_id)?.name)
        .filter(Boolean) as string[];

      const existingConn = store.connections.find(
        (c) =>
          (c.requester_id === auth.userId &&
            c.recipient_id === post.author_id) ||
          (c.requester_id === post.author_id &&
            c.recipient_id === auth.userId),
      );
      const now = new Date().toISOString();
      if (!existingConn) {
        store.connections.push({
          id: uid("conn"),
          requester_id: auth.userId,
          recipient_id: post.author_id,
          status: "accepted",
          created_at: now,
          updated_at: now,
        });
      } else if (existingConn.status !== "accepted") {
        existingConn.status = "accepted";
        existingConn.updated_at = now;
      }

      const existingThread = store.message_threads.find((t) => {
        const participants = store.thread_participants
          .filter((p) => p.thread_id === t.id)
          .map((p) => p.profile_id);
        return (
          participants.includes(auth.userId) &&
          participants.includes(post.author_id) &&
          participants.length === 2
        );
      });
      threadId = existingThread?.id || uid("thread");
      if (!existingThread) {
        store.message_threads.push({
          id: threadId,
          created_at: now,
          updated_at: now,
        });
        store.thread_participants.push(
          { thread_id: threadId, profile_id: auth.userId },
          { thread_id: threadId, profile_id: post.author_id },
        );
      }

      const uniLine = education.length
        ? education.map((e) => e.university).join(", ")
        : "Not listed";

      const intro = [
        `✦ Application for your post`,
        ``,
        `Hi! I'm ${me?.full_name ?? "an Art Link member"} and I'd love to collaborate.`,
        ``,
        `Headline: ${me?.headline || "—"}`,
        `Skills: ${mySkills.join(", ") || "—"}`,
        `Matched skills: ${matchedSkills.join(", ")}`,
        `University: ${uniLine}`,
        me?.description ? `About me: ${me.description}` : null,
        note ? `Note: ${note}` : null,
        ``,
        `View my profile: /profile/${auth.userId}`,
      ]
        .filter((line) => line !== null)
        .join("\n");

      store.messages.push({
        id: uid("msg"),
        thread_id: threadId,
        sender_id: auth.userId,
        body: intro,
        created_at: now,
      });
      const thread = store.message_threads.find((t) => t.id === threadId);
      if (thread) thread.updated_at = now;

      store.applications.push({
        id: uid("app"),
        post_id: postId,
        applicant_id: auth.userId,
        note,
        thread_id: threadId,
        created_at: now,
      });

      store.notifications.unshift({
        id: uid("notif"),
        user_id: post.author_id,
        type: "application",
        payload: {
          post_id: postId,
          applicant_id: auth.userId,
          thread_id: threadId,
          message: `${me?.full_name ?? "Someone"} applied to your post with matching skills: ${matchedSkills.join(", ")}`,
        },
        read: false,
        created_at: now,
      });
    });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "Apply failed" },
      { status: 400, origin },
    );
  }

  return json({ ok: true, thread_id: threadId }, { origin });
}

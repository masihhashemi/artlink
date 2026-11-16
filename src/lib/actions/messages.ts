"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/auth";
import { readStore, uid, updateStore } from "@/lib/demo/store";

function areConnected(
  store: Awaited<ReturnType<typeof readStore>>,
  a: string,
  b: string,
) {
  return store.connections.some(
    (c) =>
      c.status === "accepted" &&
      ((c.requester_id === a && c.recipient_id === b) ||
        (c.requester_id === b && c.recipient_id === a)),
  );
}

export async function startOrOpenThread(formData: FormData) {
  const userId = await requireUserId();
  const otherId = String(formData.get("other_id") || "");
  const store = await readStore();

  if (!areConnected(store, userId, otherId)) {
    throw new Error("You can only message connections.");
  }

  const existing = store.message_threads.find((t) => {
    const participants = store.thread_participants
      .filter((p) => p.thread_id === t.id)
      .map((p) => p.profile_id);
    return (
      participants.includes(userId) &&
      participants.includes(otherId) &&
      participants.length === 2
    );
  });

  if (existing) {
    redirect(`/messages/${existing.id}`);
  }

  let threadId = "";
  await updateStore((s) => {
    threadId = uid("thread");
    const now = new Date().toISOString();
    s.message_threads.push({
      id: threadId,
      created_at: now,
      updated_at: now,
    });
    s.thread_participants.push(
      { thread_id: threadId, profile_id: userId },
      { thread_id: threadId, profile_id: otherId },
    );
  });

  redirect(`/messages/${threadId}`);
}

export async function sendMessage(formData: FormData) {
  const userId = await requireUserId();
  const threadId = String(formData.get("thread_id") || "");
  const body = String(formData.get("body") || "").trim();
  if (!body) throw new Error("Message cannot be empty.");

  await updateStore((store) => {
    const isParticipant = store.thread_participants.some(
      (p) => p.thread_id === threadId && p.profile_id === userId,
    );
    if (!isParticipant) return;

    const now = new Date().toISOString();
    store.messages.push({
      id: uid("msg"),
      thread_id: threadId,
      sender_id: userId,
      body,
      created_at: now,
    });
    const thread = store.message_threads.find((t) => t.id === threadId);
    if (thread) thread.updated_at = now;

    const others = store.thread_participants
      .filter((p) => p.thread_id === threadId && p.profile_id !== userId)
      .map((p) => p.profile_id);
    const me = store.profiles.find((p) => p.id === userId);
    for (const otherId of others) {
      store.notifications.unshift({
        id: uid("notif"),
        user_id: otherId,
        type: "message",
        payload: {
          thread_id: threadId,
          actor_id: userId,
          message: `New message from ${me?.full_name ?? "someone"}`,
        },
        read: false,
        created_at: now,
      });
    }
  });

  revalidatePath(`/messages/${threadId}`);
  revalidatePath("/messages");
  revalidatePath("/notifications");
}

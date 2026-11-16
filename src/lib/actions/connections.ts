"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth";
import { uid, updateStore } from "@/lib/demo/store";

export async function sendConnectionRequest(formData: FormData) {
  const userId = await requireUserId();
  const recipientId = String(formData.get("recipient_id") || "");
  if (!recipientId || recipientId === userId) throw new Error("Invalid user.");

  await updateStore((store) => {
    const existing = store.connections.find(
      (c) =>
        (c.requester_id === userId && c.recipient_id === recipientId) ||
        (c.requester_id === recipientId && c.recipient_id === userId),
    );
    if (existing) {
      // Allow reconnect after a decline
      if (existing.status === "rejected") {
        existing.requester_id = userId;
        existing.recipient_id = recipientId;
        existing.status = "pending";
        existing.updated_at = new Date().toISOString();
        const me = store.profiles.find((p) => p.id === userId);
        store.notifications.unshift({
          id: uid("notif"),
          user_id: recipientId,
          type: "connection_request",
          payload: {
            requester_id: userId,
            connection_id: existing.id,
            message: `${me?.full_name ?? "Someone"} wants to connect`,
          },
          read: false,
          created_at: new Date().toISOString(),
        });
      }
      return;
    }

    const now = new Date().toISOString();
    const connectionId = uid("conn");
    store.connections.push({
      id: connectionId,
      requester_id: userId,
      recipient_id: recipientId,
      status: "pending",
      created_at: now,
      updated_at: now,
    });

    const me = store.profiles.find((p) => p.id === userId);
    store.notifications.unshift({
      id: uid("notif"),
      user_id: recipientId,
      type: "connection_request",
      payload: {
        requester_id: userId,
        connection_id: connectionId,
        message: `${me?.full_name ?? "Someone"} wants to connect`,
      },
      read: false,
      created_at: now,
    });
  });

  revalidatePath("/network");
  revalidatePath(`/profile/${recipientId}`);
  revalidatePath(`/profile/${userId}`);
  revalidatePath("/discover");
  revalidatePath("/notifications");
  revalidatePath("/home");
}

export async function respondToConnection(formData: FormData) {
  const userId = await requireUserId();
  const connectionId = String(formData.get("connection_id") || "");
  const decision = String(formData.get("decision") || "") as
    | "accepted"
    | "rejected";

  let requesterId = "";

  await updateStore((store) => {
    const conn = store.connections.find(
      (c) => c.id === connectionId && c.recipient_id === userId,
    );
    if (!conn) return;
    conn.status = decision;
    conn.updated_at = new Date().toISOString();
    requesterId = conn.requester_id;

    if (decision === "accepted") {
      const me = store.profiles.find((p) => p.id === userId);
      store.notifications.unshift({
        id: uid("notif"),
        user_id: conn.requester_id,
        type: "connection_accepted",
        payload: {
          recipient_id: userId,
          message: `${me?.full_name ?? "Someone"} accepted your connection`,
        },
        read: false,
        created_at: new Date().toISOString(),
      });
    }
  });

  revalidatePath("/network");
  revalidatePath("/notifications");
  revalidatePath("/discover");
  revalidatePath("/home");
  revalidatePath(`/profile/${userId}`);
  if (requesterId) revalidatePath(`/profile/${requesterId}`);
}

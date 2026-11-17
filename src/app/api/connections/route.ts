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

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const auth = await requireApiUser(request);
  if (isErrorResponse(auth)) return auth;

  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "");

  if (action === "request") {
    const recipientId = String(body.recipient_id || "");
    if (!recipientId || recipientId === auth.userId) {
      return json({ error: "Invalid user." }, { status: 400, origin });
    }

    await updateStore((store) => {
      const existing = store.connections.find(
        (c) =>
          (c.requester_id === auth.userId && c.recipient_id === recipientId) ||
          (c.requester_id === recipientId && c.recipient_id === auth.userId),
      );
      if (existing) {
        if (existing.status === "rejected") {
          existing.requester_id = auth.userId;
          existing.recipient_id = recipientId;
          existing.status = "pending";
          existing.updated_at = new Date().toISOString();
        }
        return;
      }
      const now = new Date().toISOString();
      const connectionId = uid("conn");
      store.connections.push({
        id: connectionId,
        requester_id: auth.userId,
        recipient_id: recipientId,
        status: "pending",
        created_at: now,
        updated_at: now,
      });
      const me = store.profiles.find((p) => p.id === auth.userId);
      store.notifications.unshift({
        id: uid("notif"),
        user_id: recipientId,
        type: "connection_request",
        payload: {
          requester_id: auth.userId,
          connection_id: connectionId,
          message: `${me?.full_name ?? "Someone"} wants to connect`,
        },
        read: false,
        created_at: now,
      });
    });

    return json({ ok: true }, { origin });
  }

  if (action === "respond") {
    const connectionId = String(body.connection_id || "");
    const decision = String(body.decision || "") as "accepted" | "rejected";
    await updateStore((store) => {
      const conn = store.connections.find(
        (c) => c.id === connectionId && c.recipient_id === auth.userId,
      );
      if (!conn) return;
      conn.status = decision;
      conn.updated_at = new Date().toISOString();
      if (decision === "accepted") {
        const me = store.profiles.find((p) => p.id === auth.userId);
        store.notifications.unshift({
          id: uid("notif"),
          user_id: conn.requester_id,
          type: "connection_accepted",
          payload: {
            recipient_id: auth.userId,
            message: `${me?.full_name ?? "Someone"} accepted your connection`,
          },
          read: false,
          created_at: new Date().toISOString(),
        });
      }
    });
    return json({ ok: true }, { origin });
  }

  return json({ error: "Unknown action" }, { status: 400, origin });
}

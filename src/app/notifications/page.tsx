import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireProfile } from "@/lib/auth";
import { readStore } from "@/lib/demo/store";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/actions/notifications";
import { respondToConnection } from "@/lib/actions/connections";

function notificationHref(
  type: string,
  payload: Record<string, unknown>,
) {
  if (type === "application" && typeof payload.thread_id === "string") {
    return `/messages/${payload.thread_id}`;
  }
  if (typeof payload.thread_id === "string")
    return `/messages/${payload.thread_id}`;
  if (typeof payload.post_id === "string") return `/posts/${payload.post_id}`;
  if (typeof payload.requester_id === "string")
    return `/profile/${payload.requester_id}`;
  if (typeof payload.applicant_id === "string")
    return `/profile/${payload.applicant_id}`;
  if (typeof payload.recipient_id === "string")
    return `/profile/${payload.recipient_id}`;
  if (typeof payload.actor_id === "string")
    return `/profile/${payload.actor_id}`;
  return "/notifications";
}

export default async function NotificationsPage() {
  const me = await requireProfile();
  const store = await readStore();
  const notifications = store.notifications
    .filter((n) => n.user_id === me.id)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  return (
    <AppShell>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="section-title">Notifications</h1>
          <p className="mt-2 text-[var(--muted)]">
            Skill matches, connection requests, likes, and messages.
          </p>
        </div>
        {notifications.some((n) => !n.read) && (
          <form action={markAllNotificationsRead}>
            <button type="submit" className="btn-secondary text-sm">
              Mark all read
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="You're all caught up"
          description="When someone posts looking for your skills, you'll see it here."
        />
      ) : (
        <div className="panel divide-y divide-[var(--line)]">
          {notifications.map((n) => {
            const message =
              typeof n.payload.message === "string"
                ? n.payload.message
                : "New notification";
            const href = notificationHref(n.type, n.payload);
            const connectionId =
              typeof n.payload.connection_id === "string"
                ? n.payload.connection_id
                : store.connections.find(
                    (c) =>
                      c.status === "pending" &&
                      c.recipient_id === me.id &&
                      typeof n.payload.requester_id === "string" &&
                      c.requester_id === n.payload.requester_id,
                  )?.id;
            const canRespond =
              n.type === "connection_request" && Boolean(connectionId);

            return (
              <div
                key={n.id}
                className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between ${
                  n.read ? "opacity-70" : "bg-[var(--accent-soft)]/40"
                }`}
              >
                <div>
                  <Link href={href} className="font-medium hover:underline">
                    {message}
                  </Link>
                  <div className="mt-1 text-xs text-[var(--muted)]">
                    {formatDistanceToNow(new Date(n.created_at), {
                      addSuffix: true,
                    })}{" "}
                    · {n.type.replaceAll("_", " ")}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {canRespond && connectionId && (
                    <>
                      <form action={respondToConnection}>
                        <input
                          type="hidden"
                          name="connection_id"
                          value={connectionId}
                        />
                        <input type="hidden" name="decision" value="accepted" />
                        <button type="submit" className="btn-primary text-sm">
                          Accept
                        </button>
                      </form>
                      <form action={respondToConnection}>
                        <input
                          type="hidden"
                          name="connection_id"
                          value={connectionId}
                        />
                        <input type="hidden" name="decision" value="rejected" />
                        <button type="submit" className="btn-secondary text-sm">
                          Decline
                        </button>
                      </form>
                    </>
                  )}
                  {!n.read && (
                    <form action={markNotificationRead}>
                      <input type="hidden" name="id" value={n.id} />
                      <button
                        type="submit"
                        className="text-xs font-semibold text-[var(--accent)]"
                      >
                        Mark read
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

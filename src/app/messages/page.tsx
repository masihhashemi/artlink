import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AppShell } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireProfile } from "@/lib/auth";
import { readStore } from "@/lib/demo/store";

export default async function MessagesPage() {
  const me = await requireProfile();
  const store = await readStore();

  const myThreadIds = store.thread_participants
    .filter((p) => p.profile_id === me.id)
    .map((p) => p.thread_id);

  const threads = store.message_threads
    .filter((t) => myThreadIds.includes(t.id))
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .map((thread) => {
      const otherId = store.thread_participants.find(
        (p) => p.thread_id === thread.id && p.profile_id !== me.id,
      )?.profile_id;
      const other = store.profiles.find((p) => p.id === otherId);
      const lastMessage = store.messages
        .filter((m) => m.thread_id === thread.id)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0];
      return { thread, other, lastMessage };
    });

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="section-title">Messages</h1>
        <p className="mt-2 text-[var(--muted)]">
          Chat with your accepted connections.
        </p>
      </div>

      {threads.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          description="Connect with someone, then start a message from their profile or your network."
          action={
            <Link href="/network" className="btn-primary">
              Open network
            </Link>
          }
        />
      ) : (
        <div className="panel divide-y divide-[var(--line)]">
          {threads.map(({ thread, other, lastMessage }) => (
            <Link
              key={thread.id}
              href={`/messages/${thread.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 transition-colors"
            >
              <Avatar
                name={other?.full_name || "Member"}
                src={other?.avatar_url}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold truncate">
                    {other?.full_name || "Member"}
                  </div>
                  {lastMessage && (
                    <div className="text-xs text-[var(--muted)] shrink-0">
                      {formatDistanceToNow(new Date(lastMessage.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  )}
                </div>
                <p className="truncate text-sm text-[var(--muted)]">
                  {lastMessage?.body || "No messages yet"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}

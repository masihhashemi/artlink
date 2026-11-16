import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { AppShell } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { requireProfile } from "@/lib/auth";
import { readStore } from "@/lib/demo/store";
import { sendMessage } from "@/lib/actions/messages";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const me = await requireProfile();
  const store = await readStore();

  const isParticipant = store.thread_participants.some(
    (p) => p.thread_id === threadId && p.profile_id === me.id,
  );
  if (!isParticipant) notFound();

  const otherId = store.thread_participants.find(
    (p) => p.thread_id === threadId && p.profile_id !== me.id,
  )?.profile_id;
  const other = store.profiles.find((p) => p.id === otherId);

  const messages = store.messages
    .filter((m) => m.thread_id === threadId)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link href="/messages" className="text-sm text-[var(--muted)]">
          ← All messages
        </Link>

        <div className="mt-4 mb-6 flex items-center gap-3">
          <Avatar
            name={other?.full_name || "Member"}
            src={other?.avatar_url}
          />
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl">
              {other?.full_name || "Conversation"}
            </h1>
            <p className="text-sm text-[var(--muted)]">{other?.headline}</p>
          </div>
        </div>

        <div className="panel mb-4 max-h-[55vh] space-y-3 overflow-y-auto p-4 md:p-6">
          {messages.map((message) => {
            const mine = message.sender_id === me.id;
            return (
              <div
                key={message.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                    mine
                      ? "bg-[var(--accent)] text-white"
                      : "bg-white border border-[var(--line)]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.body}</p>
                  <div
                    className={`mt-1 text-[10px] ${
                      mine ? "text-white/70" : "text-[var(--muted)]"
                    }`}
                  >
                    {format(new Date(message.created_at), "MMM d · h:mm a")}
                  </div>
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <p className="text-sm text-[var(--muted)] text-center py-8">
              Say hello and start collaborating.
            </p>
          )}
        </div>

        <form action={sendMessage} className="panel flex gap-3 p-4">
          <input type="hidden" name="thread_id" value={threadId} />
          <input
            name="body"
            required
            className="input"
            placeholder="Write a message..."
            autoComplete="off"
          />
          <button type="submit" className="btn-primary shrink-0">
            Send
          </button>
        </form>
      </div>
    </AppShell>
  );
}

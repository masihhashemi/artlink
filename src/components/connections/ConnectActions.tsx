import { respondToConnection, sendConnectionRequest } from "@/lib/actions/connections";
import { startOrOpenThread } from "@/lib/actions/messages";
import type { Connection } from "@/lib/types";

type ConnectActionsProps = {
  viewerId: string;
  profileId: string;
  connection?: Connection | null;
  compact?: boolean;
};

export function ConnectActions({
  viewerId,
  profileId,
  connection,
  compact = false,
}: ConnectActionsProps) {
  const btn = compact ? "btn-primary text-sm" : "btn-primary";
  const btnSecondary = compact ? "btn-secondary text-sm" : "btn-secondary";

  if (!connection) {
    return (
      <form action={sendConnectionRequest}>
        <input type="hidden" name="recipient_id" value={profileId} />
        <button type="submit" className={btn}>
          Connect
        </button>
      </form>
    );
  }

  if (connection.status === "accepted") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="sticker bg-[var(--mint)]">Connected ✓</span>
        <form action={startOrOpenThread}>
          <input type="hidden" name="other_id" value={profileId} />
          <button type="submit" className={btn}>
            Message
          </button>
        </form>
      </div>
    );
  }

  if (connection.status === "rejected") {
    return (
      <form action={sendConnectionRequest}>
        <input type="hidden" name="recipient_id" value={profileId} />
        <button type="submit" className={btnSecondary}>
          Connect again
        </button>
      </form>
    );
  }

  // pending
  const iAmRecipient = connection.recipient_id === viewerId;
  const iAmRequester = connection.requester_id === viewerId;

  if (iAmRecipient) {
    return (
      <div className="flex flex-col gap-2">
        <span className="sticker bg-[var(--sun)]">Wants to connect</span>
        <div className="flex flex-wrap gap-2">
          <form action={respondToConnection}>
            <input type="hidden" name="connection_id" value={connection.id} />
            <input type="hidden" name="decision" value="accepted" />
            <button type="submit" className={btn}>
              Accept
            </button>
          </form>
          <form action={respondToConnection}>
            <input type="hidden" name="connection_id" value={connection.id} />
            <input type="hidden" name="decision" value="rejected" />
            <button type="submit" className={btnSecondary}>
              Decline
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (iAmRequester) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="sticker bg-[var(--sky)] text-sm"
      >
        Request sent · pending
      </div>
    );
  }

  return null;
}

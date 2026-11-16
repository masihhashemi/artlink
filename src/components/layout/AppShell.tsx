import { requireProfile } from "@/lib/auth";
import {
  getPendingIncomingConnectionCount,
  getUnreadNotificationCount,
} from "@/lib/queries";
import { AppNav } from "@/components/layout/AppNav";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  const [unreadCount, pendingConnections] = await Promise.all([
    getUnreadNotificationCount(profile.id),
    getPendingIncomingConnectionCount(profile.id),
  ]);

  return (
    <div className="min-h-screen">
      <AppNav
        profile={profile}
        unreadCount={unreadCount}
        pendingConnections={pendingConnections}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

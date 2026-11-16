import Link from "next/link";
import {
  Bell,
  Compass,
  Home,
  MessageCircle,
  Users,
  UserRound,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { Avatar } from "@/components/ui/Avatar";
import type { Profile } from "@/lib/types";

const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/network", label: "Network", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/notifications", label: "Alerts", icon: Bell },
];

export function AppNav({
  profile,
  unreadCount,
  pendingConnections = 0,
}: {
  profile: Profile;
  unreadCount: number;
  pendingConnections?: number;
}) {
  return (
    <header className="sticky top-0 z-40 mx-2 mt-2 nav-shell md:mx-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/home"
          className="brand-mark font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight"
        >
          Art <span className="text-[var(--accent)]">Link</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-[var(--ink-soft)] hover:bg-[var(--sun)] transition-colors"
            >
              <Icon size={16} />
              {label}
              {href === "/notifications" && unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--accent)] px-1 text-[10px] font-extrabold text-white">
                  {unreadCount}
                </span>
              )}
              {href === "/network" && pendingConnections > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--sun)] px-1 text-[10px] font-extrabold text-[var(--ink)]">
                  {pendingConnections}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${profile.id}`}
            className="flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-white py-1 pl-1 pr-3 shadow-[2px_2px_0_var(--ink)]"
          >
            <Avatar name={profile.full_name} src={profile.avatar_url} size="sm" />
            <span className="hidden sm:inline text-sm font-bold">
              {profile.full_name.split(" ")[0]}
            </span>
          </Link>
          <Link
            href="/profile/edit"
            className="hidden sm:inline-flex rounded-full border-2 border-[var(--ink)] bg-[var(--mint)] p-2 shadow-[2px_2px_0_var(--ink)]"
            title="Edit profile"
          >
            <UserRound size={16} />
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)]"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <nav className="flex md:hidden overflow-x-auto border-t-2 border-[var(--ink)] px-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="relative flex flex-1 flex-col items-center gap-1 px-2 py-2 text-[11px] font-bold text-[var(--ink-soft)]"
          >
            <Icon size={16} />
            {label}
            {href === "/notifications" && unreadCount > 0 && (
              <span className="absolute right-2 top-1 h-2.5 w-2.5 rounded-full border border-[var(--ink)] bg-[var(--accent)]" />
            )}
            {href === "/network" && pendingConnections > 0 && (
              <span className="absolute right-2 top-1 h-2.5 w-2.5 rounded-full border border-[var(--ink)] bg-[var(--sun)]" />
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
}

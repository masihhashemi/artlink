import Link from "next/link";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-8 brand-mark font-[family-name:var(--font-display)] text-3xl"
      >
        Art <span className="text-[var(--accent)]">Link</span>
      </Link>
      <div className="panel p-6 md:p-8">
        <h1 className="section-title mb-2">Sign in</h1>
        <p className="mb-6 text-[var(--muted)]">
          Welcome back. Try a demo account below.
        </p>
        <form action={signIn} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="maya@artlink.demo"
              defaultValue="maya@artlink.demo"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              defaultValue="demo1234"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>
        <p className="mt-6 text-sm text-[var(--muted)]">
          No account?{" "}
          <Link href="/signup" className="text-[var(--accent)] font-semibold">
            Join Art Link
          </Link>
        </p>
      </div>
    </div>
  );
}

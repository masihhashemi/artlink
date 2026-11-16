import Link from "next/link";
import { signUp } from "@/lib/actions/auth";

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-8 brand-mark font-[family-name:var(--font-display)] text-3xl"
      >
        Art <span className="text-[var(--accent)]">Link</span>
      </Link>
      <div className="panel p-6 md:p-8">
        <h1 className="section-title mb-2">Create your profile</h1>
        <p className="mb-6 text-[var(--muted)]">
          Join the network for art alumni collaborators.
        </p>
        <form action={signUp} className="space-y-4">
          <div>
            <label className="label" htmlFor="full_name">
              Full name
            </label>
            <input id="full_name" name="full_name" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required className="input" />
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
              minLength={6}
              className="input"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Continue
          </button>
        </form>
        <p className="mt-6 text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent)] font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

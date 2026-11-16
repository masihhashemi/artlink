import Link from "next/link";
import { getSessionUserId } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const userId = await getSessionUserId();
  if (userId) redirect("/home");

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="art-blob pink absolute left-[-40px] top-24 h-40 w-40" />
      <div className="art-blob mint absolute right-10 top-16 h-32 w-32" />
      <div className="art-blob sun absolute bottom-24 left-1/4 h-36 w-36" />
      <div className="art-blob sky absolute right-[-20px] bottom-10 h-44 w-44" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div className="brand-mark font-[family-name:var(--font-display)] text-3xl font-extrabold">
          Art <span className="text-[var(--accent)]">Link</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-extrabold">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            Join the studio
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pt-14">
        <div>
          <span className="sticker bg-[var(--mint)] fade-up mb-5">
            ✦ for art alumni
          </span>
          <h1 className="fade-up brand-mark font-[family-name:var(--font-display)] text-[clamp(3.2rem,9vw,6rem)] leading-[0.9] font-extrabold tracking-[-0.06em]">
            Art <span className="text-[var(--accent)]">Link</span>
          </h1>
          <p className="fade-up-delay mt-6 max-w-xl text-lg text-[var(--ink-soft)] leading-relaxed font-semibold">
            A playful studio network where alumni show their skills, post what
            they&apos;re hunting for, and get matched with collaborators.
          </p>
          <div className="fade-up-delay-2 mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">
              Make your card
            </Link>
            <Link href="/login" className="btn-secondary">
              Try a demo profile
            </Link>
          </div>
          <p className="mt-6 text-sm font-bold text-[var(--muted)]">
            Demo: maya@artlink.demo / demo1234
          </p>
        </div>

        <div className="fade-up-delay relative">
          <div className="person-card rotate-1">
            <div className="person-card-banner alt-2" />
            <div className="p-6">
              <div className="mb-4 text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--muted)]">
                Sample alumni card
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight">
                Meet your next collaborator
              </h2>
              <p className="mt-3 text-[var(--ink-soft)] font-semibold">
                Videographers, writers, designers, and more — rounded cards,
                sticker skills, and a feed that feels like a studio wall.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="skill-chip">Videographer</span>
                <span className="skill-chip">Writer</span>
                <span className="skill-chip">Designer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

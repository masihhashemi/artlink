import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { getAllSkills } from "@/lib/queries";
import { completeOnboarding } from "@/lib/actions/profile";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { SkillPicker } from "@/components/ui/SkillPicker";

export default async function OnboardingPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.onboarded) redirect("/home");
  const skills = await getAllSkills();

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-12">
      <div className="art-blob pink absolute -left-10 top-8 h-28 w-28 opacity-50" />
      <div className="art-blob sun absolute -right-6 top-24 h-24 w-24 opacity-60" />
      <div className="relative mb-8">
        <div className="brand-mark font-[family-name:var(--font-display)] text-3xl font-extrabold">
          Art <span className="text-[var(--accent)]">Link</span>
        </div>
        <span className="sticker bg-[var(--mint)] mt-4 inline-flex">
          ✦ build your card
        </span>
        <h1 className="section-title mt-4">Set up your profile</h1>
        <p className="mt-2 text-[var(--muted)] font-semibold">
          Tell alumni who you are and what you bring to a collaboration.
        </p>
      </div>

      <form action={completeOnboarding} className="panel space-y-5 p-6 md:p-8">
        <ImageUploader name="avatar_data_url" label="Profile picture" />
        <div>
          <label className="label" htmlFor="full_name">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            className="input"
            defaultValue={profile.full_name}
          />
        </div>
        <div>
          <label className="label" htmlFor="headline">
            Headline
          </label>
          <input
            id="headline"
            name="headline"
            className="input"
            placeholder="Documentary videographer & editor"
          />
        </div>
        <div>
          <label className="label" htmlFor="university">
            University / school
          </label>
          <input
            id="university"
            name="university"
            className="input"
            placeholder="Rhode Island School of Design"
          />
        </div>
        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="textarea"
            placeholder="Who you are, what you make, who you want to collaborate with..."
          />
        </div>
        <div>
          <div className="label">Skills</div>
          <SkillPicker skills={skills} />
        </div>
        <button type="submit" className="btn-primary w-full">
          Enter Art Link
        </button>
      </form>
    </div>
  );
}

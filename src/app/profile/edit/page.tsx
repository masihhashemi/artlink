import { AppShell } from "@/components/layout/AppShell";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { SkillPicker } from "@/components/ui/SkillPicker";
import { requireProfile } from "@/lib/auth";
import { getAllSkills, getProfileById } from "@/lib/queries";
import {
  addEducation,
  addExperience,
  addPortfolioImage,
  deleteEducation,
  deleteExperience,
  deletePortfolioImage,
  updateProfileBasics,
} from "@/lib/actions/profile";

export default async function EditProfilePage() {
  const me = await requireProfile();
  const [profile, skills] = await Promise.all([
    getProfileById(me.id),
    getAllSkills(),
  ]);
  if (!profile) return null;

  const selected = new Set(profile.skills.map((s) => s.id));

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="section-title">Edit profile</h1>
          <p className="mt-2 text-[var(--muted)]">
            Update your picture, description, education, skills, experience, and
            portfolio.
          </p>
        </div>

        <form action={updateProfileBasics} className="panel space-y-5 p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Basics
          </h2>
          <ImageUploader
            name="avatar_data_url"
            label="Profile picture"
            currentUrl={profile.avatar_url}
          />
          <div>
            <label className="label" htmlFor="full_name">
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              className="input"
              defaultValue={profile.full_name}
              required
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
              defaultValue={profile.headline}
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
              defaultValue={profile.description}
            />
          </div>
          <div>
            <div className="label">Skills</div>
            <SkillPicker
              skills={skills}
              selectedIds={[...selected]}
            />
          </div>
          <button type="submit" className="btn-primary">
            Save basics
          </button>
        </form>

        <section className="panel p-6 space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Education / university
          </h2>
          {profile.education.map((edu) => (
            <div
              key={edu.id}
              className="flex items-start justify-between gap-3 border-t border-[var(--line)] pt-3"
            >
              <div>
                <div className="font-semibold">{edu.university}</div>
                <div className="text-sm text-[var(--muted)]">
                  {[edu.degree_or_program, edu.field_of_study]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
              <form action={deleteEducation}>
                <input type="hidden" name="id" value={edu.id} />
                <button type="submit" className="text-sm text-[var(--danger)]">
                  Remove
                </button>
              </form>
            </div>
          ))}
          <form action={addEducation} className="space-y-3 border-t border-[var(--line)] pt-4">
            <input
              name="university"
              required
              className="input"
              placeholder="University"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="degree_or_program"
                className="input"
                placeholder="Degree / program"
              />
              <input
                name="field_of_study"
                className="input"
                placeholder="Field of study"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="start_date" type="date" className="input" />
              <input name="end_date" type="date" className="input" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_current" /> Currently studying
            </label>
            <textarea
              name="description"
              className="textarea min-h-[80px]"
              placeholder="Notes"
            />
            <button type="submit" className="btn-secondary">
              Add education
            </button>
          </form>
        </section>

        <section className="panel p-6 space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Experience
          </h2>
          {profile.experiences.map((exp) => (
            <div
              key={exp.id}
              className="flex items-start justify-between gap-3 border-t border-[var(--line)] pt-3"
            >
              <div>
                <div className="font-semibold">{exp.title}</div>
                <div className="text-sm text-[var(--muted)]">
                  {exp.organization}
                </div>
              </div>
              <form action={deleteExperience}>
                <input type="hidden" name="id" value={exp.id} />
                <button type="submit" className="text-sm text-[var(--danger)]">
                  Remove
                </button>
              </form>
            </div>
          ))}
          <form action={addExperience} className="space-y-3 border-t border-[var(--line)] pt-4">
            <input name="title" required className="input" placeholder="Title" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="organization"
                className="input"
                placeholder="Organization"
              />
              <input name="location" className="input" placeholder="Location" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="start_date" type="date" className="input" />
              <input name="end_date" type="date" className="input" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_current" /> Current role
            </label>
            <textarea
              name="description"
              className="textarea min-h-[80px]"
              placeholder="What you did"
            />
            <button type="submit" className="btn-secondary">
              Add experience
            </button>
          </form>
        </section>

        <section className="panel p-6 space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Portfolio pics
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {profile.portfolio_images.map((image) => (
              <div key={image.id} className="border border-[var(--line)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.image_url}
                  alt={image.caption || "Portfolio"}
                  className="aspect-square w-full object-cover"
                />
                <form action={deletePortfolioImage} className="p-2">
                  <input type="hidden" name="id" value={image.id} />
                  <button type="submit" className="text-xs text-[var(--danger)]">
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
          <form action={addPortfolioImage} className="space-y-3 border-t border-[var(--line)] pt-4">
            <ImageUploader name="image_data_url" label="Upload portfolio image" />
            <input name="caption" className="input" placeholder="Caption" />
            <button type="submit" className="btn-secondary">
              Add image
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}

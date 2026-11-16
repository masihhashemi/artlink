import { AppShell } from "@/components/layout/AppShell";
import { SkillPicker } from "@/components/ui/SkillPicker";
import { createPost } from "@/lib/actions/posts";
import { getAllSkills } from "@/lib/queries";

export default async function NewPostPage() {
  const skills = await getAllSkills();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <span className="sticker bg-[var(--accent-soft)] text-[var(--accent-deep)] mb-3">
          New post
        </span>
        <h1 className="section-title mb-2">Create a post</h1>
        <p className="mb-6 text-[var(--muted)] font-medium">
          Tell the network what you need — or what you can offer.
        </p>
        <form action={createPost} className="panel space-y-5 p-6 md:p-8">
          <div>
            <label className="label" htmlFor="type">
              Post type
            </label>
            <select
              id="type"
              name="type"
              className="input"
              defaultValue="looking_for"
            >
              <option value="looking_for">Looking for someone</option>
              <option value="offering">Offering skills / seeking project</option>
              <option value="update">General update</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="body">
              What are you posting?
            </label>
            <textarea
              id="body"
              name="body"
              required
              className="textarea"
              placeholder="Looking for a writer for a short alumni documentary..."
            />
          </div>
          <div>
            <div className="label">Related skills</div>
            <SkillPicker skills={skills} />
          </div>
          <button type="submit" className="btn-primary w-full">
            Publish
          </button>
        </form>
      </div>
    </AppShell>
  );
}

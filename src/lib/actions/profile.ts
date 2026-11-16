"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/auth";
import { uid, updateStore } from "@/lib/demo/store";
import { parseCustomSkills, resolveSkillIds } from "@/lib/skills";

export async function completeOnboarding(formData: FormData) {
  const userId = await requireUserId();
  const fullName = String(formData.get("full_name") || "").trim();
  const headline = String(formData.get("headline") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const university = String(formData.get("university") || "").trim();
  const skillIds = formData.getAll("skill_ids").map(String);
  const customSkills = parseCustomSkills(formData);
  const avatarDataUrl = String(formData.get("avatar_data_url") || "").trim();

  if (!fullName) throw new Error("Name is required.");

  await updateStore((store) => {
    const profile = store.profiles.find((p) => p.id === userId);
    if (!profile) return;
    profile.full_name = fullName;
    profile.headline = headline;
    profile.description = description;
    profile.onboarded = true;
    profile.updated_at = new Date().toISOString();
    if (avatarDataUrl) profile.avatar_url = avatarDataUrl;

    const resolved = resolveSkillIds(store, skillIds, customSkills);
    store.profile_skills = store.profile_skills.filter(
      (ps) => ps.profile_id !== userId,
    );
    for (const skillId of resolved) {
      store.profile_skills.push({ profile_id: userId, skill_id: skillId });
    }

    if (university) {
      store.education = store.education.filter((e) => e.profile_id !== userId);
      store.education.push({
        id: uid("edu"),
        profile_id: userId,
        university,
        degree_or_program: "",
        field_of_study: "",
        start_date: null,
        end_date: null,
        is_current: false,
        description: "",
        sort_order: 0,
      });
    }
  });

  redirect("/home");
}

export async function updateProfileBasics(formData: FormData) {
  const userId = await requireUserId();
  const fullName = String(formData.get("full_name") || "").trim();
  const headline = String(formData.get("headline") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const skillIds = formData.getAll("skill_ids").map(String);
  const customSkills = parseCustomSkills(formData);
  const avatarDataUrl = String(formData.get("avatar_data_url") || "").trim();

  await updateStore((store) => {
    const profile = store.profiles.find((p) => p.id === userId);
    if (!profile) return;
    profile.full_name = fullName;
    profile.headline = headline;
    profile.description = description;
    profile.updated_at = new Date().toISOString();
    if (avatarDataUrl) profile.avatar_url = avatarDataUrl;

    const resolved = resolveSkillIds(store, skillIds, customSkills);
    store.profile_skills = store.profile_skills.filter(
      (ps) => ps.profile_id !== userId,
    );
    for (const skillId of resolved) {
      store.profile_skills.push({ profile_id: userId, skill_id: skillId });
    }
  });

  revalidatePath(`/profile/${userId}`);
  revalidatePath("/profile/edit");
}

export async function addEducation(formData: FormData) {
  const userId = await requireUserId();
  await updateStore((store) => {
    store.education.push({
      id: uid("edu"),
      profile_id: userId,
      university: String(formData.get("university") || "").trim(),
      degree_or_program: String(formData.get("degree_or_program") || "").trim(),
      field_of_study: String(formData.get("field_of_study") || "").trim(),
      start_date: String(formData.get("start_date") || "") || null,
      end_date: String(formData.get("end_date") || "") || null,
      is_current: formData.get("is_current") === "on",
      description: String(formData.get("description") || "").trim(),
      sort_order: store.education.filter((e) => e.profile_id === userId).length,
    });
  });
  revalidatePath("/profile/edit");
  revalidatePath(`/profile/${userId}`);
}

export async function deleteEducation(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id") || "");
  await updateStore((store) => {
    store.education = store.education.filter(
      (e) => !(e.id === id && e.profile_id === userId),
    );
  });
  revalidatePath("/profile/edit");
  revalidatePath(`/profile/${userId}`);
}

export async function addExperience(formData: FormData) {
  const userId = await requireUserId();
  await updateStore((store) => {
    store.experiences.push({
      id: uid("exp"),
      profile_id: userId,
      title: String(formData.get("title") || "").trim(),
      organization: String(formData.get("organization") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      start_date: String(formData.get("start_date") || "") || null,
      end_date: String(formData.get("end_date") || "") || null,
      is_current: formData.get("is_current") === "on",
      description: String(formData.get("description") || "").trim(),
      sort_order: store.experiences.filter((e) => e.profile_id === userId)
        .length,
    });
  });
  revalidatePath("/profile/edit");
  revalidatePath(`/profile/${userId}`);
}

export async function deleteExperience(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id") || "");
  await updateStore((store) => {
    store.experiences = store.experiences.filter(
      (e) => !(e.id === id && e.profile_id === userId),
    );
  });
  revalidatePath("/profile/edit");
  revalidatePath(`/profile/${userId}`);
}

export async function addPortfolioImage(formData: FormData) {
  const userId = await requireUserId();
  const imageUrl = String(formData.get("image_data_url") || "").trim();
  const caption = String(formData.get("caption") || "").trim();
  if (!imageUrl) throw new Error("Image required.");

  await updateStore((store) => {
    store.portfolio_images.push({
      id: uid("port"),
      profile_id: userId,
      image_url: imageUrl,
      caption,
      sort_order: store.portfolio_images.filter((p) => p.profile_id === userId)
        .length,
    });
  });
  revalidatePath("/profile/edit");
  revalidatePath(`/profile/${userId}`);
}

export async function deletePortfolioImage(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id") || "");
  await updateStore((store) => {
    store.portfolio_images = store.portfolio_images.filter(
      (p) => !(p.id === id && p.profile_id === userId),
    );
  });
  revalidatePath("/profile/edit");
  revalidatePath(`/profile/${userId}`);
}

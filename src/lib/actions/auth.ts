"use server";

import { redirect } from "next/navigation";
import { clearSession, setSession } from "@/lib/auth";
import { uid, updateStore } from "@/lib/demo/store";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();

  if (!email || !password || password.length < 6 || !fullName) {
    throw new Error("Please fill all fields (password min 6 characters).");
  }

  let userId = "";
  let error: string | null = null;

  await updateStore((store) => {
    if (store.users.some((u) => u.email === email)) {
      error = "An account with that email already exists.";
      return;
    }
    userId = uid("user");
    const now = new Date().toISOString();
    store.users.push({
      id: userId,
      email,
      password,
      full_name: fullName,
    });
    store.profiles.push({
      id: userId,
      full_name: fullName,
      headline: "",
      description: "",
      avatar_url: null,
      onboarded: false,
      created_at: now,
      updated_at: now,
    });
  });

  if (error) throw new Error(error);
  await setSession(userId);
  redirect("/onboarding");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  let userId = "";
  let error: string | null = null;

  await updateStore((store) => {
    const user = store.users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      error = "Invalid email or password.";
      return;
    }
    userId = user.id;
  });

  if (error) throw new Error(error);
  await setSession(userId);

  const { readStore } = await import("@/lib/demo/store");
  const store = await readStore();
  const profile = store.profiles.find((p) => p.id === userId);
  redirect(profile?.onboarded ? "/home" : "/onboarding");
}

export async function signOut() {
  await clearSession();
  redirect("/");
}

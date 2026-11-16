"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth";
import { updateStore } from "@/lib/demo/store";

export async function markNotificationRead(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id") || "");
  await updateStore((store) => {
    const n = store.notifications.find(
      (x) => x.id === id && x.user_id === userId,
    );
    if (n) n.read = true;
  });
  revalidatePath("/notifications");
}

export async function markAllNotificationsRead() {
  const userId = await requireUserId();
  await updateStore((store) => {
    for (const n of store.notifications) {
      if (n.user_id === userId) n.read = true;
    }
  });
  revalidatePath("/notifications");
}

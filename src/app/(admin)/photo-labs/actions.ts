"use server";

import { revalidatePath } from "next/cache";
import { apiJson } from "@/lib/api";

export interface SeedResult {
  inserted: number;
  updated: number;
  skipped: number;
  total: number;
}

export async function seedPhotoLabsAction(): Promise<{ data?: SeedResult; error?: string }> {
  try {
    const data = await apiJson<SeedResult>("/admin/photo-labs/seed", {
      method: "POST",
    });
    revalidatePath("/photo-labs");
    return { data };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function updatePhotoLabStatusAction(
  id: number,
  status: "ACTIVE" | "INACTIVE"
): Promise<{ error?: string }> {
  try {
    await apiJson(`/admin/photo-labs/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    revalidatePath("/photo-labs");
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}

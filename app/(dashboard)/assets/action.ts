"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { asset_status } from "@prisma/client";

export async function createAsset(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "IT_SUPPORT")) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const serialNumber = formData.get("serialNumber") as string;
  const status = formData.get("status") as asset_status;
  const assignedToId = formData.get("assignedToId") as string | null;

  await db.asset.create({
    data: {
      name,
      serialNumber,
      status,
      assignedToId: assignedToId || null,
    },
  });

  revalidatePath("/assets");
  redirect("/assets");
}

export async function updateAsset(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "IT_SUPPORT")) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const serialNumber = formData.get("serialNumber") as string;
  const status = formData.get("status") as asset_status;
  const assignedToId = formData.get("assignedToId") as string | null;

  await db.asset.update({
    where: { id },
    data: {
      name,
      serialNumber,
      status,
      assignedToId: assignedToId || null,
    },
  });

  revalidatePath("/assets");
  revalidatePath(`/assets/${id}`);
}

export async function deleteAsset(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.asset.delete({
    where: { id },
  });

  revalidatePath("/assets");
}

export async function updateAssetName(id: string, name: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "IT_SUPPORT")) {
    throw new Error("Unauthorized");
  }

  await db.asset.update({
    where: { id },
    data: { name },
  });

  revalidatePath("/assets");
}

export async function deleteMultipleAssets(ids: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.asset.deleteMany({
    where: { id: { in: ids } },
  });

  revalidatePath("/assets");
}

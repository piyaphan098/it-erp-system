"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  const dataToUpdate: any = { name };

  if (password && password.length >= 6) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  await db.user.update({
    where: { id: session.user.id },
    data: dataToUpdate,
  });

  revalidatePath("/settings");
}

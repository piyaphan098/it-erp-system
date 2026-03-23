"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { user_role } from "@prisma/client";
import bcrypt from "bcrypt";

export async function updateUserRole(userId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const role = formData.get("role") as user_role;

  // Prevent changing own role
  if (session.user.id === userId) {
    throw new Error("Cannot change your own role");
  }

  await db.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/users");
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Prevent self-deletion
  if (session.user.id === userId) {
    throw new Error("Cannot delete your own account");
  }

  await db.user.delete({
    where: { id: userId },
  });

  revalidatePath("/users");
}

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as user_role;

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      role,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/users");
}

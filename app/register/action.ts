"use server";

import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import mysql from "mysql2/promise";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Missing required fields" };
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        id: crypto.randomUUID(), // Explicitly providing id using Web Crypto API
        name,
        email,
        password: hashedPassword,
        role: "USER", // Default role
        updatedAt: new Date(),
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return { error: `Failed to create user: ${error.message || error}` };
  }

  redirect("/login");
}

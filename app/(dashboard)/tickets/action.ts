"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
type ticket_priority = "LOW" | "MEDIUM" | "HIGH";
type ticket_status = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export async function createTicket(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as ticket_priority;

  await db.ticket.create({
    data: {
      title,
      description,
      priority,
      status: "OPEN",
      createdById: session.user.id as string,
    },
  });

  revalidatePath("/tickets");
  redirect("/tickets");
}

export async function updateTicket(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as ticket_priority;
  const status = formData.get("status") as ticket_status;
  const assignedToId = formData.get("assignedToId") as string | null;

  await db.ticket.update({
    where: { id },
    data: {
      title,
      description,
      priority,
      status,
      assignedToId: assignedToId || null,
    },
  });

  revalidatePath("/tickets");
  revalidatePath(`/tickets/${id}`);
}

export async function deleteTicket(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await db.ticket.delete({
    where: { id },
  });

  revalidatePath("/tickets");
}

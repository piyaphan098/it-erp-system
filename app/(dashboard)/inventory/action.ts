"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addInventoryItem(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "IT_SUPPORT")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string | null;
    const unit = formData.get("unit") as string | null;
    const location = formData.get("location") as string | null;
    const quantity = parseInt(formData.get("quantity") as string) || 0;
    const minQuantity = parseInt(formData.get("minQuantity") as string) || 0;

    await db.inventory_item.create({
      data: { name, category, brand, unit, quantity, minQuantity, location }
    });

    revalidatePath("/inventory");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function addStock(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "IT_SUPPORT")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const itemId = formData.get("itemId") as string;
    const quantityToAdd = parseInt(formData.get("quantity") as string);
    const reason = formData.get("reason") as string;

    if (quantityToAdd <= 0) throw new Error("Quantity must be greater than 0");

    await db.$transaction(async (tx) => {
      await tx.inventory_item.update({
        where: { id: itemId },
        data: { quantity: { increment: quantityToAdd } }
      });

      await tx.inventory_transaction.create({
        data: {
          inventoryItemId: itemId,
          type: "IN",
          quantity: quantityToAdd,
          reason,
          createdById: session.user.id
        }
      });
    });

    revalidatePath("/inventory");
    revalidatePath("/inventory/transactions");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function issueItem(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "IT_SUPPORT")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const itemId = formData.get("itemId") as string;
    const quantityToIssue = parseInt(formData.get("quantity") as string);
    const requestedBy = formData.get("requestedBy") as string;
    const reason = formData.get("reason") as string;
    const relatedAssetId = formData.get("relatedAssetId") as string | null;
    const relatedTicketId = formData.get("relatedTicketId") as string | null;

    if (quantityToIssue <= 0) throw new Error("Invalid quantity");

    await db.$transaction(async (tx) => {
      const item = await tx.inventory_item.findUnique({ where: { id: itemId } });
      if (!item || item.quantity < quantityToIssue) {
        throw new Error(`Insufficient stock. Only ${item?.quantity || 0} available.`);
      }

      await tx.inventory_item.update({
        where: { id: itemId },
        data: { quantity: { decrement: quantityToIssue } }
      });

      await tx.inventory_transaction.create({
        data: {
          inventoryItemId: itemId,
          type: "OUT",
          quantity: quantityToIssue,
          reason,
          requestedBy,
          relatedAssetId: relatedAssetId || null,
          relatedTicketId: relatedTicketId || null,
          createdById: session.user.id
        }
      });
    });

    revalidatePath("/inventory");
    revalidatePath("/inventory/transactions");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

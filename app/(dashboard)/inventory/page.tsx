import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import InventoryManager from "@/components/InventoryManager";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const session = await getServerSession(authOptions);
  const isAdminOrSupport = session?.user.role === "ADMIN" || session?.user.role === "IT_SUPPORT";

  const items = await db.inventory_item.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <InventoryManager items={items} isAdminOrSupport={isAdminOrSupport} />
  );
}

import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AssetList from "@/components/AssetList";

export const dynamic = "force-dynamic";

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const [paramsResolved, session] = await Promise.all([
    searchParams,
    getServerSession(authOptions)
  ]);
  
  const { q, status } = paramsResolved;
  const isAdminOrSupport = session?.user.role === "ADMIN" || session?.user.role === "IT_SUPPORT";

  const whereClause: any = {};
  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { serialNumber: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status && status !== "ALL") {
    whereClause.status = status;
  }

  const assets = await db.asset.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { assignedTo: true },
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Assets
        </h1>
        {isAdminOrSupport && (
          <div className="mt-4 sm:ml-4 sm:mt-0">
            <Link
              href="/assets/new"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Asset
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <form className="flex max-w-lg w-full items-center space-x-2">
            <div className="relative flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Search assets (name, serial)..."
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-colors"
              />
            </div>
            <select
              name="status"
              defaultValue={status || "ALL"}
              className="block rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-colors"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="IN_USE">In Use</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
            <button
              type="submit"
              className="rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Filter
            </button>
          </form>
        </div>
        <AssetList assets={assets} isAdminOrSupport={isAdminOrSupport} />
      </div>
    </div>
  );
}

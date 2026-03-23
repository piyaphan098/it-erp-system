import { db } from "@/lib/db";
import { ArrowDownRight, ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TransactionLogsPage() {
  const transactions = await db.inventory_transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      item: true,
      createdBy: true
    }
  });

  // Calculate monthly stats
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.createdAt);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear && tx.type === "OUT";
  });

  const issueSummary: Record<string, number> = {};
  currentMonthTransactions.forEach(tx => {
    const itemName = tx.item.name;
    issueSummary[itemName] = (issueSummary[itemName] || 0) + tx.quantity;
  });

  const topIssuedItems = Object.entries(issueSummary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Link href="/inventory" className="mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          Stock Transaction Logs
        </h1>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          This Month's Summary (Issues)
        </h2>
        {topIssuedItems.length === 0 ? (
          <p className="text-sm text-gray-500">No items issued this month.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topIssuedItems.map(([itemName, quantity]) => (
              <div key={itemName} className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-4 rounded-lg">
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">{itemName}</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {quantity} <span className="text-sm font-normal text-gray-500">issued</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-black uppercase">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Date</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Type</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Item</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Requested By / Reason</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Admin</th>
               </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1a1a1a] divide-y divide-gray-200 dark:divide-gray-800">
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-sm">No transactions recorded yet.</td>
                </tr>
              )}
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tx.type === "IN" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <ArrowDownRight className="w-3.5 h-3.5 mr-1" /> Stock In (+{tx.quantity})
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                        <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Issue (-{tx.quantity})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {tx.item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {tx.type === "OUT" ? (
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-300">{tx.requestedBy}</span><br/>
                        <span className="text-xs">{tx.reason}</span>
                      </div>
                    ) : (
                      <span className="text-xs">{tx.reason || "Restock"}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {tx.createdBy.name || tx.createdBy.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

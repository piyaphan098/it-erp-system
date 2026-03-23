import { db } from "@/lib/db";
import { Ticket, Monitor } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {

  const [
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    totalAssets,
    availableAssets,
    inUseAssets,
    maintenanceAssets
  ] = await Promise.all([
    db.ticket.count(),
    db.ticket.count({ where: { status: "OPEN" } }),
    db.ticket.count({ where: { status: "IN_PROGRESS" } }),
    db.ticket.count({ where: { status: "RESOLVED" } }),
    db.asset.count(),
    db.asset.count({ where: { status: "AVAILABLE" } }),
    db.asset.count({ where: { status: "IN_USE" } }),
    db.asset.count({ where: { status: "MAINTENANCE" } }),
  ]);

  const ticketStats = [
    { name: "Open", count: openTickets, color: "bg-amber-500" },
    { name: "In Progress", count: inProgressTickets, color: "bg-blue-500" },
    { name: "Resolved", count: resolvedTickets, color: "bg-green-500" },
  ];

  const assetStats = [
    { name: "Available", count: availableAssets, color: "bg-green-500" },
    { name: "In Use", count: inUseAssets, color: "bg-blue-500" },
    { name: "Maintenance", count: maintenanceAssets, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          System Reports
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Ticket Analytics */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Ticket className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Ticket Distribution</h2>
          </div>
          <div className="space-y-4">
            {ticketStats.map((stat) => (
              <div key={stat.name}>
                <div className="flex justify-between text-sm font-medium mb-1 dark:text-gray-300">
                  <span>{stat.name}</span>
                  <span>{stat.count} ({totalTickets > 0 ? Math.round((stat.count / totalTickets) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${stat.color}`} style={{ width: `${totalTickets > 0 ? (stat.count / totalTickets) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total lifetime tickets: {totalTickets}</p>
          </div>
        </div>

        {/* Asset Analytics */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Monitor className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Asset Usage</h2>
          </div>
          <div className="space-y-4">
            {assetStats.map((stat) => (
              <div key={stat.name}>
                <div className="flex justify-between text-sm font-medium mb-1 dark:text-gray-300">
                  <span>{stat.name}</span>
                  <span>{stat.count} ({totalAssets > 0 ? Math.round((stat.count / totalAssets) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${stat.color}`} style={{ width: `${totalAssets > 0 ? (stat.count / totalAssets) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total registered assets: {totalAssets}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

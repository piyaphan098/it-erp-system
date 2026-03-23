import { db } from "@/lib/db";
import { Suspense } from "react";
import { Ticket, Monitor, Users, CheckCircle2, AlertTriangle, Wrench } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import DashboardCharts from "@/components/DashboardCharts";
import ExportReportButton from "@/components/ExportReportButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdminOrSupport = session?.user.role === "ADMIN" || session?.user.role === "IT_SUPPORT";
  const dict = await getDictionary();

  const [ticketCounts, assetCounts] = await Promise.all([
    db.ticket.groupBy({ by: ["status"], _count: { status: true } }),
    db.asset.groupBy({ by: ["status"], _count: { status: true } })
  ]);
  
  const ticketsData = ticketCounts.map(t => ({ name: t.status, value: t._count.status }));
  const assetsData = assetCounts.map(a => ({ name: a.status, value: a._count.status }));

  const reportData = [
    ...ticketsData.map(t => ({ Category: "Ticket", Status: t.name, Total: t.value })),
    ...assetsData.map(a => ({ Category: "Asset", Status: a.name, Total: a.value }))
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          {dict.dashboard || "Dashboard Overview"}
        </h1>
        <div className="mt-4 sm:mt-0 flex">
          <ExportReportButton data={reportData} filename="IT_ERP_Dashboard_Summary" dict={dict} />
        </div>
      </div>

      <Suspense fallback={<DashboardCardsSkeleton />}>
        <DashboardCards />
      </Suspense>

      <DashboardCharts ticketsData={ticketsData} assetsData={assetsData} dict={dict} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{dict.recentTickets || "Recent Tickets"}</h2>
          <Suspense fallback={<p className="text-gray-500 dark:text-gray-400 text-sm">Loading tickets...</p>}>
            <RecentTickets />
          </Suspense>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{dict.systemAlerts || "System Alerts"}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{dict.systemOperatingNormally || "System operating normally."}</p>
        </div>
      </div>

      {isAdminOrSupport && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" /> {dict.lowStock || "Low Stock Consumables"}
            </h2>
            <Suspense fallback={<p className="text-gray-500 dark:text-gray-400 text-sm">Loading inventory...</p>}>
              <LowStockItems />
            </Suspense>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Wrench className="w-5 h-5 text-orange-500 mr-2" /> {dict.assetsMaintenance || "Assets in Maintenance"}
            </h2>
            <Suspense fallback={<p className="text-gray-500 dark:text-gray-400 text-sm">Loading assets...</p>}>
              <MaintenanceAssets />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

// Data fetching component
async function DashboardCards() {
  const dict = await getDictionary();
  const [openTickets, resolvedToday, totalAssets, activeUsers] = await Promise.all([
    db.ticket.count({ where: { status: "OPEN" } }),
    db.ticket.count({
      where: {
        status: "RESOLVED",
        updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    db.asset.count(),
    db.user.count(),
  ]);

  const cards = [
    { name: dict.openTickets || "Open Tickets", value: openTickets, icon: Ticket, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400" },
    { name: dict.resolvedToday || "Resolved Today", value: resolvedToday, icon: CheckCircle2, color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" },
    { name: dict.totalAssets || "Total Assets", value: totalAssets, icon: Monitor, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
    { name: dict.totalUsers || "Total Users", value: activeUsers, icon: Users, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 whitespace-nowrap">
      {cards.map((card) => (
        <div key={card.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${card.color}`}>
                <card.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{card.name}</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">{card.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-100 dark:border-gray-700 animate-pulse">
          <div className="p-5 flex items-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="ml-5 flex-1 space-y-2">
               <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
               <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function RecentTickets() {
  const dict = await getDictionary();
  const tickets = await db.ticket.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { createdBy: true, assignedTo: true },
  });

  if (tickets.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">{dict.noRecentTickets || "No recent tickets found."}</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{ticket.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  By {ticket.createdBy.name || ticket.createdBy.email}
                </p>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                  ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function LowStockItems() {
  const dict = await getDictionary();
  const allItems = await db.inventory_item.findMany({
    orderBy: { quantity: "asc" }
  });
  
  const lowStock = allItems.filter(item => item.quantity <= item.minQuantity).slice(0, 5);

  if (lowStock.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">{dict.allStockHealthy || "All inventory stocks are at healthy levels."}</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
        {lowStock.map((item) => (
          <li key={item.id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.category} • Location: {item.location || '-'}</p>
              </div>
              <div className="ml-4 flex-shrink-0 text-right">
                <p className="text-sm font-bold text-red-600 dark:text-red-400">{item.quantity} {item.unit || "pcs"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Min: {item.minQuantity}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function MaintenanceAssets() {
  const assets = await db.asset.findMany({
    where: { status: "MAINTENANCE" },
    take: 5,
    orderBy: { updatedAt: "desc" },
    include: { assignedTo: true }
  });

  if (assets.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No assets currently in maintenance.</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
        {assets.map((asset) => (
          <li key={asset.id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{asset.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SN: {asset.serialNumber}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                  {asset.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

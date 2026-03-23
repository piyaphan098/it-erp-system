"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Ticket, 
  Monitor, 
  Users, 
  Settings, 
  LogOut,
  Activity,
  Package
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar({ role, dict }: { role: string, dict: any }) {
  const pathname = usePathname();

  const navigation = [
    { name: dict.dashboard || "Dashboard", href: "/", icon: LayoutDashboard },
    { name: dict.tickets || "Tickets", href: "/tickets", icon: Ticket },
    { name: dict.assets || "Assets", href: "/assets", icon: Monitor },
    { name: dict.inventory || "Inventory", href: "/inventory", icon: Package },
    { name: dict.networkScan || "Network Scan", href: "/ipam", icon: Activity },
    ...(role === "ADMIN" ? [{ name: dict.users || "Users", href: "/users", icon: Users }] : []),
    { name: dict.settings || "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xl font-bold text-gray-900 dark:text-white">IT ERP</span>
      </div>
      <div className="flex-1 overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => signOut()}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-600 dark:text-red-400" />
          Logout
        </button>
      </div>
    </div>
  );
}

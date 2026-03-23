import { cookies } from "next/headers";

export const dictionaries = {
  en: {
    // Menu
    dashboard: "Dashboard Overview",
    tickets: "Tickets",
    assets: "Assets",
    inventory: "Inventory",
    networkScan: "Network Scan",
    ipam: "IPAM",
    users: "Users",
    settings: "Settings",

    // Dashboard
    openTickets: "Open Tickets",
    resolvedToday: "Resolved Today",
    totalAssets: "Total Assets",
    totalUsers: "Total Users",
    recentTickets: "Recent Tickets",
    systemAlerts: "System Alerts",
    systemOperatingNormally: "System operating normally.",
    noRecentTickets: "No recent tickets found.",
    lowStock: "Low Stock Consumables",
    allStockHealthy: "All inventory stocks are at healthy levels.",
    assetsMaintenance: "Assets in Maintenance",
    noAssetsMaintenance: "No assets currently in maintenance.",
    min: "Min",
  },
  th: {
    // Menu
    dashboard: "ภาพรวมระบบ",
    tickets: "แจ้งซ่อม",
    assets: "ทรัพย์สิน",
    inventory: "สต๊อกวัสดุ",
    networkScan: "สแกนเครือข่าย",
    ipam: "จัดการ IP",
    users: "ผู้ใช้งาน",
    settings: "ตั้งค่า",

    // Dashboard
    openTickets: "งานรอซ่อม",
    resolvedToday: "เสร็จสิ้นวันนี้",
    totalAssets: "ทรัพย์สินทั้งหมด",
    totalUsers: "ผู้ใช้ทั้งหมด",
    recentTickets: "แจ้งซ่อมล่าสุด",
    systemAlerts: "การแจ้งเตือนระบบ",
    systemOperatingNormally: "ระบบทำงานปกติ",
    noRecentTickets: "ไม่พบรายการแจ้งซ่อมล่าสุด",
    lowStock: "วัสดุใกล้หมดสต๊อก",
    allStockHealthy: "จำนวนสต๊อกวัสดุทุกรายการยังอยู่ในระดับปกติ",
    assetsMaintenance: "ทรัพย์สินรอซ่อม",
    noAssetsMaintenance: "ไม่มีทรัพย์สินที่อยู่ระหว่างการซ่อมบำรุง",
    min: "ขั้นต่ำ",
  }
};

export type Locale = "en" | "th";
export type Dictionary = typeof dictionaries.en;

export async function getDictionary(): Promise<Dictionary> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  return dictionaries[locale] || dictionaries.en;
}

export async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  return locale;
}

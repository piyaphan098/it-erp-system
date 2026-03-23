"use client";

import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions/locale";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();

  const handleLocaleChange = async (locale: "en" | "th") => {
    if (locale === currentLocale) return;
    await setLocale(locale);
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-1 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-md p-0.5 bg-gray-50 dark:bg-gray-900/50">
      <button 
        onClick={() => handleLocaleChange("en")} 
        className={`px-2 py-1 rounded transition-colors ${currentLocale === "en" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"}`}
      >
        EN
      </button>
      <button 
        onClick={() => handleLocaleChange("th")} 
        className={`px-2 py-1 rounded transition-colors ${currentLocale === "th" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"}`}
      >
        TH
      </button>
    </div>
  );
}

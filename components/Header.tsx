"use client";

import { User } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ 
  user,
  locale
}: { 
  user?: { name?: string | null; email?: string | null; role?: string },
  locale: string 
}) {
  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <LanguageSwitcher currentLocale={locale} />
          <div className="flex items-center p-1.5 gap-x-2">
            <span className="sr-only">Your profile</span>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-2 text-sm font-medium leading-6 text-gray-900 dark:text-white">
                {user?.name || user?.email || "User"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

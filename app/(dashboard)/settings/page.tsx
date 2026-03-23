import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateProfile } from "./action";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Settings
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg border border-gray-100 dark:border-gray-700">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Profile Information</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            <p>Update your account's profile information and email address.</p>
          </div>
          <form className="mt-5 sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row items-start" action={updateProfile}>
            <div className="w-full sm:max-w-xs">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={user.name || ""}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 sm:text-sm sm:leading-6 transition-colors"
                placeholder="John Doe"
              />
            </div>
            
            <div className="w-full sm:max-w-xs">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Email (Read-only)</label>
              <input
                type="email"
                disabled
                defaultValue={user.email}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="w-full sm:max-w-xs">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">New Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 sm:text-sm sm:leading-6 transition-colors"
                placeholder="Leave blank to keep current"
              />
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:mt-0 sm:w-auto transition-colors self-end"
            >
              Save Details
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg border border-gray-100 dark:border-gray-700">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">System Preferences</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            <p>Manage system notifications and appearance. (Theme uses system match via tailwind dark mode class).</p>
          </div>
          <div className="mt-5">
            <div className="flex items-center space-x-3">
              <input
                id="notifications"
                name="notifications"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-600 dark:bg-gray-900"
              />
              <label htmlFor="notifications" className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                Receive email notifications for ticket updates
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

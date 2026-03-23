"use client";

export default function RoleSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      name="role"
      defaultValue={defaultValue}
      className="block rounded-md border-0 py-1 pl-2 text-gray-900 dark:text-white dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-xs sm:leading-6 transition-colors"
      onChange={(e) => {
        if (e.target.form) {
          e.target.form.requestSubmit();
        }
      }}
    >
      <option value="USER">USER</option>
      <option value="IT_SUPPORT">IT SUPPORT</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}

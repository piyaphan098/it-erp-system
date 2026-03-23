import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCurrentLocale, getDictionary } from "@/lib/i18n";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const locale = await getCurrentLocale();
  const dict = await getDictionary();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={session.user.role as string} dict={dict} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header user={session.user} locale={locale} />
        <main className="grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

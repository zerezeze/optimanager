import { auth } from "@/auth";
import Header from "@/components/Header";
import { redirect } from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Header email={session.user.email} />
      <main className="flex-1 w-full py-4 sm:py-6">{children}</main>
    </div>
  );
}

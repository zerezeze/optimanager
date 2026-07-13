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
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Header email={session.user.email} />
      <main style={{ padding: "20px 0" }}>{children}</main>
    </div>
  );
}

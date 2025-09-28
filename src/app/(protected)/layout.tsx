import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Header from "@/components/header/Header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}

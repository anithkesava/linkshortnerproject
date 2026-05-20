import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { userId } = await auth();

  // Redirect unauthenticated users
  if (!userId) {
    redirect("/");
  }

  return <div className="flex flex-col bg-neutral-950 text-white min-h-screen">{children}</div>;
}

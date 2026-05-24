import { requireAuth } from "@/lib/auth";
import { getUserLinks } from "@/db/queries";
import LinksList from "@/components/links/LinksList";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function DashboardPage() {
  const userId = await requireAuth();
  const links = await getUserLinks(userId);

  return (
    <div className="flex flex-col flex-1 bg-neutral-950 text-white min-h-screen">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-neutral-400">Manage your shortened links</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Links</CardTitle>
              <CardDescription>
                You have {links.length} link{links.length !== 1 ? "s" : ""} in total
              </CardDescription>
            </CardHeader>
          </Card>

          <LinksList links={links} />
        </div>
      </main>
    </div>
  );
}

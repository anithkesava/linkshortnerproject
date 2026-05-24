import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Link } from "@/db/schema";

interface LinksListProps {
  readonly links: Link[];
}

export default function LinksList({ links }: LinksListProps) {
  if (links.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-neutral-400">No links created yet.</p>
          <p className="text-sm text-neutral-500">Create your first shortened link to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <Card key={link.id}>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-400">Original URL</p>
                <p className="break-all text-white hover:text-neutral-300">
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {link.originalUrl}
                  </a>
                </p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex-1 md:flex-none">
                  <p className="text-sm font-medium text-neutral-400">Short Code</p>
                  <p className="font-mono text-white">{link.shortCode}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/l/${link.shortCode}`
                      );
                    }}
                  >
                    Copy
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Created: {new Date(link.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

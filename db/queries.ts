import { db } from "./index";
import { links } from "./schema";
import { eq } from "drizzle-orm";
import type { Link } from "./schema";

/**
 * Get all links for a specific user
 */
export async function getUserLinks(userId: string): Promise<Link[]> {
  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, userId),
    orderBy: (links, { desc }) => [desc(links.createdAt)],
  });
  return userLinks;
}

/**
 * Get a single link by ID and user ID
 */
export async function getUserLink(
  linkId: number,
  userId: string
): Promise<Link | null> {
  const link = await db.query.links.findFirst({
    where: (links, { eq, and }) => [
      and(eq(links.id, linkId), eq(links.userId, userId)),
    ],
  });
  return link || null;
}

/**
 * Create a new link for a user
 */
export async function createLink(
  userId: string,
  originalUrl: string,
  shortCode: string
): Promise<Link> {
  const result = await db
    .insert(links)
    .values({
      userId,
      originalUrl,
      shortCode,
    })
    .returning();

  return result[0];
}

/**
 * Delete a link by ID and user ID
 */
export async function deleteLink(
  linkId: number,
  userId: string
): Promise<boolean> {
  const result = await db
    .delete(links)
    .where((links, { eq, and }) => [
      and(eq(links.id, linkId), eq(links.userId, userId)),
    ]);

  return result.rowCount > 0;
}

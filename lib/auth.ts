import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the current authenticated user
 * Returns null if user is not authenticated
 */
export async function getCurrentUser() {
  const user = await currentUser();
  return user ?? null;
}

/**
 * Get the current session
 * Returns null if no active session
 */
export async function getCurrentSession() {
  const session = await auth();
  return session;
}

/**
 * Check if user is authenticated and return their ID
 * Throws error if not authenticated
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: User must be authenticated");
  }
  return userId;
}

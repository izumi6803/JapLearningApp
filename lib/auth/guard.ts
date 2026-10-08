import { redirect } from "next/navigation";
import { isAdminEmail } from "./config";
import { findUserById, setUserRole, type User } from "./repository";
import { getCurrentUser } from "./session";

/**
 * Resolves the current user from the session, then re-checks the database so
 * renamed/deleted/disabled accounts and role changes take effect immediately.
 * Promotes allowlisted emails (ADMIN_EMAILS) to admin on the fly.
 */
export async function currentUser(): Promise<User | null> {
  const session = await getCurrentUser();
  if (!session) return null;
  const user = await findUserById(session.id);
  if (!user || user.status === "disabled") return null;
  if (isAdminEmail(user.email) && user.role !== "admin") {
    await setUserRole(user.id, "admin");
    return { ...user, role: "admin" };
  }
  return user;
}

export async function requireAdmin(): Promise<User | null> {
  const user = await currentUser();
  return user && user.role === "admin" ? user : null;
}

/**
 * Student-facing pages call this so administrators stay in the console
 * instead of seeing the learning experience.
 */
export async function redirectAdminToConsole(): Promise<void> {
  const user = await currentUser();
  if (user?.role === "admin") redirect("/admin");
}

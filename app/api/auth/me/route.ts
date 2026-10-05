import { currentUser } from "@/lib/auth/guard";
import { json } from "@/lib/auth/http";
import { toPublicUser } from "@/lib/auth/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await currentUser();
    return json({ user: user ? toPublicUser(user) : null });
  } catch {
    return json({ user: null });
  }
}

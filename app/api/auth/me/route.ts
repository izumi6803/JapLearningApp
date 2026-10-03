import { json } from "@/lib/auth/http";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return json({ user });
  } catch {
    return json({ user: null });
  }
}

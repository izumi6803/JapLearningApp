import { requireAdmin } from "@/lib/auth/guard";
import { json } from "@/lib/auth/http";
import { listUsers } from "@/lib/auth/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "forbidden" }, 403);

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const limit = Number(url.searchParams.get("limit") ?? "50");
  const offset = Number(url.searchParams.get("offset") ?? "0");
  const { users, total } = await listUsers({ query: q, limit, offset });
  return json({ users, total });
}

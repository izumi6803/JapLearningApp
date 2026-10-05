import { requireAdmin } from "@/lib/auth/guard";
import { MIN_PASSWORD, json, sameOrigin } from "@/lib/auth/http";
import { hashPassword } from "@/lib/auth/password";
import { findUserById, updatePassword } from "@/lib/auth/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);
  const admin = await requireAdmin();
  if (!admin) return json({ error: "forbidden" }, 403);

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { password?: unknown };
  const password = typeof body.password === "string" ? body.password : "";
  if (password.length < MIN_PASSWORD) return json({ error: "weak_password" }, 400);

  const target = await findUserById(id);
  if (!target) return json({ error: "not_found" }, 404);

  await updatePassword(id, await hashPassword(password));
  return json({ ok: true });
}

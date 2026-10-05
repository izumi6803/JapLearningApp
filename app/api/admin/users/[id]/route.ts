import { requireAdmin } from "@/lib/auth/guard";
import { json, sameOrigin } from "@/lib/auth/http";
import { deleteUser, setUserStatus } from "@/lib/auth/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);
  const admin = await requireAdmin();
  if (!admin) return json({ error: "forbidden" }, 403);

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { status?: unknown };
  if (body.status !== "active" && body.status !== "disabled") {
    return json({ error: "invalid_request" }, 400);
  }
  if (id === admin.id && body.status === "disabled") {
    return json({ error: "cannot_disable_self" }, 400);
  }
  await setUserStatus(id, body.status);
  return json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);
  const admin = await requireAdmin();
  if (!admin) return json({ error: "forbidden" }, 403);

  const { id } = await params;
  if (id === admin.id) return json({ error: "cannot_delete_self" }, 400);
  await deleteUser(id);
  return json({ ok: true });
}

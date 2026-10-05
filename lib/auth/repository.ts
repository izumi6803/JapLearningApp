import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Pool, type QueryResultRow } from "pg";
import {
  sanitizeProgress,
  type ProgressState,
} from "@/lib/progress-types";
import { databaseUrl, isAdminEmail, isProduction } from "./config";

export type Provider = "credentials" | "google";
export type Role = "student" | "admin";
export type AccountStatus = "active" | "disabled";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  passwordHash: string | null;
  provider: Provider;
  googleSub: string | null;
  role: Role;
  status: AccountStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface NewUser {
  email: string;
  name: string | null;
  image: string | null;
  passwordHash: string | null;
  provider: Provider;
  googleSub: string | null;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  provider: Provider;
  role: Role;
  hasPassword: boolean;
}

export interface AdminUser extends PublicUser {
  status: AccountStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    provider: user.provider,
    role: user.role,
    hasPassword: Boolean(user.passwordHash),
  };
}

export function toAdminUser(user: User): AdminUser {
  return {
    ...toPublicUser(user),
    status: user.status,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

const usePg = Boolean(databaseUrl);

function assertBackend() {
  if (!usePg && isProduction) {
    throw new Error(
      "DATABASE_URL is required in production. Point it at Postgres (Neon, Supabase, Railway, …).",
    );
  }
}

/* ------------------------------------------------------------------ *
 * Postgres backend
 * ------------------------------------------------------------------ */

interface Row extends QueryResultRow {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  password_hash: string | null;
  provider: string;
  google_sub: string | null;
  role: string;
  status: string;
  created_at: string | Date;
  last_login_at: string | Date | null;
}

const globalPg = globalThis as unknown as {
  __nihongoPool?: Pool;
  __nihongoSchemaReady?: Promise<void>;
};

function toIso(value: string | Date | null): string | null {
  if (value === null) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function mapRow(row: Row): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    image: row.image,
    passwordHash: row.password_hash,
    provider: row.provider as Provider,
    googleSub: row.google_sub,
    role: row.role === "admin" ? "admin" : "student",
    status: row.status === "disabled" ? "disabled" : "active",
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    lastLoginAt: toIso(row.last_login_at),
  };
}

function pool(): Pool {
  if (!globalPg.__nihongoPool) {
    const local = /localhost|127\.0\.0\.1/.test(databaseUrl);
    globalPg.__nihongoPool = new Pool({
      connectionString: databaseUrl,
      ssl: local ? false : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return globalPg.__nihongoPool;
}

function ensureSchema(): Promise<void> {
  if (!globalPg.__nihongoSchemaReady) {
    const statements = [
      `CREATE TABLE IF NOT EXISTS users (
         id UUID PRIMARY KEY,
         email TEXT UNIQUE NOT NULL,
         name TEXT,
         image TEXT,
         password_hash TEXT,
         provider TEXT NOT NULL DEFAULT 'credentials',
         google_sub TEXT UNIQUE,
         role TEXT NOT NULL DEFAULT 'student',
         status TEXT NOT NULL DEFAULT 'active',
         created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
         last_login_at TIMESTAMPTZ
       )`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'`,
      `CREATE TABLE IF NOT EXISTS progress (
         user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
         data JSONB NOT NULL,
         updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
       )`,
      `CREATE TABLE IF NOT EXISTS password_resets (
         token_hash TEXT PRIMARY KEY,
         user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
         expires_at TIMESTAMPTZ NOT NULL,
         used BOOLEAN NOT NULL DEFAULT false,
         created_at TIMESTAMPTZ NOT NULL DEFAULT now()
       )`,
    ];
    globalPg.__nihongoSchemaReady = (async () => {
      for (const sql of statements) await pool().query(sql);
    })();
  }
  return globalPg.__nihongoSchemaReady;
}

/* ------------------------------------------------------------------ *
 * File backend (local development only)
 * ------------------------------------------------------------------ */

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PROGRESS_FILE = path.join(DATA_DIR, "progress.json");
const RESETS_FILE = path.join(DATA_DIR, "resets.json");

const globalFile = globalThis as unknown as {
  __nihongoFileQueue?: Promise<unknown>;
};

function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
  const prev = globalFile.__nihongoFileQueue ?? Promise.resolve();
  const next = prev.then(fn, fn);
  globalFile.__nihongoFileQueue = next.catch(() => undefined);
  return next;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

interface ResetRecord {
  tokenHash: string;
  userId: string;
  expiresAt: number;
  used: boolean;
}

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string): Promise<User | null> {
  assertBackend();
  const value = normalizeEmail(email);
  if (usePg) {
    await ensureSchema();
    const res = await pool().query<Row>(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [value],
    );
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  }
  const users = await readJson<User[]>(USERS_FILE, []);
  return users.find((u) => u.email === value) ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    const res = await pool().query<Row>(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [id],
    );
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  }
  const users = await readJson<User[]>(USERS_FILE, []);
  return users.find((u) => u.id === id) ?? null;
}

export async function findUserByGoogleSub(sub: string): Promise<User | null> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    const res = await pool().query<Row>(
      "SELECT * FROM users WHERE google_sub = $1 LIMIT 1",
      [sub],
    );
    return res.rows[0] ? mapRow(res.rows[0]) : null;
  }
  const users = await readJson<User[]>(USERS_FILE, []);
  return users.find((u) => u.googleSub === sub) ?? null;
}

export async function createUser(input: NewUser): Promise<User> {
  assertBackend();
  const role: Role = isAdminEmail(input.email) ? "admin" : "student";
  const user: User = {
    id: randomUUID(),
    email: normalizeEmail(input.email),
    name: input.name,
    image: input.image,
    passwordHash: input.passwordHash,
    provider: input.provider,
    googleSub: input.googleSub,
    role,
    status: "active",
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };

  if (usePg) {
    await ensureSchema();
    await pool().query(
      `INSERT INTO users
         (id, email, name, image, password_hash, provider, google_sub, role, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        user.id, user.email, user.name, user.image, user.passwordHash,
        user.provider, user.googleSub, user.role, user.status, user.createdAt,
      ],
    );
    return user;
  }

  return withFileLock(async () => {
    const users = await readJson<User[]>(USERS_FILE, []);
    if (users.some((u) => u.email === user.email)) throw new Error("email_taken");
    users.push(user);
    await writeJson(USERS_FILE, users);
    return user;
  });
}

export async function linkGoogleAccount(
  id: string,
  googleSub: string,
  image: string | null,
): Promise<void> {
  assertBackend();
  const now = new Date().toISOString();
  if (usePg) {
    await ensureSchema();
    await pool().query(
      "UPDATE users SET google_sub = $2, image = COALESCE($3, image), last_login_at = $4 WHERE id = $1",
      [id, googleSub, image, now],
    );
    return;
  }
  await withFileLock(async () => {
    const users = await readJson<User[]>(USERS_FILE, []);
    const user = users.find((u) => u.id === id);
    if (user) {
      user.googleSub = googleSub;
      user.image = image ?? user.image;
      user.lastLoginAt = now;
      await writeJson(USERS_FILE, users);
    }
  });
}

export async function setUserRole(id: string, role: Role): Promise<void> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    await pool().query("UPDATE users SET role = $2 WHERE id = $1", [id, role]);
    return;
  }
  await withFileLock(async () => {
    const users = await readJson<User[]>(USERS_FILE, []);
    const user = users.find((u) => u.id === id);
    if (user) {
      user.role = role;
      await writeJson(USERS_FILE, users);
    }
  });
}

export async function setUserStatus(
  id: string,
  status: AccountStatus,
): Promise<void> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    await pool().query("UPDATE users SET status = $2 WHERE id = $1", [id, status]);
    return;
  }
  await withFileLock(async () => {
    const users = await readJson<User[]>(USERS_FILE, []);
    const user = users.find((u) => u.id === id);
    if (user) {
      user.status = status;
      await writeJson(USERS_FILE, users);
    }
  });
}

export async function updatePassword(id: string, hash: string): Promise<void> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    await pool().query("UPDATE users SET password_hash = $2 WHERE id = $1", [id, hash]);
    return;
  }
  await withFileLock(async () => {
    const users = await readJson<User[]>(USERS_FILE, []);
    const user = users.find((u) => u.id === id);
    if (user) {
      user.passwordHash = hash;
      await writeJson(USERS_FILE, users);
    }
  });
}

export async function touchLogin(id: string): Promise<void> {
  assertBackend();
  const now = new Date().toISOString();
  if (usePg) {
    await ensureSchema();
    await pool().query("UPDATE users SET last_login_at = $2 WHERE id = $1", [id, now]);
    return;
  }
  await withFileLock(async () => {
    const users = await readJson<User[]>(USERS_FILE, []);
    const user = users.find((u) => u.id === id);
    if (user) {
      user.lastLoginAt = now;
      await writeJson(USERS_FILE, users);
    }
  });
}

export async function deleteUser(id: string): Promise<void> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    await pool().query("DELETE FROM users WHERE id = $1", [id]);
    return;
  }
  await withFileLock(async () => {
    const users = (await readJson<User[]>(USERS_FILE, [])).filter((u) => u.id !== id);
    await writeJson(USERS_FILE, users);
    const progress = await readJson<Record<string, ProgressState>>(PROGRESS_FILE, {});
    delete progress[id];
    await writeJson(PROGRESS_FILE, progress);
  });
}

export async function listUsers(options: {
  query?: string;
  limit?: number;
  offset?: number;
}): Promise<{ users: AdminUser[]; total: number }> {
  assertBackend();
  const q = (options.query ?? "").trim();
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 200);
  const offset = Math.max(options.offset ?? 0, 0);

  if (usePg) {
    await ensureSchema();
    const where =
      "($1 = '' OR email ILIKE '%' || $1 || '%' OR COALESCE(name,'') ILIKE '%' || $1 || '%')";
    const rows = await pool().query<Row>(
      `SELECT * FROM users WHERE ${where} ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [q, limit, offset],
    );
    const count = await pool().query<{ n: string }>(
      `SELECT COUNT(*)::text AS n FROM users WHERE ${where}`,
      [q],
    );
    return {
      users: rows.rows.map(mapRow).map(toAdminUser),
      total: Number(count.rows[0]?.n ?? 0),
    };
  }

  const users = await readJson<User[]>(USERS_FILE, []);
  const filtered = q
    ? users.filter(
        (u) =>
          u.email.includes(q.toLowerCase()) ||
          (u.name ?? "").toLowerCase().includes(q.toLowerCase()),
      )
    : users;
  const sorted = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return {
    users: sorted.slice(offset, offset + limit).map(toAdminUser),
    total: filtered.length,
  };
}

/* ------------------------------------------------------------------ *
 * Progress
 * ------------------------------------------------------------------ */

export async function getProgress(userId: string): Promise<ProgressState | null> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    const res = await pool().query<{ data: unknown }>(
      "SELECT data FROM progress WHERE user_id = $1 LIMIT 1",
      [userId],
    );
    return res.rows[0] ? sanitizeProgress(res.rows[0].data) : null;
  }
  const all = await readJson<Record<string, ProgressState>>(PROGRESS_FILE, {});
  return all[userId] ?? null;
}

export async function saveProgress(
  userId: string,
  progress: ProgressState,
): Promise<void> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    await pool().query(
      `INSERT INTO progress (user_id, data, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [userId, JSON.stringify(progress)],
    );
    return;
  }
  await withFileLock(async () => {
    const all = await readJson<Record<string, ProgressState>>(PROGRESS_FILE, {});
    all[userId] = progress;
    await writeJson(PROGRESS_FILE, all);
  });
}

/* ------------------------------------------------------------------ *
 * Password resets
 * ------------------------------------------------------------------ */

export async function createPasswordReset(
  tokenHash: string,
  userId: string,
  expiresAt: number,
): Promise<void> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    await pool().query("DELETE FROM password_resets WHERE user_id = $1", [userId]);
    await pool().query(
      "INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES ($1,$2,$3)",
      [tokenHash, userId, new Date(expiresAt).toISOString()],
    );
    return;
  }
  await withFileLock(async () => {
    const resets = (await readJson<ResetRecord[]>(RESETS_FILE, [])).filter(
      (r) => r.userId !== userId,
    );
    resets.push({ tokenHash, userId, expiresAt, used: false });
    await writeJson(RESETS_FILE, resets);
  });
}

export async function consumePasswordReset(
  tokenHash: string,
): Promise<string | null> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    const res = await pool().query<{ user_id: string }>(
      `UPDATE password_resets SET used = true
       WHERE token_hash = $1 AND used = false AND expires_at > now()
       RETURNING user_id`,
      [tokenHash],
    );
    return res.rows[0]?.user_id ?? null;
  }
  let userId: string | null = null;
  await withFileLock(async () => {
    const resets = await readJson<ResetRecord[]>(RESETS_FILE, []);
    const match = resets.find(
      (r) => r.tokenHash === tokenHash && !r.used && r.expiresAt > Date.now(),
    );
    if (match) {
      match.used = true;
      userId = match.userId;
      await writeJson(RESETS_FILE, resets);
    }
  });
  return userId;
}

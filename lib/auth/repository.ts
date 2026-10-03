import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Pool, type QueryResultRow } from "pg";
import { databaseUrl, isProduction } from "./config";

export type Provider = "credentials" | "google";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  passwordHash: string | null;
  provider: Provider;
  googleSub: string | null;
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
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    provider: user.provider,
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
    globalPg.__nihongoSchemaReady = pool()
      .query(
        `CREATE TABLE IF NOT EXISTS users (
           id UUID PRIMARY KEY,
           email TEXT UNIQUE NOT NULL,
           name TEXT,
           image TEXT,
           password_hash TEXT,
           provider TEXT NOT NULL DEFAULT 'credentials',
           google_sub TEXT UNIQUE,
           created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
           last_login_at TIMESTAMPTZ
         )`,
      )
      .then(() => undefined);
  }
  return globalPg.__nihongoSchemaReady;
}

/* ------------------------------------------------------------------ *
 * File backend (local development only)
 * ------------------------------------------------------------------ */

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "users.json");

const globalFile = globalThis as unknown as { __nihongoFileQueue?: Promise<unknown> };

function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
  const prev = globalFile.__nihongoFileQueue ?? Promise.resolve();
  const next = prev.then(fn, fn);
  globalFile.__nihongoFileQueue = next.catch(() => undefined);
  return next;
}

async function readFileUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

async function writeFileUsers(users: User[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
}

/* ------------------------------------------------------------------ *
 * Public API
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
  const users = await readFileUsers();
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
  const users = await readFileUsers();
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
  const users = await readFileUsers();
  return users.find((u) => u.googleSub === sub) ?? null;
}

export async function createUser(input: NewUser): Promise<User> {
  assertBackend();
  const user: User = {
    id: randomUUID(),
    email: normalizeEmail(input.email),
    name: input.name,
    image: input.image,
    passwordHash: input.passwordHash,
    provider: input.provider,
    googleSub: input.googleSub,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };

  if (usePg) {
    await ensureSchema();
    await pool().query(
      `INSERT INTO users
         (id, email, name, image, password_hash, provider, google_sub, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        user.id,
        user.email,
        user.name,
        user.image,
        user.passwordHash,
        user.provider,
        user.googleSub,
        user.createdAt,
      ],
    );
    return user;
  }

  return withFileLock(async () => {
    const users = await readFileUsers();
    if (users.some((u) => u.email === user.email)) {
      throw new Error("email_taken");
    }
    users.push(user);
    await writeFileUsers(users);
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
    const users = await readFileUsers();
    const user = users.find((u) => u.id === id);
    if (user) {
      user.googleSub = googleSub;
      user.image = image ?? user.image;
      user.lastLoginAt = now;
      await writeFileUsers(users);
    }
  });
}

export async function touchLogin(id: string): Promise<void> {
  assertBackend();
  const now = new Date().toISOString();
  if (usePg) {
    await ensureSchema();
    await pool().query("UPDATE users SET last_login_at = $2 WHERE id = $1", [
      id,
      now,
    ]);
    return;
  }
  await withFileLock(async () => {
    const users = await readFileUsers();
    const user = users.find((u) => u.id === id);
    if (user) {
      user.lastLoginAt = now;
      await writeFileUsers(users);
    }
  });
}

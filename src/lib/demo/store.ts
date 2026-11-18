import { promises as fs } from "fs";
import path from "path";
import {
  createDemoSeedStore,
  DEMO_USER_IDS,
  refreshDemoPeopleInStore,
} from "@/lib/demo/seed-data";
import type { Store } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

/** Vercel (and similar) have no durable local disk — keep seed data in memory. */
const useMemoryStore = Boolean(process.env.VERCEL);

let memoryStore: Store | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function demoProfilesNeedRefresh(store: Store): boolean {
  const demoIds = new Set<string>(DEMO_USER_IDS);
  const demoProfiles = store.profiles.filter((p) => demoIds.has(p.id));
  if (demoProfiles.length < DEMO_USER_IDS.length) return true;
  if (demoProfiles.some((p) => !p.avatar_url)) return true;
  const demoPortfolio = store.portfolio_images.filter((p) =>
    demoIds.has(p.profile_id),
  );
  return demoPortfolio.length === 0;
}

function migrateStore(store: Store): Store {
  if (!Array.isArray(store.applications)) {
    store.applications = [];
  }
  if (demoProfilesNeedRefresh(store)) {
    refreshDemoPeopleInStore(store);
  }
  return store;
}

function ensureMemoryStore(): Store {
  if (!memoryStore) {
    memoryStore = migrateStore(createDemoSeedStore());
  } else {
    memoryStore = migrateStore(memoryStore);
  }
  return memoryStore;
}

async function ensureFileStore(): Promise<Store> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Store;
    const neededRefresh = demoProfilesNeedRefresh(parsed);
    const store = migrateStore(parsed);
    if (neededRefresh) {
      await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
    }
    return store;
  } catch {
    const seeded = createDemoSeedStore();
    await fs.writeFile(STORE_PATH, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
}

async function ensureStore(): Promise<Store> {
  if (useMemoryStore) return ensureMemoryStore();
  return ensureFileStore();
}

export async function readStore(): Promise<Store> {
  return ensureStore();
}

export async function updateStore(
  mutator: (store: Store) => void | Promise<void>,
): Promise<Store> {
  writeQueue = writeQueue.then(async () => {
    const store = await ensureStore();
    await mutator(store);
    if (useMemoryStore) {
      memoryStore = store;
    } else {
      await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
    }
  });
  await writeQueue;
  return ensureStore();
}

export function uid(prefix = "id"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function isDemoMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  );
}

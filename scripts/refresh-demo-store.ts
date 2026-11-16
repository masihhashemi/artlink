import { promises as fs } from "fs";
import path from "path";
import {
  DEMO_USER_IDS,
  refreshDemoPeopleInStore,
} from "../src/lib/demo/seed-data";
import type { Store } from "../src/lib/types";

async function main() {
  const storePath = path.join(process.cwd(), ".data", "store.json");
  const raw = await fs.readFile(storePath, "utf8");
  const store = JSON.parse(raw) as Store;
  refreshDemoPeopleInStore(store);
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");

  const demoIds = new Set<string>(DEMO_USER_IDS);
  for (const profile of store.profiles.filter((p) => demoIds.has(p.id))) {
    const portfolio = store.portfolio_images.filter(
      (image) => image.profile_id === profile.id,
    );
    console.log(
      `${profile.full_name} | avatar=${Boolean(profile.avatar_url)} | portfolio=${portfolio.length}`,
    );
  }
  console.log(
    "preserved non-demo:",
    store.users.filter((u) => !demoIds.has(u.id)).map((u) => u.email),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

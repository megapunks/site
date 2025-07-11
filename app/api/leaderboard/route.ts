import { getBunnyContract } from "@/lib/bunnyContract";
import fs from "fs";
import path from "path";

const withRetry = async <T>(fn: () => Promise<T>, retries = 2, delayMs = 300): Promise<T> => {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
  throw lastErr;
};


const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─────────────────────────────────────────────
const generateLeaderboard = async () => {
  const contract = await getBunnyContract();
  const pageSize = 100;
  let page = 0;
  let addresses: string[] = [];

  console.log("📦 Reading players from contract...");

 
  while (true) {
    const chunk = await withRetry(() => contract.getPlayers(page * pageSize, pageSize));
    if (!chunk.length) break;
    addresses.push(...chunk);
    if (chunk.length < pageSize) break;
    page++;
  }

  console.log(`📊 Total unique players: ${addresses.length}`);

  const players = [];

  for (let i = 0; i < addresses.length; i++) {
    const addr = addresses[i];

    try {
      const [bunny, level, feeds, missed, isDead] = await Promise.all([
        withRetry(() => contract.bunnies(addr)),
        withRetry(() => contract.getLevel(addr)),
        withRetry(() => contract.getFeedCount(addr)),
        withRetry(() => contract.getMissedDays(addr)),
        withRetry(() => contract.isBunnyDead(addr)),
      ]);

      players.push({
        address: addr,
        baseXP: Number(bunny.baseXP),
        newXP: Number(bunny.newXP),
        xp: Number(bunny.baseXP) + Number(bunny.newXP),
        level: Number(level),
        feeds: Number(feeds),
        missed: Number(missed),
        isDead: Boolean(isDead),
      });
    } catch (err: any) {
      console.warn(`⚠️ ${addr}: ${err.message}`);
      players.push({
        address: addr,
        baseXP: 0,
        newXP: 0,
        xp: 0,
        level: 0,
        feeds: 0,
        missed: 0,
        isDead: false,
      });
    }


    if ((i + 1) % 10 === 0) {
      await delay(400);
    }
  }

  
  const sorted = players
    .filter((p) => p.xp > 0 || p.feeds > 0)
    .sort((a, b) => b.xp - a.xp || b.level - a.level);


  const filePath = path.join(process.cwd(), "public", "leaderboard.json");
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2));

  console.log(`✅ Leaderboard snapshot saved (${sorted.length} players)`);
};


generateLeaderboard().catch((err) => {
  console.error("❌ Failed to generate leaderboard:", err);
  process.exit(1);
});

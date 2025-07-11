import { NextResponse } from "next/server";
import { getBunnyContract } from "@/lib/bunnyContract";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 300): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i < retries - 1) await delay(delayMs);
      else throw err;
    }
  }
  throw new Error("Unreachable");
}

export async function GET() {
  try {
    const contract = await getBunnyContract();
    const pageSize = 100;
    let page = 0;
    let addresses: string[] = [];

    while (true) {
      const chunk = await withRetry(() =>
        contract.getPlayers(page * pageSize, pageSize)
      ) as string[];
      if (!chunk.length) break;
      addresses.push(...chunk);
      if (chunk.length < pageSize) break;
      page++;
    }

    const filePath = path.join(process.cwd(), "public", "leaderboard.json");
    let previousData: any[] = [];
    if (fs.existsSync(filePath)) {
      previousData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    const players = await Promise.all(
      addresses.map(async (addr) => {
        try {
          const [bunnyRaw, levelRaw, feedsRaw, missedRaw, isDeadRaw] = await Promise.all([
            withRetry(() => contract.bunnies(addr)),
            withRetry(() => contract.getLevel(addr)),
            withRetry(() => contract.getFeedCount(addr)),
            withRetry(() => contract.getMissedDays(addr)),
            withRetry(() => contract.isBunnyDead(addr)),
          ]);

          const bunny = bunnyRaw as { baseXP: bigint; newXP: bigint };

          return {
            address: addr,
            baseXP: Number(bunny.baseXP),
            newXP: Number(bunny.newXP),
            xp: Number(bunny.baseXP) + Number(bunny.newXP),
            level: Number(levelRaw),
            feeds: Number(feedsRaw),
            missed: Number(missedRaw),
            isDead: Boolean(isDeadRaw),
          };
        } catch (err) {
          // fallback to previous data if available
          const fallback = previousData.find((p) => p.address.toLowerCase() === addr.toLowerCase());
          if (fallback) return fallback;
          // if no previous data, include empty defaults
          return {
            address: addr,
            baseXP: 0,
            newXP: 0,
            xp: 0,
            level: 0,
            feeds: 0,
            missed: 0,
            isDead: false,
          };
        }
      })
    );

    const sorted = players
      .filter((p) => p.xp > 0 || p.feeds > 0)
      .sort((a, b) => b.xp - a.xp || b.level - a.level);

    fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2));
    return NextResponse.json({ ok: true, count: sorted.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

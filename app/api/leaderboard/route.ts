import { NextResponse } from "next/server";
import { getBunnyContract } from "@/lib/bunnyContract";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const contract = await getBunnyContract();
    const pageSize = 100;
    let page = 0;
    let addresses: string[] = [];

    while (true) {
      const chunk = await contract.getPlayers(page * pageSize, pageSize) as string[];
      if (chunk.length === 0) break;
      addresses.push(...chunk);
      if (chunk.length < pageSize) break;
      page++;
    }

    const players = await Promise.all(
      addresses.map(async (addr) => {
        const [bunny, level, feeds, missed, isDead] = await Promise.all([
          contract.bunnies(addr),
          contract.getLevel(addr),
          contract.getFeedCount(addr),
          contract.getMissedDays(addr),
          contract.isBunnyDead(addr),
        ]);
        return {
          address: addr,
          baseXP: Number(bunny.baseXP),
          newXP: Number(bunny.newXP),
          xp: Number(bunny.baseXP) + Number(bunny.newXP),
          level: Number(level),
          feeds: Number(feeds),
          missed: Number(missed),
          isDead: Boolean(isDead),
        };
      })
    );

    const sorted = players
      .filter((p) => p.xp > 0 || p.feeds > 0)
      .sort((a, b) => b.xp - a.xp || b.level - a.level);

    const filePath = path.join(process.cwd(), "public", "leaderboard.json");
    fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2));

    return NextResponse.json({ ok: true, count: sorted.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getContract } from "@/lib/bunnyContract";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const contract = await getContract();

    // ✅ لیست تستی آدرس‌ها – اینجا آدرس خودت رو هم بذار
    const addresses = [
      "0x20273d97114adc750376B4180b290C418485f15A", // خودت
      "0x0000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000002"
    ];

    const data = await Promise.all(
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

    const sorted = data
      .filter((p) => p.xp > 0 || p.feeds > 0)
      .sort((a, b) => b.xp - a.xp || b.level - a.level);

    const filePath = path.join(process.cwd(), "public", "leaderboard.json");
    fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2));

    return NextResponse.json({ ok: true, count: sorted.length });
  } catch (err: any) {
    console.error("❌ Error generating leaderboard:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

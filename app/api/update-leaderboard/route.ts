import { NextResponse } from "next/server";
import { getBunnyContract } from "@/lib/bunnyContract";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const contract = await getBunnyContract();

    const addresses = [
      "0x20273d97114adc750376B4180b290C418485f15A", 
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

    return NextResponse.json(sorted);
  } catch (err: any) {
    console.error("❌ Error generating leaderboard:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getBunnyContract } from '@/lib/bunnyContract';

export async function GET() {
  try {
    const contract = await getBunnyContract();
    const addresses: string[] = await contract.getPlayersWithXP();

    const players = await Promise.all(
      addresses.map(async (addr) => {
        const [baseXP, newXP, level, feeds, missed, isDead] = await Promise.all([
          contract.baseXP(addr),
          contract.newXP(addr),
          contract.getLevel(addr),
          contract.getFeedCount(addr),
          contract.getMissedDays(addr),
          contract.isBunnyDead(addr),
        ]);

        return {
          address: addr,
          baseXP: Number(baseXP),
          newXP: Number(newXP),
          xp: Number(baseXP) + Number(newXP),
          level: Number(level),
          feeds: Number(feeds),
          missed: Number(missed),
          isDead: Boolean(isDead),
        };
      })
    );

    players.sort((a, b) => b.xp - a.xp);
    return NextResponse.json(players);
  } catch (err) {
    console.error('❌ Failed to load leaderboard', err);
    return NextResponse.json([], { status: 500 });
  }
}

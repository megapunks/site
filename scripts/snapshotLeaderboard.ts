// scripts/snapshotLeaderboard.ts
import fs from 'fs';
import path from 'path';
import { getBunnyContract } from '../lib/bunnyContract';
import { createPublicClient, http } from 'viem';
import { megaeth } from '../lib/chains';

async function run() {
  const contract = await getBunnyContract();
  const pageSize = 100;
  let page = 0;
  let allAddresses: string[] = [];

  while (true) {
    const chunk = await contract.getPlayers(page * pageSize, pageSize);
    if (chunk.length === 0) break;
    allAddresses.push(...chunk);
    if (chunk.length < pageSize) break;
    page++;
  }

  const results = await Promise.all(
    allAddresses.map(async (addr) => {
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

  const sorted = results
    .filter((p) => p.xp > 0 || p.feeds > 0)
    .sort((a, b) => b.xp - a.xp || b.level - a.level);

  const outputPath = path.join(__dirname, '../public/leaderboard.json');
  fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2));

  console.log(`✅ Snapshot saved: ${sorted.length} entries`);
}

run().catch(console.error);

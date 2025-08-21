require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const abi = require("../lib/bunnyAbi.json");

const contractAddress = "0x20273d97114adc750376B4180b290C418485f15A";
const rpcUrl = "https://carrot.megaeth.com/rpc";
const snapshotPath = path.join(__dirname, "../public/xp_snapshot.json");

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const privateKey = process.env.SNAPSHOT_PRIVATE_KEY;

if (!privateKey) {
  console.error("❌ SNAPSHOT_PRIVATE_KEY not found in .env");
  process.exit(1);
}

const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

interface Player {
  address: string;
  baseXP: number;
  newXP: number;
  xp: number;
  level: number;
  feeds: number;
  missed: number;
  isDead: boolean;
}

let previousSnapshot: { address: string; xp: number }[] = [];
if (fs.existsSync(snapshotPath)) {
  previousSnapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
}

const fetchAllPlayers = async (batchSize = 1000): Promise<string[]> => {
  const all: string[] = [];
  let start = 0;
  while (true) {
    const chunk: string[] = await contract.getPlayers(start, batchSize);
    if (chunk.length === 0) break;
    all.push(...chunk);
    if (chunk.length < batchSize) break;
    start += batchSize;
  }
  return all;
};

const main = async () => {
  try {
    console.log("📦 Reading all players from contract...");
    const onChainAddresses = await fetchAllPlayers();
    const snapshotAddresses: string[] = previousSnapshot.map((p) => p.address.toLowerCase());

    const allAddresses = Array.from(new Set([...onChainAddresses.map((a) => a.toLowerCase()), ...snapshotAddresses]));

    const snapshotMap = new Map<string, number>(
      previousSnapshot.map((p) => [p.address.toLowerCase(), p.xp])
    );

    console.log(`📊 Total unique players: ${allAddresses.length}`);

    const results = await Promise.all(
      allAddresses.map(async (addr: string): Promise<Player | null> => {
        const result: Player = {
          address: addr,
          baseXP: 0,
          newXP: 0,
          xp: snapshotMap.get(addr) || 0,
          level: 0,
          feeds: 0,
          missed: 0,
          isDead: false,
        };

        try {
          const bunny = await contract.bunnies(addr);
          result.baseXP = Number(bunny?.baseXP || 0);
          result.newXP = Number(bunny?.newXP || 0);
          result.xp = result.baseXP + result.newXP;
        } catch (err) {
          console.warn(`⚠️ ${addr} (bunnies):`, (err as any)?.reason || (err as any)?.message || "unknown error");
        }

        try {
          result.level = Number(await contract.getLevel(addr));
        } catch (err) {
          console.warn(`⚠️ ${addr} (level):`, (err as any)?.reason || (err as any)?.message || "unknown error");
        }

        try {
          result.feeds = Number(await contract.getFeedCount(addr));
        } catch (err) {
          console.warn(`⚠️ ${addr} (feeds):`, (err as any)?.reason || (err as any)?.message || "unknown error");
        }

        try {
          result.missed = Number(await contract.getMissedDays(addr));
        } catch (err) {
          console.warn(`⚠️ ${addr} (missed):`, (err as any)?.reason || (err as any)?.message || "unknown error");
        }

        try {
          result.isDead = Boolean(await contract.isBunnyDead(addr));
        } catch (err) {
          console.warn(`⚠️ ${addr} (isDead):`, (err as any)?.reason || (err as any)?.message || "unknown error");
        }

        if (
  result.baseXP === 0 &&
  result.newXP === 0 &&
  result.level === 0 &&
  result.feeds === 0 &&
  result.missed === 0 &&
  result.xp === 0
) {
  console.warn(`⚠️ ${addr} has zero data but will be kept`);
}

        return result;
      })
    );

    const players: Player[] = results.filter((p): p is Player => p !== null);

    const sorted = players
      .filter((p) => p.xp > 0 || p.feeds > 0)
      .sort((a, b) => b.xp - a.xp || b.level - a.level);

    const filePath = path.join(__dirname, "../public/leaderboard.json");
    fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2));
    console.log(`✅ Leaderboard snapshot saved (${sorted.length} players)`);

  } catch (err) {
    console.error("❌ Error during leaderboard generation:", err);
    process.exit(1);
  }
};

main();

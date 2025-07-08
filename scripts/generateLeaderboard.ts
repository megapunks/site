require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const abi = require("../lib/bunnyAbi.json");

const contractAddress = "0x20273d97114adc750376B4180b290C418485f15A";
const rpcUrl = "https://carrot.megaeth.com/rpc";

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

const main = async () => {
  try {
    console.log("📦 Reading players from contract...");
    const addresses: string[] = await contract.getPlayers(0, 1000);
    console.log(`📊 Found ${addresses.length} players. Fetching stats...`);

    const results = await Promise.all(
      addresses.map(async (addr: string): Promise<Player | null> => {
        const result: Player = {
          address: addr,
          baseXP: 0,
          newXP: 0,
          xp: 0,
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
        } catch (err: unknown) {
          const reason =
            typeof err === "object" && err !== null && ("reason" in err || "message" in err)
              ? (err as any).reason || (err as any).message
              : "unknown error";
          console.warn(`⚠️ ${addr} (bunnies):`, reason);
        }

        try {
          const level = await contract.getLevel(addr);
          result.level = Number(level);
        } catch (err: unknown) {
          const reason =
            typeof err === "object" && err !== null && ("reason" in err || "message" in err)
              ? (err as any).reason || (err as any).message
              : "unknown error";
          console.warn(`⚠️ ${addr} (level):`, reason);
        }

        try {
          const feeds = await contract.getFeedCount(addr);
          result.feeds = Number(feeds);
        } catch (err: unknown) {
          const reason =
            typeof err === "object" && err !== null && ("reason" in err || "message" in err)
              ? (err as any).reason || (err as any).message
              : "unknown error";
          console.warn(`⚠️ ${addr} (feeds):`, reason);
        }

        try {
          const missed = await contract.getMissedDays(addr);
          result.missed = Number(missed);
        } catch (err: unknown) {
          const reason =
            typeof err === "object" && err !== null && ("reason" in err || "message" in err)
              ? (err as any).reason || (err as any).message
              : "unknown error";
          console.warn(`⚠️ ${addr} (missed):`, reason);
        }

        try {
          const isDead = await contract.isBunnyDead(addr);
          result.isDead = Boolean(isDead);
        } catch (err: unknown) {
          const reason =
            typeof err === "object" && err !== null && ("reason" in err || "message" in err)
              ? (err as any).reason || (err as any).message
              : "unknown error";
          console.warn(`⚠️ ${addr} (isDead):`, reason);
        }

        // اگه هیچ دیتایی نداشت، حذفش کن
        if (
          result.baseXP === 0 &&
          result.newXP === 0 &&
          result.level === 0 &&
          result.feeds === 0 &&
          result.missed === 0
        ) {
          return null;
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

import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import abi from "../lib/bunnyAbi.json";

const contractAddress = "0x20273d97114adc750376B4180b290C418485f15A";
const provider = new ethers.JsonRpcProvider("https://carrot.megaeth.com/rpc");

const main = async () => {
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const addresses: string[] = await contract.getPlayers(0, 1000); // یا از فایل ثابت

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
    .filter(p => p.xp > 0 || p.feeds > 0)
    .sort((a, b) => b.xp - a.xp || b.level - a.level);

  const filePath = path.join(__dirname, "../public/leaderboard.json");
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2));
  console.log(`✅ Leaderboard generated (${sorted.length} players)`);
};

main().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});

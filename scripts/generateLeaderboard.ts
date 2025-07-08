require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const abi = require("../lib/bunnyAbi.json");

const contractAddress = "0x20273d97114adc750376B4180b290C418485f15A";
const rpcUrl = "https://carrot.megaeth.com/rpc";
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

// 🔐 بارگیری کلید خصوصی از .env
const privateKey = process.env.SNAPSHOT_PRIVATE_KEY;
if (!privateKey) {
  console.error("❌ SNAPSHOT_PRIVATE_KEY not found in .env");
  process.exit(1);
}

// 🧠 ساخت Signer و کانترکت با دسترسی کامل (owner)
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

const main = async () => {
  console.log("📦 Reading players from contract...");
  const addresses = await contract.getPlayers(0, 1000); // onlyOwner ✅

  console.log(`📊 Found ${addresses.length} players. Fetching stats...`);

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

  const filePath = path.join(__dirname, "../public/leaderboard.json");
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2));

  console.log(`✅ Leaderboard snapshot saved (${sorted.length} players)`);
};

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

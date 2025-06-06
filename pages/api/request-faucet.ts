import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

// Constants
const RATE_LIMIT_FILE = path.resolve("./data/rate-limit.json");
const LEVEL_AMOUNTS: Record<number, string> = {
  5: "0.02",
  4: "0.005",
  3: "0.003",
  2: "0.002",
};
const DEFAULT_AMOUNT = "0.001";
const REQUIRED_MAINNET_BALANCE = ethers.utils.parseEther("0.01");
const NFT_COOLDOWN = 24 * 60 * 60;
const DEFAULT_COOLDOWN = 24 * 60 * 60;

// Env checks
const PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const MAINNET_RPC = process.env.MAINNET_RPC_URL;

if (!PRIVATE_KEY || !NFT_CONTRACT_ADDRESS || !RECAPTCHA_SECRET_KEY || !MAINNET_RPC) {
  throw new Error("❌ Missing required environment variables.");
}

// Providers
const providerMainnet = new ethers.providers.JsonRpcProvider(MAINNET_RPC);
const providerMega = new ethers.providers.StaticJsonRpcProvider("https://carrot.megaeth.com/rpc", {
  chainId: 6342,
  name: "megaeth",
});
const faucetWallet = new ethers.Wallet(PRIVATE_KEY, providerMega);

// ABI
const NFT_ABI = [
  "function hasMintedLevel(address user, uint256 level) view returns (bool)"
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { address, captcha } = req.body;

  if (!address || !captcha) {
    return res.status(400).json({ error: "Missing address or captcha." });
  }

  // ✅ CAPTCHA
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    });
    const result = await response.json();
    if (!result.success) return res.status(400).json({ error: "Invalid CAPTCHA." });
  } catch (err) {
    return res.status(500).json({ error: "CAPTCHA verification failed." });
  }

  // ✅ NFT Check
  const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, providerMega);
  let maxLevel = 0;
  for (let i = 5; i >= 2; i--) {
    try {
      if (await nftContract.hasMintedLevel(address, i)) {
        maxLevel = i;
        break;
      }
    } catch (e) {
      console.warn(`❌ Error checking NFT level ${i}:`, e);
    }
  }

  const isHolder = maxLevel > 0;
  const amount = isHolder ? LEVEL_AMOUNTS[maxLevel] : DEFAULT_AMOUNT;
  const reason = isHolder
    ? `holding Level ${maxLevel} BunnyPunk NFT`
    : `holding ≥0.01 ETH on Ethereum Mainnet`;
  const cooldown = isHolder ? NFT_COOLDOWN : DEFAULT_COOLDOWN;

  // ✅ If no NFT: check mainnet balance
  if (!isHolder) {
    try {
      const balance = await providerMainnet.getBalance(address);
      if (balance.lt(REQUIRED_MAINNET_BALANCE)) {
        return res.status(400).json({ error: "Not enough ETH on mainnet." });
      }
    } catch (err) {
      console.error("Mainnet balance check failed:", err);
      return res.status(500).json({ error: "Mainnet balance check failed." });
    }
  }

  // ✅ Rate limiting
  let db: Record<string, number> = {};
  try {
    const raw = await fs.readFile(RATE_LIMIT_FILE, "utf-8");
    db = JSON.parse(raw);
  } catch (_) {}

  const now = Math.floor(Date.now() / 1000);
  const lastClaim = db[address] || 0;
  const nextClaimIn = cooldown - (now - lastClaim);

  if (nextClaimIn > 0) {
    const h = Math.floor(nextClaimIn / 3600);
    const m = Math.floor((nextClaimIn % 3600) / 60);
    return res.status(429).json({
      error: `⏳ Please wait ${h}h ${m}m before claiming again.`,
    });
  }

  // ✅ Faucet transaction
  let txHash = "";
  try {
    const tx = await faucetWallet.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(amount),
    });
    txHash = tx.hash;
    await tx.wait();
  } catch (err: any) {
    console.error("❌ Faucet transaction failed:", err);
    return res.status(500).json({ error: "Faucet transaction failed." });
  }

  // ✅ Save to rate-limit db
  try {
    db[address] = now;
    await fs.mkdir(path.dirname(RATE_LIMIT_FILE), { recursive: true });
    await fs.writeFile(RATE_LIMIT_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.warn("⚠️ Failed to write rate-limit db:", err);
  }

  // ✅ Success
  res.status(200).json({
    message: "✅ Faucet sent successfully!",
    amount,
    reason,
    level: maxLevel || "none",
    txHash,
    nextClaimIn: "24h 0m",
  });
}

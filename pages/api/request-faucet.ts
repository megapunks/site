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

const NFT_COOLDOWN = 24 * 60 * 60; // 24h
const DEFAULT_COOLDOWN = 24 * 60 * 60;

// Providers
const providerMainnet = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL!);
const providerMega = new ethers.providers.StaticJsonRpcProvider("https://carrot.megaeth.com/rpc", {
  chainId: 6342,
  name: "megaeth",
});

// Faucet wallet
const faucetWallet = new ethers.Wallet(process.env.FAUCET_PRIVATE_KEY!, providerMega);

// NFT Contract ABI
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT!;
const NFT_ABI = [
  "function hasMintedLevel(address user, uint256 level) view returns (bool)",
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address, captcha } = req.body;
  if (!address || !captcha) {
    return res.status(400).json({ error: "Missing address or captcha." });
  }

  // ✅ CAPTCHA Verification
  try {
    const captchaVerify = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    });

    const captchaResult = await captchaVerify.json();
    if (!captchaResult.success) {
      return res.status(400).json({ error: "Invalid CAPTCHA." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to verify CAPTCHA." });
  }

  // ✅ Check NFT Ownership
  const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, providerMega);

  let maxLevel = 0;
  for (let level = 5; level >= 2; level--) {
    try {
      const has = await nftContract.hasMintedLevel(address, level);
      if (has) {
        maxLevel = level;
        break;
      }
    } catch (err) {
      console.error(`Error checking NFT level ${level}:`, err);
    }
  }

  const isHolder = maxLevel > 0;
  const amount = isHolder ? LEVEL_AMOUNTS[maxLevel] : DEFAULT_AMOUNT;
  const cooldown = isHolder ? NFT_COOLDOWN : DEFAULT_COOLDOWN;
  const reason = isHolder
    ? `holding Level ${maxLevel} BunnyPunk NFT`
    : `holding ≥0.01 ETH on Ethereum Mainnet`;

  // ✅ If no NFT, check Mainnet ETH balance
  if (!isHolder) {
    try {
      const balance = await providerMainnet.getBalance(address);
      if (balance.lt(REQUIRED_MAINNET_BALANCE)) {
        return res.status(400).json({
          error: "Insufficient ETH on Ethereum Mainnet (min 0.01 ETH required).",
        });
      }
    } catch (err) {
      console.error("Mainnet balance check failed:", err);
      return res.status(500).json({ error: "Failed to check mainnet balance." });
    }
  }

  // ✅ Rate limiting
  let db: Record<string, number> = {};
  try {
    const data = await fs.readFile(RATE_LIMIT_FILE, "utf-8");
    db = JSON.parse(data);
  } catch (_) {
    db = {};
  }

  const now = Math.floor(Date.now() / 1000);
  const lastClaim = db[address] || 0;
  const nextClaimInSeconds = cooldown - (now - lastClaim);

  if (nextClaimInSeconds > 0) {
    const hours = Math.floor(nextClaimInSeconds / 3600);
    const minutes = Math.floor((nextClaimInSeconds % 3600) / 60);
    return res.status(429).json({
      error: `⏳ Please wait ${hours}h ${minutes}m before claiming again.`,
      nextClaimIn: `${hours}h ${minutes}m`,
    });
  }

  // ✅ Send faucet transaction
  let txHash = "";
  try {
    const tx = await faucetWallet.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(amount),
    });
    txHash = tx.hash;
    await tx.wait();
  } catch (err) {
    console.error("Faucet tx failed:", err);
    return res.status(500).json({ error: "Faucet transaction failed." });
  }

  // ✅ Update rate-limit file
  try {
    db[address] = now;
    await fs.mkdir(path.dirname(RATE_LIMIT_FILE), { recursive: true });
    await fs.writeFile(RATE_LIMIT_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.warn("Rate-limit save failed:", err);
  }

  // ✅ Done!
  res.status(200).json({
    message: `✅ Faucet sent successfully!`,
    amount,
    reason,
    level: maxLevel || "none",
    txHash,
    nextClaimIn: "24h 0m",
  });
}

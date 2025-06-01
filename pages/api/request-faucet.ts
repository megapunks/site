import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

// فایل محدودیت زمانی
const RATE_LIMIT_FILE = path.resolve("./data/rate-limit.json");

// تنظیمات فاست NFTها
const LEVEL_AMOUNTS: Record<number, string> = {
  5: "0.02",
  4: "0.005",
  3: "0.003",
  2: "0.002",
};

// حالت بدون NFT
const DEFAULT_AMOUNT = "0.001";
const REQUIRED_MAINNET_BALANCE = ethers.utils.parseEther("0.01");
const DEFAULT_COOLDOWN = 24 * 60 * 60;
const NFT_COOLDOWN = 24 * 60 * 60;

// provider برای مین‌نت و MegaETH
const providerMainnet = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL!);
const providerMega = new ethers.providers.StaticJsonRpcProvider(
  "https://carrot.megaeth.com/rpc",
  {
    chainId: 6342,
    name: "megaeth",
  }
);

// قرارداد NFT (BunnyPunkNFT)
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT!;
const NFT_ABI = [
  "function hasMintedLevel(address user, uint256 level) view returns (bool)"
];

// کیف فاست
const faucetWallet = new ethers.Wallet(process.env.FAUCET_PRIVATE_KEY!, providerMega);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address, captcha } = req.body;
  if (!address || !captcha) {
    return res.status(400).json({ error: "Missing address or captcha" });
  }

  // ✅ بررسی کپچا
  const captchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
  });
  const captchaJson = await captchaRes.json();
  if (!captchaJson.success) {
    return res.status(400).json({ error: "Invalid CAPTCHA" });
  }

  // ✅ اتصال به کانترکت NFT
  const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, providerMega);

  // بررسی بالاترین سطح NFT
  let maxLevel = 0;
  for (let level = 5; level >= 2; level--) {
    try {
      const has = await nftContract.hasMintedLevel(address, level);
      if (has) {
        maxLevel = level;
        break;
      }
    } catch (err) {
      console.error(`Error checking level ${level}:`, err);
    }
  }

  const isHolder = maxLevel > 0;
  const amount = isHolder ? LEVEL_AMOUNTS[maxLevel] : DEFAULT_AMOUNT;
  const cooldown = isHolder ? NFT_COOLDOWN : DEFAULT_COOLDOWN;

  // اگر NFT ندارد → بررسی موجودی مین‌نت
  if (!isHolder) {
    let balance;
    try {
      balance = await providerMainnet.getBalance(address);
    } catch (e) {
      console.error("Error fetching mainnet balance:", e);
      return res.status(500).json({ error: "Failed to check mainnet balance." });
    }
    if (balance.lt(REQUIRED_MAINNET_BALANCE)) {
      return res.status(400).json({ error: "Insufficient ETH balance on Ethereum Mainnet." });
    }
  }

  // ✅ بررسی rate limit
  let db: Record<string, number> = {};
  try {
    const raw = await fs.readFile(RATE_LIMIT_FILE, "utf-8");
    db = JSON.parse(raw);
  } catch (_) {}

  const lastClaim = db[address] || 0;
  const now = Math.floor(Date.now() / 1000);

  if (now - lastClaim < cooldown) {
    const mins = Math.floor((cooldown - (now - lastClaim)) / 60);
    return res.status(429).json({ error: `Please wait ${mins} minutes before trying again.` });
  }

  // ✅ ارسال تراکنش
  try {
    const tx = await faucetWallet.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(amount),
    });
    await tx.wait();
  } catch (err) {
    console.error("Faucet transaction failed:", err);
    return res.status(500).json({ error: "Faucet transaction failed." });
  }

  // ذخیره آخرین دریافت
  db[address] = now;
  await fs.mkdir(path.dirname(RATE_LIMIT_FILE), { recursive: true });
  await fs.writeFile(RATE_LIMIT_FILE, JSON.stringify(db, null, 2));

  res.status(200).json({
    message: `Faucet sent successfully! You received ${amount} MegaETH`,
    level: maxLevel || "none",
  });
}

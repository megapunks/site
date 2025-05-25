import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

// فایل برای محدودیت زمانی (cooldown)
const RATE_LIMIT_FILE = path.resolve("./data/rate-limit.json");

// تنظیمات فاست
const FAUCET_AMOUNT = "0.001"; // مقدار MegaETH برای ارسال
const REQUIRED_MAINNET_BALANCE = ethers.utils.parseEther("0.02");
const COOLDOWN_SECONDS = 48 * 60 * 60; // 48 ساعت

// provider برای اتریوم مین‌نت (از .env)
// request-faucet.ts
const providerMainnet = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL!);

// provider برای شبکه MegaETH (استاتیک برای جلوگیری از ارور)
const providerMega = new ethers.providers.StaticJsonRpcProvider(
  "https://carrot.megaeth.com/rpc",
  {
    chainId: 6342,
    name: "megaeth",
  }
);

// والت فاست از کلید خصوصی (در .env)
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

  // ✅ بررسی موجودی روی مین‌نت
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

  // ✅ بررسی rate limit
  let db: Record<string, number> = {};
  try {
    const raw = await fs.readFile(RATE_LIMIT_FILE, "utf-8");
    db = JSON.parse(raw);
  } catch (_) {
    // فایل وجود نداشته باشه مشکلی نیست
  }

  const lastClaim = db[address] || 0;
  const now = Math.floor(Date.now() / 1000);

  if (now - lastClaim < COOLDOWN_SECONDS) {
    const mins = Math.floor((COOLDOWN_SECONDS - (now - lastClaim)) / 60);
    return res.status(429).json({ error: `Please wait ${mins} minutes before trying again.` });
  }

  // ✅ ارسال تراکنش
  try {
    const tx = await faucetWallet.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(FAUCET_AMOUNT),
    });

    await tx.wait();
  } catch (err) {
    console.error("Faucet transaction failed:", err);
    return res.status(500).json({ error: "Faucet transaction failed." });
  }

  // ✅ ذخیره زمان آخرین دریافت
  db[address] = now;
  await fs.mkdir(path.dirname(RATE_LIMIT_FILE), { recursive: true });
  await fs.writeFile(RATE_LIMIT_FILE, JSON.stringify(db, null, 2));

  res.status(200).json({ message: "Faucet sent successfully!" });
}

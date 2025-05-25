// lib/provider.ts
import { ethers } from "ethers";

export const getProvider = () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("🦊 MetaMask is not available");
  }

  // ✅ استفاده از 'any' برای جلوگیری از خطای network changed
  return new ethers.providers.Web3Provider(window.ethereum, "any");
};

// lib/bunnyContract.ts
'use client';

import { ethers } from "ethers";
import abi from "./bunnyAbi.json";
import { getProvider } from "./provider";

export const contractAddress = "0xC0043f4fB8c722d121295179E44667B309B14332";

export const getBunnyContract = async (): Promise<ethers.Contract> => {
  const provider = getProvider();
  const signer = provider.getSigner();

  if (process.env.NODE_ENV === 'development') {
    try {
      console.log("📦 Contract signer:", await signer.getAddress());
    } catch (err) {
      console.warn("⚠️ Unable to get signer address:", err);
    }
  }

  return new ethers.Contract(contractAddress, abi, signer);
};
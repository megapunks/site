// lib/bunnyContract.ts
'use client';

import { ethers } from "ethers";
import abi from "./bunnyAbi.json";
import { getProvider } from "./provider";

export const contractAddress = "0x6283A608f3BBfE88B9550Ce1d3E60CD8D0AF7bC9";

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
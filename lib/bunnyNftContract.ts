// lib/bunnyNftContract.ts
'use client';

import { ethers } from "ethers";
import abi from "./bunnyNftAbi.json";
import { getProvider } from "./provider";

const contractAddress = "0x5d9624A386891957A5C5af9De6129F0d6d4Dc906";

export const getNftContract = async (): Promise<ethers.Contract> => {
  const provider = getProvider();
  const signer = provider.getSigner();

  
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log("🎨 NFT Contract signer:", await signer.getAddress());
    } catch (err) {
      console.warn("⚠️ Unable to get signer address:", err);
    }
  }

  return new ethers.Contract(contractAddress, abi, signer);
};

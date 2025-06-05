// lib/bunnyNftContract.ts
'use client';

import { ethers } from "ethers";
import abi from "./bunnyNftAbi.json";
import { getProvider } from "./provider";

const contractAddress = "0x86D4C135ef60B90350596dF4Ba220A01ac932342";

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

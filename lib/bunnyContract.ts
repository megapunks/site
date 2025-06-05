'use client';

import { ethers } from "ethers";
import abi from "./bunnyAbi.json";
import { getProvider } from "./provider";

export const contractAddress = "0xE12e419be08445E9C7eaF86E39D184a5AC7e44B3";
export const correctChainId = 6342;

export const getBunnyContract = async (): Promise<ethers.Contract> => {
  const provider = getProvider();

  // ✅ Check network
  const network = await provider.getNetwork();
  if (network.chainId !== correctChainId) {
    throw new Error("Please switch to MegaETH Testnet (chainId 6342)");
  }

  // ✅ Get signer (with fallback)
  let signer: ethers.Signer;
  try {
    signer = provider.getSigner();
    await signer.getAddress(); // test access
  } catch (err) {
    console.warn("⚠️ No signer, using read-only provider.");
    return new ethers.Contract(contractAddress, abi, provider); // fallback to read-only
  }

  return new ethers.Contract(contractAddress, abi, signer);
};

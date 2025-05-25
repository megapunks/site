// lib/bunnyContract.ts
import { ethers } from "ethers";
import abi from "./bunnyAbi.json";
import { getProvider } from "./provider";

export const contractAddress = "0x03a86b443D311aA19D9B260A46F381A428c3167f";

export const getBunnyContract = async (): Promise<ethers.Contract> => {
  const provider = getProvider();
  const signer = provider.getSigner();
  console.log("📦 Contract signer:", await signer.getAddress());
  return new ethers.Contract(contractAddress, abi, signer);
};

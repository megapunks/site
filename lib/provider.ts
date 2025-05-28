import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: import("ethers").providers.ExternalProvider;
  }
}

export const getProvider = (): ethers.providers.Web3Provider => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("🦊 MetaMask not available");
  }

  return new ethers.providers.Web3Provider(window.ethereum, "any");
};

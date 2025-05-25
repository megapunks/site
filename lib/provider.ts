import { ethers } from "ethers";

export const getProvider = () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not available");
  }

  // 👇 این خط باعث رفع خطای type میشه
  return new ethers.providers.Web3Provider(window.ethereum as any, "any");
};

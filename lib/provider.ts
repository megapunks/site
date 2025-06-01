import { ethers } from 'ethers';

export const getProvider = () => {
  if (typeof window === 'undefined') throw new Error('Window is undefined');
  return new ethers.providers.Web3Provider(window.ethereum as any);
};

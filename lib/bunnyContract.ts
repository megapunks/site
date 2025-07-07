'use client';

import { ethers } from 'ethers';
import abi from './bunnyAbi.json';
import { getProvider } from './provider';

export const contractAddress = '0x20273d97114adc750376B4180b290C418485f15A';
export const correctChainId = 6342;

export const getBunnyContract = async (): Promise<ethers.Contract> => {
  const provider = getProvider();

  // ⛓ Check network
  const network = await provider.getNetwork();
  if (network.chainId !== correctChainId) {
    throw new Error('Please switch to MegaETH Testnet (chainId 6342)');
  }

  // 🧾 Get signer if available
  let signer: ethers.Signer;
  try {
    signer = provider.getSigner();
    await signer.getAddress(); // validate access
  } catch {
    console.warn('⚠️ No signer, using read-only provider');
    return new ethers.Contract(contractAddress, abi, provider);
  }

  return new ethers.Contract(contractAddress, abi, signer);
};

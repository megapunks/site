'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const shorten = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function ConnectWalletButton() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  return isConnected ? (
    <button
      onClick={() => disconnect()}
      className="bg-yellow-300 hover:bg-yellow-200 text-black font-bold px-4 py-2 rounded transition border border-yellow-400"
    >
      {shorten(address)} ✖
    </button>
  ) : (
    <button
      onClick={() => connect({ connector: injected() })}
      className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded transition border border-yellow-500"
    >
       Connect Wallet
    </button>
  );
}

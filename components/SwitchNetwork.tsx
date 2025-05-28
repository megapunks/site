"use client";

import { useEffect, useState } from "react";

export default function SwitchNetwork() {
  const [hasEthereum, setHasEthereum] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      setHasEthereum(true);
    }
  }, []);

  const switchToMegaETH = async () => {
    if (!hasEthereum || loading || typeof window === "undefined" || !window.ethereum) return;

    setLoading(true);

    try {
      await window.ethereum?.request?.({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x18c6" }],
      });

      alert("✅ Switched to MegaETH Testnet!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum?.request?.({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x18c6",
                chainName: "MegaETH Testnet",
                nativeCurrency: {
                  name: "MegaETH",
                  symbol: "MEGA",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.megaeth.xyz"],
                blockExplorerUrls: ["https://explorer.megaeth.xyz"],
              },
            ],
          });

          alert("✅ MegaETH Testnet added!");
          setTimeout(() => window.location.reload(), 1500);
        } catch (addError) {
          console.error("⛔ Failed to add MegaETH:", addError);
        }
      } else {
        console.error("⛔ Failed to switch:", switchError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={switchToMegaETH}
      disabled={!hasEthereum || loading}
      className={`${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      } text-white px-5 py-2 rounded-lg transition`}
    >
      {loading ? "⏳ Switching..." : "🌐 Switch to MegaETH Testnet"}
    </button>
  );
}

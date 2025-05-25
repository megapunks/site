"use client"; // اگه از App Router استفاده می‌کنی

import { useEffect, useState } from "react";

export default function SwitchNetwork() {
  const [hasEthereum, setHasEthereum] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      setHasEthereum(true);
    }
  }, []);

  const switchToMegaETH = async () => {
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
      alert("🦊 MetaMask not available.");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x18c6" }],
      });

      alert("✅ Switched to MegaETH Testnet!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
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
    }
  };

  return (
    <button
      onClick={switchToMegaETH}
      disabled={!hasEthereum}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
    >
      🌐 Switch to MegaETH Testnet
    </button>
  );
}

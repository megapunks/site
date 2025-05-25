import { useEffect, useState } from "react";

export default function SwitchNetwork() {
  const [canSwitch, setCanSwitch] = useState(false);

  useEffect(() => {
    // فقط وقتی window.ethereum موجود بود، دکمه فعال باشه
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      setCanSwitch(true);
    }
  }, []);

  const switchToMegaETH = async () => {
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
      alert("❌ Please use a browser with MetaMask installed.");
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

          alert("✅ MegaETH Testnet added and switched!");
          setTimeout(() => window.location.reload(), 1500);
        } catch (addError) {
          console.error("⛔ Failed to add MegaETH:", addError);
          alert("❌ Failed to add MegaETH network.");
        }
      } else {
        console.error("⛔ Failed to switch network:", switchError);
        alert("❌ Failed to switch network.");
      }
    }
  };

  return (
    <button
      onClick={switchToMegaETH}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
      disabled={!canSwitch}
    >
      🌐 Switch to MegaETH Testnet
    </button>
  );
}

'use client';

import { useAccount } from "wagmi";
import { useState } from "react";
import PopupModal from "@/components/PopupModal";
import { isAddress } from "ethers/lib/utils";

type ModalType = {
  text: string;
  type: "success" | "error";
};

export default function WalletCheckerPage() {
  const { address, isConnected } = useAccount();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<ModalType | null>(null);

  const handleCheck = async () => {
    const targetAddress = (address || input).trim().toLowerCase();

    if (!isAddress(targetAddress)) {
      setModalMessage({
        text: "⚠️ Please enter a valid Ethereum address.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/wallet-status.json");
      const data = await res.json();

      const wl = data.whitelist.map((a: string) => a.toLowerCase());
      const fm = data.freemint.map((a: string) => a.toLowerCase());
      const gtd = data.guarantee.map((a: string) => a.toLowerCase());

      let msg: ModalType = {
        text: "😢 Sorry, this wallet is not eligible.",
        type: "error",
      };

      // اولویت: Guarantee > FreeMint > Whitelist
      if (gtd.includes(targetAddress)) {
        msg = {
          text: "✅ You have a guaranteed mint spot. You're in!",
          type: "success",
        };
      } else if (fm.includes(targetAddress)) {
        msg = {
          text: "🎁 You're eligible for a FREE mint! Well done!",
          type: "success",
        };
      } else if (wl.includes(targetAddress)) {
        msg = {
          text: "🎉 Congratulations! You are whitelisted!",
          type: "success",
        };
      }

      setModalMessage(msg);
    } catch (err) {
      console.error("Failed to fetch wallet-status.json", err);
      setModalMessage({
        text: "❌ Error loading wallet data. Please try again later.",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1e1b4b] text-yellow-100 py-12 px-4 flex flex-col items-center font-body">
      <main className="max-w-2xl w-full text-center">
        <img
          src="/bunnies/punk-checker-header.png"
          alt="Checker Banner"
          className="mx-auto mb-6 w-full max-w-[500px] h-auto"
        />

        <div className="bg-[#312e81] p-6 rounded-xl shadow-md border border-yellow-300">
          <h1 className="text-2xl mb-3 text-yellow-100">🔍 Wallet Checker</h1>
          <p className="text-xl mb-4">
            Check if your wallet is eligible for whitelist, free mint, or guaranteed mint spot.
          </p>

          {!isConnected && (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter wallet address (0x...)"
              className="w-full mb-4 px-4 py-2 text-black border border-black rounded-md focus:outline-none"
            />
          )}

          <button
            onClick={handleCheck}
            disabled={loading || (!isConnected && input.trim().length < 4)}
            className={`button-pixel w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Checking..." : "Check Wallet"}
          </button>
        </div>
      </main>

      {modalMessage && (
        <PopupModal
          message={modalMessage.text}
          type={modalMessage.type}
          onClose={() => setModalMessage(null)}
        />
      )}
    </div>
  );
}

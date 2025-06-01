'use client';

import { useAccount } from "wagmi";
import { useState } from "react";
import PopupModal from "@/components/PopupModal";

export default function WalletCheckerPage() {
  const { address, isConnected } = useAccount();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<null | {
    text: string;
    type: "success" | "error";
  }>(null);

  const handleCheck = async () => {
    const addressToCheck = (address || input).toLowerCase();
    setLoading(true);

    try {
      const res = await fetch("/wallet-status.json");
      const data = await res.json();

      const wl = data.whitelist.map((a: string) => a.toLowerCase());
      const fm = data.freemint.map((a: string) => a.toLowerCase());
      const gtd = data.guarantee.map((a: string) => a.toLowerCase());

      if (wl.includes(addressToCheck)) {
        setModalMessage({
          text: "🎉 Congratulations! You are whitelisted!",
          type: "success",
        });
      } else if (fm.includes(addressToCheck)) {
        setModalMessage({
          text: "🎁 You're eligible for a FREE mint! Well done!",
          type: "success",
        });
      } else if (gtd.includes(addressToCheck)) {
        setModalMessage({
          text: "✅ You have a guaranteed mint spot. You're in!",
          type: "success",
        });
      } else {
        setModalMessage({
          text: "😢 Sorry, this wallet is not eligible.",
          type: "error",
        });
      }
    } catch (e) {
      setModalMessage({
        text: "⚠️ Error loading status file.",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <div className="   p-6 rounded-xl shadow-md">
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto text-center fade-in">
        <img
          src="/bunnies/punk-checker-header.png"
          alt="Checker Banner"
          className="mx-auto mb-6 w-full max-w-[500px] h-auto"
        />

        <div className="bg-[#312e81] p-6 rounded-xl shadow-md border border-yellow-300">
          <h1 className="text-lg mb-3 text-yellow-100">🔍 Wallet Checker</h1>
          <p className="text-sm mb-4">
            Check if your wallet is eligible for whitelist, free mint or guaranteed mint spot.
          </p>

          {!isConnected && (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="0x..."
              className="w-full mb-4 px-4 py-2 text-black border border-black rounded-md focus:outline-none"
            />
          )}

          <button
            onClick={handleCheck}
            disabled={loading || (!isConnected && input.length < 4)}
            className="button-pixel w-full"
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

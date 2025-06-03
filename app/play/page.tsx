'use client';

import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import BunnyDisplay from "@/components/BunnyDisplay";
import FeedResult from "@/components/FeedResult";
import { getBunnyContract } from "@/lib/bunnyContract";
import FloatingItemsBackground from "@/components/FloatingItemsBackground";
import { Event, ethers } from "ethers";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [lastFed, setLastFed] = useState(0);
  const [cooldownPassed, setCooldownPassed] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{ food: string; xp: number } | null>(null);
  const [isDead, setIsDead] = useState(false); // 🆕

  const correctChainId = 6342;

  useEffect(() => {
    const switchNetworkAutomatically = async () => {
      if (typeof window === "undefined" || typeof window.ethereum === "undefined") return;
      if (chainId === correctChainId) return;

      try {
        await window.ethereum.request?.({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x18c6" }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request?.({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x18c6",
                  chainName: "MegaETH Testnet",
                  nativeCurrency: { name: "MegaETH", symbol: "MEGA", decimals: 18 },
                  rpcUrls: ["https://rpc.megaeth.xyz"],
                  blockExplorerUrls: ["https://explorer.megaeth.xyz"],
                },
              ],
            });
          } catch (err) {
            console.error("❌ Failed to add network:", err);
          }
        } else {
          console.error("❌ Failed to switch network:", switchError);
        }
      }
    };

    if (isConnected) {
      switchNetworkAutomatically();
    }
  }, [isConnected, chainId]);

  const fetchStats = async () => {
    if (!address || chainId !== correctChainId) return;
    try {
      const contract = await getBunnyContract();
      const [xpRes, levelRes, lastFedRes, isDeadRes] = await Promise.all([
        contract.getXP(address),
        contract.getLevel(address),
        contract.getLastFed(address),
        contract.isBunnyDead(address), // 🆕
      ]);

      setXP(Number(xpRes));
      setLevel(Number(levelRes));
      setLastFed(Number(lastFedRes));
      setIsDead(Boolean(isDeadRes)); // 🆕

      const now = Math.floor(Date.now() / 1000);
      const cooldown = lastFedRes === 0 || now > Number(lastFedRes) + 8 * 3600;
      setCooldownPassed(cooldown);
    } catch (err) {
      console.error("❌ Failed to fetch bunny stats:", err);
    }
  };

  const feed = async () => {
    if (!address || chainId !== correctChainId) {
      alert("Please connect your wallet and switch to MegaETH network.");
      return;
    }

    try {
      const contract = await getBunnyContract();

      const tx = await contract.feedBunny({
        value: ethers.utils.parseEther("0.0001"),
      });

      const receipt = await tx.wait();

      const event = receipt.events?.find((e: Event) => e.event === "BunnyFed");
      if (event && event.args) {
        const { food, xpGained } = event.args as any;
        setResultData({ food, xp: Number(xpGained) });
        setShowResult(true);
        fetchStats();
      }
    } catch (err: any) {
      console.error("❌ Error feeding bunny:", err);
      alert(err?.reason || err?.message || "Unknown error occurred.");
    }
  };

  const revive = async () => {
    try {
      const contract = await getBunnyContract();
      const tx = await contract.reviveBunny({
        value: ethers.utils.parseEther("0.01"),
      });
      await tx.wait();
      alert("🐰 Your bunny has been revived!");
      fetchStats();
    } catch (err: any) {
      console.error("❌ Error reviving bunny:", err);
      alert(err?.reason || err?.message || "Error reviving bunny.");
    }
  };

  useEffect(() => {
    if (isConnected && chainId === correctChainId) {
      fetchStats();
    }
  }, [address, chainId]);

  const canFeed = isConnected && chainId === correctChainId && cooldownPassed && !isDead;

  return (
    <div className="relative flex flex-col min-h-screen font-pixel text-yellow-200 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <FloatingItemsBackground />
      </div>

      <main className="relative z-10 flex-1 px-4 py-8 max-w-5xl mx-auto text-center">
        <div className="flex justify-center fade-in">
          <BunnyDisplay
            level={level}
            xp={xp}
            lastFed={lastFed}
            cooldownPassed={cooldownPassed}
            onFeed={canFeed ? feed : undefined}
            isConnected={isConnected}
          />
        </div>

        {/* 🍽️ نتیجه غذا دادن */}
        {showResult && resultData && (
          <FeedResult data={resultData} onClose={() => setShowResult(false)} />
        )}

        {/* ☠️ وضعیت مرگ خرگوش */}
        {isDead && (
          <div className="mt-10 bg-red-800/50 text-red-100 border border-red-400 rounded-xl p-6 max-w-xl mx-auto">
            <p className="text-2xl font-bold mb-4">☠️ Your bunny is dead!</p>
            <p className="mb-4 text-base">To revive it, pay <strong>0.01 ETH</strong>. Half of your XP will be restored.</p>
            <button
              onClick={revive}
              className="button-pixel bg-yellow-300 text-black px-6 py-3 border-2 border-black hover:bg-yellow-400"
            >
              💖 Revive Bunny
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

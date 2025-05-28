import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BunnyDisplay from "../components/BunnyDisplay";
import FeedResult from "../components/FeedResult";
import { getBunnyContract } from "../lib/bunnyContract";
import FloatingItemsBackground from "../components/FloatingItemsBackground";
import { Event } from "ethers";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [lastFed, setLastFed] = useState(0);
  const [cooldownPassed, setCooldownPassed] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{ food: string; xp: number } | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ address: string; xp: number; level: number }[]>([]);

  const correctChainId = 6342;

  useEffect(() => {
    const switchNetworkAutomatically = async () => {
      if (typeof window === "undefined" || !window.ethereum) return;
      if (chainId === correctChainId) return;

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x18c6" }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
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

  const shortenAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const fetchStats = async () => {
    if (!address || chainId !== correctChainId) return;
    try {
      const contract = await getBunnyContract();
      const [xpRes, levelRes, lastFedRes] = await Promise.all([
        contract.getXP(address),
        contract.getLevel(address),
        contract.getLastFed(address),
      ]);
      const xpVal = Number(xpRes);
      const lvlVal = Number(levelRes);
      const fedVal = Number(lastFedRes);

      setXP(xpVal);
      setLevel(lvlVal);
      setLastFed(fedVal);

      const now = Math.floor(Date.now() / 1000);
      const nextFeed = fedVal + 8 * 60 * 60;
      const isNewUser = fedVal === 0;

      const cooldown = isNewUser || now > nextFeed;
      setCooldownPassed(cooldown);

      console.log("📊 XP:", xpVal, "Level:", lvlVal, "Last Fed:", fedVal);
      console.log("🕒 Time Now:", now, "Next Feed Time:", nextFeed);
      console.log("✅ Cooldown Passed:", cooldown);
    } catch (err) {
      console.error("❌ Failed to fetch bunny stats:", err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const contract = await getBunnyContract();
      const players = await contract.getAllPlayers();

      const entries = await Promise.all(
        players.map(async (addr: string) => {
          const xp = await contract.getXP(addr);
          const level = await contract.getLevel(addr);
          return { address: addr, xp: Number(xp), level: Number(level) };
        })
      );

      const sorted = entries.sort((a, b) => b.xp - a.xp);
      setLeaderboard(sorted);
    } catch (err) {
      console.error("❌ Failed to load leaderboard:", err);
    }
  };

  const feed = async () => {
    if (!address || chainId !== correctChainId) {
      alert("Please connect your wallet and switch to MegaETH network.");
      return;
    }

    try {
      const contract = await getBunnyContract();
      const tx = await contract.feedBunny();
      const receipt = await tx.wait();

      const event = receipt.events?.find((e: Event) => e.event === "BunnyFed");
      if (event && event.args) {
        const { food, xpGained } = event.args as any;
        setResultData({ food, xp: Number(xpGained) });
        setShowResult(true);
        fetchStats();
        fetchLeaderboard();
      }
    } catch (err: any) {
      console.error("❌ Error feeding bunny:", err);
      alert(err?.reason || err?.message || "Unknown error occurred.");
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    if (isConnected && chainId === correctChainId) {
      fetchStats();
    }
  }, [address, chainId]);

  const canFeed = isConnected && chainId === correctChainId && cooldownPassed;

  return (
    <div className="relative flex flex-col min-h-screen font-pixel text-yellow-200 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <FloatingItemsBackground />
      </div>

      <div className="relative z-10">
        <Header />
        <main className="flex-1 px-4 py-8 max-w-5xl mx-auto text-center">
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

          {showResult && resultData && (
            <FeedResult data={resultData} onClose={() => setShowResult(false)} />
          )}

          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-yellow-100 mb-4">🏆 Leaderboard</h2>
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((user, index) => (
                <div
                  key={user.address}
                  className={`flex justify-between items-center px-4 py-3 rounded-lg border text-sm ${
                    user.address === address
                      ? "bg-yellow-100 text-black border-yellow-300"
                      : "bg-[#312e81] border-yellow-500"
                  }`}
                >
                  <div className="font-bold">#{index + 1}</div>
                  <div className="font-mono">{shortenAddress(user.address)}</div>
                  <div>XP: {user.xp}</div>
                  <div className="text-yellow-300 font-bold">Lvl {user.level}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

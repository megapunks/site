"use client";

import { useEffect, useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { getBunnyContract } from "@/lib/bunnyContract";
import { getNftContract } from "@/lib/bunnyNftContract";
import Image from "next/image";
import toast from "react-hot-toast";

const MINT_LEVELS = [
  { level: 1, xpRange: "0-249", image: "/bunnies/level-1.png" },
  { level: 2, xpRange: "250-499", image: "/bunnies/level-2.png" },
  { level: 3, xpRange: "500-899", image: "/bunnies/level-3.png" },
  { level: 4, xpRange: "900-1499", image: "/bunnies/level-4.png" },
  { level: 5, xpRange: "1500+", image: "/bunnies/level-5.png" },
];

export default function MintPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [userXP, setUserXP] = useState<number>(0);
  const [mintedLevels, setMintedLevels] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const isCorrectNetwork = chainId === 6342;

  useEffect(() => {
    const fetchData = async () => {
      if (!address || !isCorrectNetwork) return;
      setLoading(true);
      try {
        const xpContract = await getBunnyContract();
        const nftContract = await getNftContract();

        const xp = await xpContract.getXP(address);
        setUserXP(Number(xp));

        const minted: boolean[] = await Promise.all(
          MINT_LEVELS.map(({ level }) => nftContract.hasMintedLevel(address, level))
        );

        const mintedLevelsArr = MINT_LEVELS.filter((_, i) => minted[i]).map((m) => m.level);
        setMintedLevels(mintedLevelsArr);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
      setLoading(false);
    };

    fetchData();
  }, [address, chainId]);

  const handleMint = async (level: number) => {
    if (!address) return;
    if (!isCorrectNetwork) {
      toast.error("Please switch to MegaETH Testnet");
      switchChain?.({ chainId: 6342 });
      return;
    }

    try {
      const nftContract = await getNftContract();
      const xpContract = await getBunnyContract();

      const [xp, alreadyMinted] = await Promise.all([
        xpContract.getXP(address),
        nftContract.hasMintedLevel(address, level),
      ]);

      const xpValue = Number(xp);
      const xpRequirements: Record<number, number> = {
        1: 0,
        2: 100,
        3: 250,
        4: 500,
        5: 900,
      };

      if (alreadyMinted) {
        toast.error("You've already minted this level.");
        return;
      }

      if (xpValue < xpRequirements[level]) {
        toast.error("You need more XP to mint this level.");
        return;
      }

      const ipfsHashes: Record<number, string> = {
        1: "bafkreicwghzhppuntlt4aimsrn6yzceqptaq5oacqgusksrn5kxmf47jry",
        2: "bafkreic4pxauosicpjjklh6a7wod5ayde6lpftao4xrwsvsorynzbzhsxa",
        3: "bafkreiaf2xegvp5na5mf525dq7i5kvwsowxz2ha7r6roknpdxzvuizyrwi",
        4: "bafkreiftnxz5uit6ys2mewtry6hbhedmyar3n6dmxahocfldsw2nygbfua",
        5: "bafkreictn445z67hp4x75sia27wpaimelyzp2gxrl4zyavobc3hscznd7e",
      };

      const tokenUri = `ipfs://${ipfsHashes[level]}`;
      const tx = await nftContract.mintNFT(level, tokenUri);
      await tx.wait();

      toast.success("✅ Mint successful!");
    } catch (err) {
      toast.error("❌ Mint failed");
      console.error("Mint Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1b4b] text-yellow-200 font-pixel py-10 px-4">
      <h1 className="text-3xl text-center mb-8">🐰 Mint Your BunnyPunk NFT 🐰 </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {MINT_LEVELS.map(({ level, xpRange, image }) => {
          const isUnlocked = userXP >= (level === 1 ? 0 : level === 2 ? 100 : level === 3 ? 250 : level === 4 ? 500 : 900);
          const alreadyMinted = mintedLevels.includes(level);
          const disabled = !isUnlocked || alreadyMinted;

          return (
            <div
              key={level}
              className={`rounded-xl border p-6 flex flex-col items-center bg-[#312e81] border-yellow-300 shadow-md transition-all card-animate ${disabled ? "opacity-50 grayscale" : ""}`}
            >
              <Image src={image} alt={`Level ${level}`} width={200} height={200} />
              <h2 className="mt-4 text-2xl text-yellow-100">Level {level}</h2>
              <p className="text-lg text-yellow-300 mb-3">XP: {xpRange}</p>
              <button
                onClick={() => handleMint(level)}
                disabled={disabled}
                className="button-pixel px-6 py-2 mt-2 text-lg"
              >
                {alreadyMinted ? "Already Minted" : isUnlocked ? "Mint" : "Locked"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

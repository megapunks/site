'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount, useChainId } from 'wagmi';
import { getBunnyContract } from '@/lib/bunnyContract';
import { getCollabNFTContract } from '@/lib/collabNFTContract';

type Task = 'discord' | 'follow1' | 'follow2' | 'like_rt';

const TASKS: Record<Task, {
  label: string;
  url: string;
  taskId: string;
  taskType: string;
  icon: string;
  xp: number;
}> = {
  discord: {
    label: "💬 Join Discord +20 XP",
    url: "https://discord.gg/ZsKZD3XrKg",
    taskId: "discord-join",
    taskType: "discord",
    icon: "💬",
    xp: 20,
  },
  follow1: {
    label: "⭐ Follow MegaPunks +10 XP",
    url: "https://x.com/Megaeth_Punks",
    taskId: "follow-task-1",
    taskType: "follow",
    icon: "⭐",
    xp: 10,
  },
  follow2: {
    label: "⭐ Follow Artist +10 XP",
    url: "https://x.com/ArtistHandle",
    taskId: "follow-nft-2",
    taskType: "follow",
    icon: "⭐",
    xp: 10,
  },
  like_rt: {
    label: "🔁 Like & RT +20 XP",
    url: "https://x.com/Megaeth_Punks/status/123",
    taskId: "rt-nft",
    taskType: "likeRT",
    icon: "🔁",
    xp: 20,
  },
};

export default function NFTClaimPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const correctChainId = 6342;

  const [taskStates, setTaskStates] = useState<Record<Task, 'idle' | 'waiting' | 'ready' | 'done'>>(() =>
    Object.fromEntries(Object.keys(TASKS).map(key => [key, 'idle'])) as any
  );

  const [timers, setTimers] = useState<Record<Task, number>>(() =>
    Object.fromEntries(Object.keys(TASKS).map(key => [key, 0])) as any
  );

  const [totalXP, setTotalXP] = useState(0);
  const [nftClaimed, setNFTClaimed] = useState(false);
  const [activeTokenId, setActiveTokenId] = useState<number | null>(null);

  const allTasksCompleted = Object.values(taskStates).every(state => state === 'done');

  // 🚀 Load everything together
  useEffect(() => {
    if (!isConnected || chainId !== correctChainId || !address) return;

    const load = async () => {
      try {
        const bunny = await getBunnyContract();
        const nft = await getCollabNFTContract();

        // Fetch XP
        const xp = await bunny.getXP(address);
        setTotalXP(Number(xp));

        // Fetch claimed tasks
        const claimedStates: Record<Task, 'done' | 'idle'> = {} as any;
        for (const key of Object.keys(TASKS) as Task[]) {
          const task = TASKS[key];
          const claimed = await bunny.hasClaimedTask(address, ethers.utils.id(task.taskId));
          claimedStates[key] = claimed ? 'done' : 'idle';
        }
        setTaskStates(claimedStates);

        // Fetch active token ID
        const id = await nft.activeTokenId();
        setActiveTokenId(Number(id));

        // Check if NFT already claimed
        const balance = await nft.balanceOf(address, Number(id));
        setNFTClaimed(Number(balance) > 0);
      } catch (err) {
        console.error("❌ Failed to load data", err);
      }
    };

    load();
  }, [address, isConnected, chainId]);

  // ⏱ Timer for task confirmation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };
        for (const key in prev) {
          if (taskStates[key as Task] === 'waiting' && prev[key as Task] > 0) {
            updated[key as Task] -= 1;
            if (updated[key as Task] <= 0) {
              setTaskStates(s => ({ ...s, [key as Task]: 'ready' }));
            }
          }
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [taskStates]);

  // 🔗 Open task link
  const openTask = (key: Task) => {
    window.open(TASKS[key].url, '_blank');
    setTaskStates(prev => ({ ...prev, [key]: 'waiting' }));
    setTimers(prev => ({ ...prev, [key]: 30 }));
  };

  // ✅ Claim XP for a task
  const claimTask = async (key: Task) => {
    try {
      const contract = await getBunnyContract();
      const task = TASKS[key];
      await contract.claimTask(ethers.utils.id(task.taskId), task.taskType, {
        value: ethers.utils.parseEther("0.000001"),
      });
      setTaskStates(prev => ({ ...prev, [key]: 'done' }));
      setTotalXP(prev => prev + task.xp);
    } catch (err: any) {
      alert(err?.reason || err?.message || '❌ Failed to claim XP.');
    }
  };

  // 🎁 Claim NFT
  const claimNFT = async () => {
    if (!allTasksCompleted || nftClaimed || activeTokenId === null) {
      return alert("👀 Complete all tasks or already claimed.");
    }
    try {
      const contract = await getCollabNFTContract();
      const tx = await contract.claim(activeTokenId);
      await tx.wait();
      setNFTClaimed(true);
      alert("✅ NFT Claimed!");
    } catch (err: any) {
      alert(err?.reason || err?.message || '❌ Failed to claim NFT.');
    }
  };

  return (
    <div className="min-h-screen font-pixel text-yellow-200 bg-[#1e1b4b]">
      <div className="w-full bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-800 h-12 overflow-hidden relative">
        <div className="absolute whitespace-nowrap animate-marquee text-white font-bold text-xl px-4">
          🤝 Community Collabs: Complete partner quests, earn XP & claim limited NFTs – Powered by MegaPunks on MegaETH!

        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl mb-4 text-center">🎁 Claim Your MegaPunks Partner NFT 🎁</h1>

        <div className="flex justify-between items-center my-6 px-2 text-lg text-yellow-100 font-bold">
          <div>📈 Your XP: <span className="text-green-300">{totalXP}</span></div>
          <div>🕒 Tasks must be completed before: <span className="text-red-300">Jun 10, 2025</span></div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#312e81] border-4 border-yellow-300 rounded-xl p-6 flex flex-col items-center">
            <img src="/nfts/1155-1.png" alt="NFT Preview" className="w-full mb-4 rounded-lg max-w-sm" />
            <button
              onClick={claimNFT}
              disabled={!allTasksCompleted || nftClaimed || activeTokenId === null}
              className={`button-pixel px-6 py-3 border-2 border-black ${
                allTasksCompleted && !nftClaimed
                  ? "bg-green-500 hover:bg-green-400 text-black"
                  : "bg-gray-700 text-white cursor-not-allowed"
              }`}
            >
              {nftClaimed ? "✅ Already Claimed" : "🎁 Claim NFT"}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {(Object.keys(TASKS) as Task[]).map((key) => {
              const task = TASKS[key];
              const state = taskStates[key];

              return (
                <div key={key} className="bg-[#1e1b4b] border border-yellow-300 rounded-lg p-4">
                  <p className="text-lg">{task.icon} {task.label}</p>
                  <div className="mt-2">
                    {state === 'idle' && (
                      <button
                        onClick={() => openTask(key)}
                        className="button-pixel bg-yellow-300 text-black hover:bg-yellow-400 px-4 py-2"
                      >
                        🔗 Start Task
                      </button>
                    )}
                    {state === 'waiting' && (
                      <span className="text-sm text-yellow-100">⏳ Wait {timers[key]}s...</span>
                    )}
                    {state === 'ready' && (
                      <button
                        onClick={() => claimTask(key)}
                        className="button-pixel bg-green-500 text-black hover:bg-green-400 px-4 py-2"
                      >
                        ✅ Claim XP
                      </button>
                    )}
                    {state === 'done' && (
                      <span className="text-green-300 text-sm">✅ Done</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

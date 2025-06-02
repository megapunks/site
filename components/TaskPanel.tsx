'use client';

import { useState, useEffect, useMemo } from "react";
import { getBunnyContract } from "@/lib/bunnyContract";
import { ethers } from "ethers";

interface Props {
  userStats: {
    level: number;
    xp: number;
  };
  isGuest?: boolean;
}

type TaskType = "weekly" | "monthly" | "daily_1" | "daily_2" | "daily_3";

const TASKS: { [key in TaskType]: { label: string; promoId?: string; url: string; icon: string; type: "weekly" | "monthly" | "daily" } } = {
  weekly: {
    label: "📤 Share Profile on Twitter +25 XP",
    url: "https://twitter.com/intent/tweet?text=",
    icon: "📤",
    type: "weekly",
  },
  monthly: {
    label: "💬 Join Discord +50 XP",
    promoId: "monthly-discord",
    url: "https://discord.gg/ZsKZD3XrKg",
    icon: "💬",
    type: "monthly",
  },
  daily_1: {
    label: "Follow us +10 XP",
    promoId: "daily-task-1",
    url: "https://x.com/Megaeth_Punks",
    icon: "🔁",
    type: "daily",
  },
  daily_2: {
    label: "🔁 Like & Retweet +10 XP",
    promoId: "daily-task-2",
    url: "https://x.com/Megaeth_Punks/status/1928481622954774642",
    icon: "🔁",
    type: "daily",
  },
  daily_3: {
    label: "🔁 Like & Retweet +10 XP",
    promoId: "daily-task-3",
    url: "https://x.com/Megaeth_Punks/status/1927096388417892806",
    icon: "🔁",
    type: "daily",
  },
};

export default function TaskPanel({ userStats, isGuest = false }: Props) {
  const [taskState, setTaskState] = useState<{ [key in TaskType]: "idle" | "waiting" | "ready" | "done" }>(() => {
    const initial: any = {};
    Object.keys(TASKS).forEach((k) => (initial[k as TaskType] = "idle"));
    return initial;
  });

  const [taskTimer, setTaskTimer] = useState<{ [key in TaskType]: number }>(() => {
    const initial: any = {};
    Object.keys(TASKS).forEach((k) => (initial[k as TaskType] = 0));
    return initial;
  });

  const taskKeys = useMemo(() => Object.keys(TASKS) as TaskType[], []);

  const itemHeight = useMemo(() => {
    const totalHeight = 475;
    const gap = 16 * (taskKeys.length - 1);
    const available = totalHeight - gap;
    return Math.floor(available / taskKeys.length) + 12;
  }, [taskKeys.length]);

  useEffect(() => {
    if (isGuest) return;

    const init = async () => {
      const contract = await getBunnyContract();
      const signer = await contract.signer.getAddress();

      const now = Math.floor(Date.now() / 1000);
      const lastTweet = await contract.lastTweetTime(signer);
      if (now < lastTweet + 7 * 24 * 60 * 60) {
        setTaskState((prev) => ({ ...prev, weekly: "done" }));
      }

      for (const [key, task] of Object.entries(TASKS)) {
        if (task.promoId) {
          const claimed = await contract.promoClaimed(signer, ethers.utils.id(task.promoId));
          if (claimed) {
            setTaskState((prev) => ({ ...prev, [key]: "done" }));
          }
        }
      }
    };

    init();
  }, [isGuest]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaskTimer((prev) => {
        const newTimers = { ...prev };
        taskKeys.forEach((task) => {
          if (taskState[task] === "waiting" && newTimers[task] > 0) {
            newTimers[task] -= 1;
            if (newTimers[task] <= 0) {
              setTaskState((prevState) => ({ ...prevState, [task]: "ready" }));
            }
          }
        });
        return newTimers;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [taskState]);

  const startTask = (task: TaskType) => {
    const taskData = TASKS[task];
    if (!taskData) return;

    if (task === "weekly") {
      const tweetText = `🐰 My bunny in @Megaeth_Punks is Level ${userStats.level} with ${userStats.xp} XP — a Web3 on-chain bunny battle game!

Join the battle, feed your bunny, earn XP and climb the leaderboard!

🎮 Play now: https://megapunks.org/play
@megaeth_labs #MegaPunks #NFTs #Web3Gaming`;
      const tweetUrl = `${taskData.url}${encodeURIComponent(tweetText)}`;
      window.open(tweetUrl, "_blank");
    } else {
      window.open(taskData.url, "_blank");
    }

    setTaskState((prev) => ({ ...prev, [task]: "waiting" }));
    setTaskTimer((prev) => ({ ...prev, [task]: 60 }));
  };

  const handleClaim = async (task: TaskType) => {
    if (isGuest) return alert("🔐 Connect wallet to claim XP");

    const contract = await getBunnyContract();

    try {
      if (task === "weekly") {
        await contract.claimTweetReward();
        alert("✅ Weekly XP claimed!");
      } else {
        const promoId = TASKS[task]?.promoId;
        if (promoId) {
          await contract.claimLinkReward(ethers.utils.id(promoId));
          alert(`✅ ${TASKS[task]?.label} claimed!`);
        }
      }
      setTaskState((prev) => ({ ...prev, [task]: "done" }));
    } catch (err) {
      console.error(err);
      alert("⚠️ Error claiming task");
    }
  };

  const renderTask = (task: TaskType) => {
    const data = TASKS[task];
    const state = taskState[task];
    const heightClass = `h-[${itemHeight}px]`;

    const baseClass = `w-full px-4 rounded-md transition-all text-xl md:text-xl font-semibold ${heightClass}`;

    if (state === "idle") {
      return (
        <button
          onClick={() => startTask(task)}
          className={`${baseClass} bg-yellow-400 text-black hover:bg-yellow-300`}
        >
          {data?.label}
        </button>
      );
    }

    if (state === "waiting") {
      return (
        <div className={`flex items-center justify-center text-yellow-200 text-xl ${heightClass}`}>
          ⏳ Wait {taskTimer[task]}s for {data?.label}...
        </div>
      );
    }

    if (state === "ready") {
      return (
        <button
          onClick={() => handleClaim(task)}
          className={`${baseClass} bg-green-500 text-black hover:bg-green-400`}
        >
          ✅ Claim {data?.label}
        </button>
      );
    }

    if (state === "done") {
      return (
        <button
          disabled
          className={`${baseClass} bg-gray-700 text-gray-300 cursor-not-allowed`}
        >
          ⛔ {data?.label} (Done)
        </button>
      );
    }

    return null;
  };

  return (
    <div className="bg-[#1e1b4b] border border-yellow-300 rounded-xl p-8 text-center text-yellow-100 w-full max-w-sm mx-auto min-h-[580px]">
      <h3 className="text-2xl font-bold mb-4 text-yellow-300">📌 Tasks</h3>

      <div className="flex flex-col gap-4">
        {taskKeys.map((key) => (
          <div key={key}>{renderTask(key)}</div>
        ))}
      </div>
    </div>
  );
}

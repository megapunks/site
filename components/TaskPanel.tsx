'use client';

import { useState, useEffect } from "react";
import { getBunnyContract } from "@/lib/bunnyContract";
import { ethers } from "ethers";

type TaskType = "profile_share" | "discord" | "follow1" | "follow2" | "like_rt2" | "like_rt3" | "like_rt4" | "like_rt5" ;

const TASKS: Record<TaskType, {
  label: string;
  taskId: string;
  taskType: string;
  url: string;
  icon: string;
  xp: number;
}> = {
  profile_share: {
    label: "📤 Share Profile +25 XP",
    taskId: "task-profile-share",
    taskType: "share",
    url: "", // dynamic
    icon: "📤",
    xp: 25,
  },
  discord: {
    label: "💬 Join Discord +20 XP",
    taskId: "discord-join",
    taskType: "discord",
    url: "https://discord.gg/ZsKZD3XrKg",
    icon: "💬",
    xp: 20,
  },
  follow1: {
    label: "⭐ Follow us +10 XP",
    taskId: "follow-task-1",
    taskType: "follow",
    url: "https://x.com/Megaeth_Punks",
    icon: "⭐",
    xp: 10,
  },
  follow2: {
    label: "⭐ Follow Our Support +10 XP",
    taskId: "follow-task-2",
    taskType: "follow",
    url: "https://x.com/megapunksupport",
    icon: "⭐",
    xp: 10,
  },
  like_rt2: {
    label: "🔁 Like & RT +20 XP",
    taskId: "rt-task-2",
    taskType: "likeRT",
    url: "https://x.com/Megaeth_Punks/status/1928481622954774642",
    icon: "🔁",
    xp: 20,
  },
  like_rt3: {
    label: "🔁 Like & RT +20 XP",
    taskId: "rt-task-3",
    taskType: "likeRT",
    url: "https://x.com/Megaeth_Punks/status/1931007917035008045",
    icon: "🔁",
    xp: 20,
  },
  like_rt4: {
    label: "🔁 Like & RT +20 XP",
    taskId: "rt-task-4",
    taskType: "likeRT",
    url: "https://x.com/Megaeth_Punks/status/1931717958444720391",
    icon: "🔁",
    xp: 20,
  },
like_rt5: {
    label: "🔁 Like & RT +20 XP",
    taskId: "rt-task-5",
    taskType: "likeRT",
    url: "https://x.com/Megaeth_Punks/status/1933171869982638228",
    icon: "🔁",
    xp: 20,
  },
};

export default function TaskPanel({
  userStats,
  isGuest = false,
}: {
  userStats: { level: number; xp: number };
  isGuest?: boolean;
}) {
  const [taskStates, setTaskStates] = useState<Record<TaskType, 'idle' | 'waiting' | 'ready' | 'done'>>(() =>
    Object.fromEntries(Object.keys(TASKS).map(key => [key, 'idle'])) as any
  );
  const [timers, setTimers] = useState<Record<TaskType, number>>(() =>
    Object.fromEntries(Object.keys(TASKS).map(key => [key, 0])) as any
  );

  useEffect(() => {
    if (isGuest) return;

    const init = async () => {
      try {
        const contract = await getBunnyContract();
        const signer = await contract.signer.getAddress();

        const updatedStates = { ...taskStates };

        for (const key of Object.keys(TASKS) as TaskType[]) {
          const task = TASKS[key];
          const claimed = await contract.hasClaimedTask(signer, ethers.utils.id(task.taskId));
          if (claimed) updatedStates[key] = "done";
        }

        setTaskStates(updatedStates);
      } catch (err) {
        console.error("Error loading task states:", err);
      }
    };

    init();
  }, [isGuest]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };
        for (const key in prev) {
          const typedKey = key as TaskType;
          if (taskStates[typedKey] === 'waiting' && prev[typedKey] > 0) {
            updated[typedKey] -= 1;
            if (updated[typedKey] <= 0) {
              setTaskStates(s => ({ ...s, [typedKey]: 'ready' }));
            }
          }
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [taskStates]);

  const openTask = (key: TaskType) => {
    const task = TASKS[key];

    let url = task.url;
    if (key === "profile_share") {
      const tweet = `🐰 My Bunny in @Megaeth_Punks is Level ${userStats.level} with ${userStats.xp} XP!\nJoin the battle & earn XP!\n🎮 Play now: https://megapunks.org/play #MegaPunks #Web3Gaming`;
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    }

    window.open(url, '_blank');
    setTaskStates(prev => ({ ...prev, [key]: 'waiting' }));
    setTimers(prev => ({ ...prev, [key]: 30 }));
  };

  const claimTask = async (key: TaskType) => {
    try {
      const contract = await getBunnyContract();
      const task = TASKS[key];

      if (key === "profile_share") {
        await contract.claimProfileShare({ value: ethers.utils.parseEther("0.000001") });
      } else {
        await contract.claimTask(ethers.utils.id(task.taskId), task.taskType, {
          value: ethers.utils.parseEther("0.000001")
        });
      }

      setTaskStates(prev => ({ ...prev, [key]: 'done' }));
    } catch (err: any) {
      alert(err?.reason || err?.message || "❌ Error claiming XP.");
    }
  };

  return (
    <div className="bg-[#1e1b4b] border border-yellow-300 rounded-xl p-6 w-full max-w-sm mx-auto h-[580px] flex flex-col">
      <h3 className="text-xl text-yellow-300 font-bold mb-4 text-center">📌 Tasks</h3>
      <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-500">
        {(Object.keys(TASKS) as TaskType[]).map((key) => {
          const state = taskStates[key];
          const task = TASKS[key];
          const base = "w-full py-2 px-4 rounded-md font-bold text-sm transition-all duration-300";

          if (state === "done") {
            return (
              <button key={key} disabled className={`${base} bg-gray-700 text-gray-300 cursor-not-allowed`}>
                ✅ {task.label} (Done)
              </button>
            );
          }

          if (state === "idle") {
            return (
              <button key={key} onClick={() => openTask(key)} className={`${base} bg-yellow-400 text-black hover:bg-yellow-300`}>
                {task.label}
              </button>
            );
          }

          if (state === "waiting") {
            return (
              <div key={key} className={`${base} bg-purple-600 text-white text-center`}>
                ⏳ Please wait {timers[key]}s...
              </div>
            );
          }

          if (state === "ready") {
            return (
              <button key={key} onClick={() => claimTask(key)} className={`${base} bg-green-500 text-black hover:bg-green-400`}>
                ✅ Claim {task.label}
              </button>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

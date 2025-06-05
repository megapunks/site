'use client';

import { useState, useEffect } from "react";
import { getBunnyContract } from "@/lib/bunnyContract";
import { ethers } from "ethers";

interface Props {
  userStats: {
    level: number;
    xp: number;
  };
  isGuest?: boolean;
}

type TaskType = "weekly" | "discord" | "daily_1" | "daily_2" | "daily_3";

const TASKS: Record<TaskType, {
  label: string;
  taskId?: string;
  taskType?: string;
  url: string;
  icon: string;
}> = {
  weekly: {
    label: "📤 Share Profile +25 XP",
    url: "",
    icon: "📤",
  },
  discord: {
    label: "💬 Join Discord +20 XP",
    taskId: "discord-join",
    taskType: "discord",
    url: "https://discord.gg/ZsKZD3XrKg",
    icon: "💬",
  },
  daily_1: {
    label: "⭐ Follow us +10 XP",
    taskId: "follow-task-1",
    taskType: "follow",
    url: "https://x.com/Megaeth_Punks",
    icon: "⭐",
  },
  daily_2: {
    label: "🔁 Like & RT +20 XP",
    taskId: "rt-task-1",
    taskType: "likeRT",
    url: "https://x.com/Megaeth_Punks/status/1930188883574014357",
    icon: "🔁",
  },
  daily_3: {
    label: "🔁 Like & RT +20 XP",
    taskId: "rt-task-2",
    taskType: "likeRT",
    url: "https://x.com/Megaeth_Punks/status/1928481622954774642",
    icon: "🔁",
  },
};

export default function TaskPanel({ userStats, isGuest = false }: Props) {
  const [taskStates, setTaskStates] = useState<Record<TaskType, "idle" | "waiting" | "ready" | "done">>(() => {
    const state: any = {};
    Object.keys(TASKS).forEach((k) => state[k as TaskType] = "idle");
    return state;
  });

  const [timers, setTimers] = useState<Record<TaskType, number>>(() => {
    const state: any = {};
    Object.keys(TASKS).forEach((k) => state[k as TaskType] = 0);
    return state;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        (Object.keys(prev) as TaskType[]).forEach((key) => {
          if (taskStates[key] === "waiting" && prev[key] > 0) {
            updated[key] = prev[key] - 1;
            if (updated[key] <= 0) {
              setTaskStates((prevState) => ({ ...prevState, [key]: "ready" }));
            }
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [taskStates]);

  useEffect(() => {
    if (isGuest) return;

    const init = async () => {
      const contract = await getBunnyContract();
      const signer = await contract.signer.getAddress();

      const lastShare = await contract.lastShareProfileTime(signer);
      if (Date.now() / 1000 < Number(lastShare) + 7 * 24 * 60 * 60) {
        setTaskStates((prev) => ({ ...prev, weekly: "done" }));
      }

      for (const key of Object.keys(TASKS) as TaskType[]) {
        const task = TASKS[key];
        if (task.taskId) {
          const claimed = await contract.hasClaimedTask(signer, ethers.utils.id(task.taskId));
          if (claimed) {
            setTaskStates((prev) => ({ ...prev, [key]: "done" }));
          }
        }
      }
    };

    init();
  }, [isGuest]);

  const openTaskLink = (task: TaskType) => {
    const taskData = TASKS[task];
    if (!taskData) return;

    let url = taskData.url;

    if (task === "weekly") {
      const tweetText = `🐰 My Bunny in @Megaeth_Punks is Level ${userStats.level} with ${userStats.xp} XP!
Join the battle, feed your bunny, earn XP, and climb the leaderboard!
🎮 Play now: https://megapunks.org/play
#MegaPunks #Web3Gaming`;

      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    }

    window.open(url, "_blank");

    setTaskStates((prev) => ({ ...prev, [task]: "waiting" }));
    setTimers((prev) => ({ ...prev, [task]: 30 }));
  };

  const claimXP = async (task: TaskType) => {
    try {
      const contract = await getBunnyContract();
      const txOpts = { value: ethers.utils.parseEther("0.000001") };

      if (task === "weekly") {
        await contract.claimProfileShare(txOpts);
      } else {
        const t = TASKS[task];
        if (!t.taskId || !t.taskType) throw new Error("Invalid task");

        await contract.claimTask(ethers.utils.id(t.taskId), t.taskType, txOpts);
      }

      setTaskStates((prev) => ({ ...prev, [task]: "done" }));
    } catch (err: any) {
      console.error(err);
      alert(err?.reason || err?.message || "❌ Error claiming XP.");
    }
  };

  const renderTaskButton = (task: TaskType) => {
    const state = taskStates[task];
    const label = TASKS[task].label;

    const base = "w-full py-2 px-4 rounded-md font-bold transition-all duration-300 text-sm";

    if (state === "idle") {
      return (
        <button
          onClick={() => openTaskLink(task)}
          className={`${base} bg-yellow-400 text-black hover:bg-yellow-300`}
        >
          {label}
        </button>
      );
    }

    if (state === "waiting") {
      return (
        <div className={`${base} bg-purple-600 text-white text-center`}>
          ⏳ Please wait {timers[task]}s...
        </div>
      );
    }

    if (state === "ready") {
      return (
        <button
          onClick={() => claimXP(task)}
          className={`${base} bg-green-500 text-black hover:bg-green-400`}
        >
          ✅ Claim {label}
        </button>
      );
    }

    if (state === "done") {
      return (
        <button
          disabled
          className={`${base} bg-gray-700 text-gray-300 cursor-not-allowed`}
        >
          ✅ {label} (Done)
        </button>
      );
    }

    return null;
  };

  return (
    <div className="bg-[#1e1b4b] border border-yellow-300 rounded-xl p-6 w-full h-[580px] max-w-sm mx-auto flex flex-col">
      <h3 className="text-xl text-yellow-300 font-bold mb-4 text-center">📌 Tasks</h3>

      <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-500">
        {(Object.keys(TASKS) as TaskType[]).map((key) => (
          <div key={key}>{renderTaskButton(key)}</div>
        ))}
      </div>
    </div>
  );
}

'use client';

import Image from "next/image";
import React from "react";

interface Props {
  level: number;
  xp: number;
  feeds: number;
  missed: number;
  rank: number;
  address: string;
}

const LEVEL_IMAGES: Record<number, string> = {
  1: "/bunnies/level1.png",
  2: "/bunnies/level2.png",
  3: "/bunnies/level3.png",
  4: "/bunnies/level4.png",
  5: "/bunnies/level5.png",
};

export default function UserCardVisual({ level, xp, feeds, missed, rank, address }: Props) {
  const imageSrc = LEVEL_IMAGES[level] || LEVEL_IMAGES[1];
  const maskAddress = (a: string) => a.slice(0, 6) + "..." + a.slice(-4);

  const maxXP = level === 1 ? 249 : level === 2 ? 499 : level === 3 ? 899 : level === 4 ? 1499 : 2000;
  const xpProgress = Math.min((xp / maxXP) * 100, 100);
  const feedsProgress = Math.min((feeds / 10) * 100, 100);
  const missedProgress = Math.max(0, 100 - Math.min(missed * 10, 100));
  const rankProgress = Math.max(0, 100 - (rank - 1) * 2);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 font-pixel text-yellow-100 animate-fade-in">
      <div className="flex flex-wrap justify-center gap-8 items-center mb-8">
        <div className="flex flex-col gap-4 w-[220px]">
          <div className="border border-yellow-300 rounded-2xl p-4 text-center shadow-inner bg-[#1e1b4b]">
            <div className="text-yellow-300 text-sm"><span className="emoji-glow">💎</span> Rank</div>
            <div className="text-2xl font-bold">#{rank}</div>
            <div className="w-full h-3 bg-white rounded-full mt-3 overflow-hidden">
              <div className="h-3 bg-yellow-400 rounded-full transition-all" style={{ width: `${rankProgress}%` }} />
            </div>
          </div>

          <div className="border border-yellow-300 rounded-2xl p-4 text-center shadow-inner bg-[#1e1b4b]">
            <div className="text-yellow-300 text-sm"><span className="emoji-glow">💥</span> XP</div>
            <div className="text-2xl font-bold">{xp}</div>
            <div className="w-full h-3 bg-white rounded-full mt-3 overflow-hidden">
              <div className="h-3 bg-yellow-400 rounded-full transition-all" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="relative w-[240px] h-[240px]">
          <Image src={imageSrc} alt="Bunny Level" fill className="object-contain" />
        </div>

        <div className="flex flex-col gap-4 w-[220px]">
          <div className="border border-yellow-300 rounded-2xl p-4 text-center shadow-inner bg-[#1e1b4b]">
            <div className="text-yellow-300 text-sm"><span className="emoji-blink">🥕</span> Feeds</div>
            <div className="text-2xl font-bold">{feeds}</div>
            <div className="w-full h-3 bg-white rounded-full mt-3 overflow-hidden">
              <div className="h-3 bg-yellow-400 rounded-full transition-all" style={{ width: `${feedsProgress}%` }} />
            </div>
          </div>

          <div className="border border-yellow-300 rounded-2xl p-4 text-center shadow-inner bg-[#1e1b4b]">
            <div className="text-yellow-300 text-sm"><span className="emoji-wiggle">😟</span> Missed</div>
            <div className="text-2xl font-bold">{missed}</div>
            <div className="w-full h-3 bg-white rounded-full mt-3 overflow-hidden">
              <div className="h-3 bg-yellow-400 rounded-full transition-all" style={{ width: `${missedProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 mx-auto border border-yellow-300 text-center text-yellow-100 text-lg rounded-2xl py-4 px-6 max-w-xl">
        <div className="text-yellow-300 text-base">Address</div>
        <div className="text-sm font-mono">{maskAddress(address)}</div>
      </div>

      <style jsx>{`
        .emoji-blink {
          animation: blink 1.2s ease-in-out infinite;
        }
        .emoji-wiggle {
          display: inline-block;
          animation: wiggle 0.6s ease-in-out infinite;
        }
        .emoji-glow {
          animation: glowPulse 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        @keyframes glowPulse {
          0% {
            text-shadow: 0 0 3px #facc15;
          }
          50% {
            text-shadow: 0 0 15px #facc15, 0 0 30px #facc15;
          }
          100% {
            text-shadow: 0 0 3px #facc15;
          }
        }
      `}</style>
    </div>
  );
}

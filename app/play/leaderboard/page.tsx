'use client';

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getBunnyContract } from "@/lib/bunnyContract";
import { ethers } from "ethers";
import UserActivityCard from "@/components/UserActivityCard";
import TaskPanel from "@/components/TaskPanel";

type Player = {
  address: string;
  xp: number;
  level: number;
  feeds: number;
  missed: number;
};

const GUEST_STATS: Player = {
  address: "0x0000000000000000000000000000000000000000",
  xp: 123,
  level: 2,
  feeds: 7,
  missed: 1,
};

export default function LeaderboardPage() {
  const { address: currentUser } = useAccount();
  const [players, setPlayers] = useState<Player[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<Player | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const contract = await getBunnyContract();
        const all = await contract.getAllPlayers();

        const fullData: Player[] = await Promise.all(
          all.map(async (addr: string) => {
            const [xp, level, feeds, missed] = await Promise.all([
              contract.getXP(addr),
              contract.getLevel(addr),
              contract.getFeedCount(addr),
              contract.getMissedDays(addr),
            ]);
            return {
              address: addr,
              xp: Number(xp),
              level: Number(level),
              feeds: Number(feeds),
              missed: Number(missed),
            };
          })
        );

        const sorted = fullData.sort((a, b) => b.xp - a.xp);
        setPlayers(sorted.slice(0, 100));

        if (currentUser) {
          const index = sorted.findIndex((p) => p.address.toLowerCase() === currentUser.toLowerCase());
          if (index !== -1) {
            setUserRank(index + 1);
            setUserStats(sorted[index]);
          }
        } else {
          setUserStats(GUEST_STATS);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setUserStats(GUEST_STATS);
      }
    };

    fetchLeaderboard();
  }, [currentUser]);

  const maskAddress = (address: string) =>
    address.slice(0, 6) + "..." + address.slice(-4);

  return (
    <div className="min-h-screen bg-[#1e1b4b] text-yellow-200 px-4 py-12 flex flex-col items-center font-body">
      
      {/* 🐰 کارت نمایشی حتی بدون کیف */}
      {userStats && (
        <div className="mb-10 w-full max-w-5xl flex flex-col md:flex-row gap-6 animate-fade-in">
          <div className="w-full md:w-2/3">
            <UserActivityCard
              rank={userRank || 42}
              level={userStats.level}
              xp={userStats.xp}
              feeds={userStats.feeds}
              missed={userStats.missed}
            />
          </div>
          <div className="w-full md:w-1/3">
            <TaskPanel userStats={userStats} isGuest={!currentUser} />
          </div>
        </div>
      )}

      {/* 🏆 تیتر لیدربورد */}
      <h1 className="text-3xl text-yellow-300 mb-8 font-pixel">🏆 Leaderboard</h1>

      {/* 📋 جدول کاربران */}
      <div className="w-full max-w-5xl overflow-x-auto">
        <table className="w-full table-auto text-base border border-yellow-300">
          <thead>
            <tr className="bg-yellow-300 text-black text-left">
              <th className="py-2 px-4 border text-center">#</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border text-center">XP</th>
              <th className="py-2 px-4 border text-center">Level</th>
              <th className="py-2 px-4 border text-center">Feeds</th>
              <th className="py-2 px-4 border text-center">Missed</th>
            </tr>
          </thead>
          <tbody>
            {players.map((user, index) => {
              const isCurrentUser = currentUser?.toLowerCase() === user.address.toLowerCase();
              return (
                <tr
                  key={user.address}
                  className={`border-t border-yellow-300 ${isCurrentUser ? 'font-bold bg-[#2e2b80]' : ''}`}
                >
                  <td className="py-2 px-4 text-center">{index + 1}</td>
                  <td className="py-2 px-4 font-mono">
                    {maskAddress(user.address)}
                    {isCurrentUser && <span className="text-yellow-300"> (You)</span>}
                  </td>
                  <td className="py-2 px-4 text-center">{user.xp}</td>
                  <td className="py-2 px-4 text-center">{user.level}</td>
                  <td className="py-2 px-4 text-center">{user.feeds}</td>
                  <td className="py-2 px-4 text-center">{user.missed}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getBunnyContract } from "@/lib/bunnyContract";
import UserCardVisual from "@/components/UserCardVisual"; // ✅ مطمئن شو که این فایل ساخته شده

type Player = {
  address: string;
  xp: number;
  level: number;
  feeds: number;
  missed: number;
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
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, [currentUser]);

  const maskAddress = (address: string) =>
    address.slice(0, 6) + "..." + address.slice(-4);

  return (
    <div className="min-h-screen bg-[#1e1b4b] text-yellow-200 font-pixel flex flex-col items-center px-4 py-12">
      <h1 className="text-3xl text-yellow-300 mb-8">🏆 Leaderboard</h1>

      {userStats && userRank && (
        <div className="mb-10 w-full flex justify-center animate-fade-in">
          <UserCardVisual
            rank={userRank}
            level={userStats.level}
            xp={userStats.xp}
            feeds={userStats.feeds}
            missed={userStats.missed}
            address={userStats.address}
          />
        </div>
      )}

      <div className="w-full max-w-5xl overflow-x-auto">
        <table className="w-full table-auto text-sm border border-yellow-300">
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

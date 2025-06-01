'use client';

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getBunnyContract } from "@/lib/bunnyContract";

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
          } else {
            const fullIndex = fullData.findIndex((p) => p.address.toLowerCase() === currentUser.toLowerCase());
            if (fullIndex !== -1) {
              setUserRank(fullIndex + 1);
              setUserStats(fullData[fullIndex]);
            }
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
        <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-100/5 border-2 border-yellow-300 rounded-2xl px-6 py-6 mb-10 shadow-xl animate-fade-in w-full max-w-xl text-center">
          <h2 className="text-xl mb-4 text-yellow-100 font-bold">✨ Your Bunny Stats ✨</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm sm:text-base text-yellow-200 font-pixel">
            <div>🏅 Rank<br /><span className="text-yellow-300 text-lg">{userRank}</span></div>
            <div>⚡ XP<br /><span className="text-yellow-300 text-lg">{userStats.xp}</span></div>
            <div>📈 Level<br /><span className="text-yellow-300 text-lg">{userStats.level}</span></div>
            <div>🥕 Feeds<br /><span className="text-yellow-300 text-lg">{userStats.feeds}</span></div>
            <div>⏳ Missed<br /><span className="text-yellow-300 text-lg">{userStats.missed}</span></div>
            <div>🧍 You<br /><span className="text-yellow-300 text-sm">{maskAddress(userStats.address)}</span></div>
          </div>
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
                  <td className="py-2 px-4 font-mono">{maskAddress(user.address)} {isCurrentUser && <span className="text-yellow-300">(You)</span>}</td>
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

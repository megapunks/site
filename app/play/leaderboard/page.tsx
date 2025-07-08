'use client';

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import UserActivityCard from "@/components/UserActivityCard";
import TaskPanel from "@/components/TaskPanel";

interface Player {
  address: string;
  baseXP: number;
  newXP: number;
  xp: number;
  level: number;
  feeds: number;
  missed: number;
  isDead?: boolean;
}

const GUEST_STATS: Player = {
  address: "0x0000000000000000000000000000000000000000",
  baseXP: 0,
  newXP: 123,
  xp: 123,
  level: 2,
  feeds: 7,
  missed: 1,
  isDead: false,
};

export default function LeaderboardPage() {
  const { address: currentUser } = useAccount();
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [userStats, setUserStats] = useState<Player>(GUEST_STATS);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch("/leaderboard.json?_t=" + Date.now());
        const allPlayers: Player[] = await res.json();

        // مرتب‌سازی کلی همه پلیرها
        const sorted = allPlayers
          .filter((p) => p.xp > 0 || p.feeds > 0)
          .sort((a, b) => b.xp - a.xp || b.level - a.level);

        // فقط 100 نفر اول برای نمایش جدول
        setTopPlayers(sorted.slice(0, 100));

        // پیدا کردن کاربر لاگین‌شده در کل جدول
        if (currentUser) {
          const index = sorted.findIndex(
            (p) => p.address.toLowerCase() === currentUser.toLowerCase()
          );
          if (index !== -1) {
            setUserStats(sorted[index]);
            setUserRank(index + 1);
          } else {
            setUserStats(GUEST_STATS);
            setUserRank(null);
          }
        } else {
          setUserStats(GUEST_STATS);
          setUserRank(null);
        }
      } catch (err) {
        console.error("❌ Failed to load leaderboard snapshot:", err);
        setUserStats(GUEST_STATS);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [currentUser]);

  const mask = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  return (
    <div className="min-h-screen bg-[#1e1b4b] text-yellow-200 px-4 py-10 flex flex-col items-center font-body">
      {loading ? (
        <p className="text-yellow-100 text-lg">Loading leaderboard...</p>
      ) : (
        <>
          {userStats && (
            <div className="mb-10 w-full max-w-5xl flex flex-col md:flex-row gap-6 animate-fade-in">
              <div className="w-full md:w-2/3">
                <UserActivityCard
                  rank={userRank || 9999}
                  level={userStats.level}
                  xp={userStats.xp}
                  feeds={userStats.feeds}
                  missed={userStats.missed}
                  isDead={userStats.isDead}
                />
              </div>
              <div className="w-full md:w-1/3">
                <TaskPanel userStats={userStats} isGuest={!currentUser} />
              </div>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl text-yellow-300 mb-6 sm:mb-8 font-pixel text-center">
            🏆 Leaderboard – Top 100 Players
          </h1>

          <div className="w-full max-w-5xl overflow-x-auto rounded-lg border border-yellow-300">
            <table className="w-full table-auto text-sm sm:text-base">
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
                {topPlayers.map((user, index) => {
                  const isCurrent = currentUser?.toLowerCase() === user.address.toLowerCase();
                  return (
                    <tr
                      key={user.address}
                      className={`border-t border-yellow-300 ${
                        isCurrent ? "font-bold bg-[#2e2b80]" : ""
                      }`}
                    >
                      <td className="py-2 px-4 text-center">{index + 1}</td>
                      <td className="py-2 px-4 font-mono break-all">
                        {mask(user.address)}
                        {isCurrent && <span className="text-yellow-300"> (You)</span>}
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
        </>
      )}
    </div>
  );
}

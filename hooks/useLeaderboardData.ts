import { useEffect, useState } from "react";
import { getBunnyContract } from "@/lib/bunnyContract";

export type Player = {
  address: string;
  xp: number;
  level: number;
  feeds: number;
  missed: number;
  isDead: boolean;
};

export function useLeaderboardData(limit = 50) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const contract = await getBunnyContract();
      const all: string[] = await contract.getAllPlayers();
      const limited = all.slice(0, limit);

      const playerData = await Promise.all(
        limited.map(async (addr: string): Promise<Player | null> => {
          try {
            const [xp, lvl, feeds, missed, dead] = await Promise.all([
              contract.getXP(addr),
              contract.getLevel(addr),
              contract.getFeedCount(addr),
              contract.getMissedDays(addr),
              contract.isBunnyDead(addr),
            ]);
            return {
              address: addr,
              xp: Number(xp),
              level: Number(lvl),
              feeds: Number(feeds),
              missed: Number(missed),
              isDead: Boolean(dead),
            };
          } catch (err) {
            console.warn(`❌ Failed to fetch player data for ${addr}`, err);
            return null;
          }
        })
      );

      const filtered: Player[] = playerData
        .filter((p): p is Player => p !== null)
        .filter((p) => p.xp > 0 || p.feeds > 0)
        .sort((a, b) => b.xp - a.xp || b.level - a.level);

      setPlayers(filtered);
      setLastUpdated(Date.now());
      setError(null);
    } catch (err) {
      console.error("❌ Leaderboard fetch failed:", err);
      setError("Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Refresh every 10 minutes
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    players,
    loading,
    error,
    lastUpdated,
    refresh: fetchData,
  };
}

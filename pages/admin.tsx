import { useAccount } from "wagmi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getBunnyContract } from "../lib/bunnyContract";

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const [players, setPlayers] = useState<
    { address: string; xp: number; level: number }[]
  >([]);

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS;

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        const contract = await getBunnyContract();
        const all = await contract.getAllPlayers();

        const fullData = await Promise.all(
          all.map(async (addr: string) => {
            const [xp, level] = await Promise.all([
              contract.getXP(addr),
              contract.getLevel(addr),
            ]);
            return {
              address: addr,
              xp: Number(xp),
              level: Number(level),
            };
          })
        );

        // Sort by XP descending
        fullData.sort((a, b) => b.xp - a.xp);

        setPlayers(fullData);
      } catch (err) {
        console.error("❌ Failed to fetch player data:", err);
      }
    };

    fetchData();
  }, [isAdmin]);

  const exportToCSV = () => {
    const header = ["Rank,Address,XP,Level"];
    const rows = players.map((p, i) => `${i + 1},${p.address},${p.xp},${p.level}`);
    const csvContent = [...header, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", "bunny_leaderboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1e1b4b] text-yellow-200 font-pixel">
      <Header />
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        {!isAdmin ? (
          <div className="text-center mt-20">
            <p className="text-lg">⛔ Access denied. Please connect with admin wallet.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl text-yellow-300">📊 Full Player List</h1>
              <button
                onClick={exportToCSV}
                className="button-pixel bg-yellow-300 text-black hover:bg-yellow-200"
              >
                📥 Export to CSV
              </button>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="w-full table-auto text-sm border border-yellow-300">
                <thead>
                  <tr className="bg-yellow-300 text-black">
                    <th className="py-2 px-4 border">#</th>
                    <th className="py-2 px-4 border">Address</th>
                    <th className="py-2 px-4 border">XP</th>
                    <th className="py-2 px-4 border">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((user, index) => (
                    <tr key={user.address} className="border-t border-yellow-300">
                      <td className="py-2 px-4 text-center">{index + 1}</td>
                      <td className="py-2 px-4 font-mono">{user.address}</td>
                      <td className="py-2 px-4">{user.xp}</td>
                      <td className="py-2 px-4">{user.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

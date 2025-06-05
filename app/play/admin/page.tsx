'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getCollabNFTContract } from '@/lib/collabNFTContract';
import { getBunnyContract } from '@/lib/bunnyContract';
import { ethers } from 'ethers';

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();

export default function AdminDashboard() {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenId, setTokenId] = useState(0);
  const [cid, setCID] = useState('');
  const [maxSupply, setMaxSupply] = useState(100);
  const [price, setPrice] = useState('');
  const [tokenInfo, setTokenInfo] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
    if (isConnected && address?.toLowerCase() === ADMIN_ADDRESS) {
      setIsAdmin(true);
    }
  }, [address, isConnected]);

  const fetchTokenInfo = async () => {
    try {
      const contract = await getCollabNFTContract();
      const list = [];

      for (let id = 0; id < 50; id++) {
        try {
          const uri = await contract.uri(id);
          const supply = await contract.maxSupply(id);
          const minted = await contract.totalMinted(id);
          const enabled = await contract.mintEnabled(id);
          const price = await contract.mintPrice(id);
          list.push({
            id,
            uri,
            supply: supply.toString(),
            minted: minted.toString(),
            enabled,
            price: ethers.utils.formatEther(price),
          });
        } catch {
          continue;
        }
      }

      setTokenInfo(list);
    } catch (err) {
      console.error("Error fetching token info:", err);
    }
  };

  const fetchPlayerData = async () => {
    try {
      const contract = await getBunnyContract();
      const all = await contract.getAllPlayers();

      const fullData = await Promise.all(
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

      fullData.sort((a, b) => b.xp - a.xp);
      setPlayers(fullData);
    } catch (err) {
      console.error("❌ Failed to fetch player data:", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchTokenInfo();
      fetchPlayerData();
    }
  }, [isAdmin, refreshToggle]);

  const handleTx = async (action: () => Promise<any>, successMsg: string) => {
    try {
      await action();
      alert(successMsg);
      setRefreshToggle(!refreshToggle);
    } catch (err: any) {
      alert("❌ Error: " + (err?.reason || err?.message));
      console.error(err);
    }
  };

  const setTokenURI = () =>
    handleTx(async () => {
      const contract = await getCollabNFTContract();
      await contract.setTokenURI(tokenId, `ipfs://${cid}/metadata.json`);
    }, "✅ CID updated");

  const setMax = () =>
    handleTx(async () => {
      const contract = await getCollabNFTContract();
      await contract.setMaxSupply(tokenId, maxSupply);
    }, "✅ Max supply updated");

  const setPriceETH = () =>
    handleTx(async () => {
      const contract = await getCollabNFTContract();
      await contract.setMintPrice(tokenId, ethers.utils.parseEther(price || "0"));
    }, "✅ Price updated");

  const enableMint = () =>
    handleTx(async () => {
      const contract = await getCollabNFTContract();
      await contract.enableMint(tokenId, true);
    }, "✅ Mint enabled");

  const disableMint = () =>
    handleTx(async () => {
      const contract = await getCollabNFTContract();
      await contract.enableMint(tokenId, false);
    }, "❎ Mint disabled");

  const exportHolders = async () => {
    try {
      const contract = await getCollabNFTContract();
      const holders = await contract.getHolders(tokenId);
      const csv = ['Address'].concat(holders).join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `token_${tokenId}_holders.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('❌ Error exporting holders');
      console.error(err);
    }
  };

  const exportPlayers = () => {
    const header = ['Rank,Address,XP,Level,Feeds,Missed'];
    const rows = players.map(
      (p, i) => `${i + 1},${p.address},${p.xp},${p.level},${p.feeds},${p.missed}`
    );
    const csvContent = [...header, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'bunny_leaderboard.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isConnected) return <div className="p-10">🔌 Connect your wallet.</div>;
  if (!isAdmin) return <div className="p-10">🚫 You are not the admin.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-yellow-200 font-pixel">
      <h1 className="text-3xl mb-8">🛠 Admin Panel</h1>

      {/* NFT Controls */}
      <div className="bg-[#1e1b4b] p-6 rounded-xl border border-yellow-400 mb-10">
        <h2 className="text-xl mb-4">🎨 Manage NFT Settings</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="number" placeholder="Token ID" value={tokenId} onChange={(e) => setTokenId(Number(e.target.value))} className="input-pixel w-full" />
          <input type="text" placeholder="CID" value={cid} onChange={(e) => setCID(e.target.value)} className="input-pixel w-full" />
          <input type="number" placeholder="Max Supply" value={maxSupply} onChange={(e) => setMaxSupply(Number(e.target.value))} className="input-pixel w-full" />
          <input type="text" placeholder="Price (ETH)" value={price} onChange={(e) => setPrice(e.target.value)} className="input-pixel w-full" />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={setTokenURI} className="button-pixel bg-blue-500 text-white px-4 py-2">📦 Update CID</button>
          <button onClick={setMax} className="button-pixel bg-purple-500 text-white px-4 py-2">🔢 Update Supply</button>
          <button onClick={setPriceETH} className="button-pixel bg-yellow-500 text-black px-4 py-2">💰 Update Price</button>
          <button onClick={enableMint} className="button-pixel bg-green-600 text-white px-4 py-2">✅ Enable Mint</button>
          <button onClick={disableMint} className="button-pixel bg-red-600 text-white px-4 py-2">🚫 Disable Mint</button>
          <button onClick={exportHolders} className="button-pixel bg-indigo-600 text-white px-4 py-2">📤 Export Holders</button>
        </div>
      </div>

      {/* Token Stats */}
      <div className="mb-12">
        <h2 className="text-xl mb-4">📊 Token Stats</h2>
        <div className="space-y-4">
          {tokenInfo.map(info => (
            <div key={info.id} className="p-4 border border-yellow-400 rounded-lg bg-[#1e1b4b]">
              <p>🆔 Token ID: <strong>{info.id}</strong></p>
              <p>📦 URI: {info.uri}</p>
              <p>🎯 Supply: {info.minted} / {info.supply}</p>
              <p>🟢 Mint Active: {info.enabled ? 'Yes' : 'No'}</p>
              <p>💰 Price: {info.price} ETH</p>
            </div>
          ))}
        </div>
      </div>

      {/* Player Leaderboard */}
      <div className="mb-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">🏆 Player Leaderboard</h2>
          <button onClick={exportPlayers} className="button-pixel bg-yellow-300 text-black hover:bg-yellow-200 px-4 py-2">
            📥 Export Players
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-yellow-300">
            <thead>
              <tr className="bg-yellow-300 text-black">
                <th className="py-2 px-3 text-center">#</th>
                <th className="py-2 px-3 text-center">Address</th>
                <th className="py-2 px-3 text-center">XP</th>
                <th className="py-2 px-3 text-center">Level</th>
                <th className="py-2 px-3 text-center">Feeds</th>
                <th className="py-2 px-3 text-center">Missed</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.address} className="text-center border-t border-yellow-300">
                  <td className="py-1 px-2">{i + 1}</td>
                  <td className="py-1 px-2 font-mono">{p.address}</td>
                  <td className="py-1 px-2">{p.xp}</td>
                  <td className="py-1 px-2">{p.level}</td>
                  <td className="py-1 px-2">{p.feeds}</td>
                  <td className="py-1 px-2">{p.missed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

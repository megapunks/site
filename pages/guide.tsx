import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GuidePage() {
  return (
    <div className="flex flex-col min-h-screen font-pixel text-yellow-200 bg-[#1e1b4b]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 text-base leading-relaxed">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-yellow-300 shadow-lg">
          <h1 className="text-2xl mb-8 text-center text-yellow-100">
            How to Play Feed the BunnyPunk
          </h1>

          <section className="mb-10">
            <h2 className="text-lg mb-2 text-yellow-300">🎮 Game Objective</h2>
            <p>
              Feed your bunny every <strong>8 hours</strong> to earn XP and evolve it.
              Random food gives you different XP , higher levels unlock new visuals!
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg mb-2 text-yellow-300">🍓 Random Food Rewards</h2>
            <p>
              Every feeding gives a random food. Some are rare and more rewarding:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-6">
              {[
                { name: "🥕 Carrot", chance: "70%", xp: "+10 XP", img: "/foods/carrot.png" },
                { name: "🥬 Lettuce", chance: "15%", xp: "+15 XP", img: "/foods/lettuce.png" },
                { name: "🍓 Strawberry", chance: "10%", xp: "+30 XP", img: "/foods/strawberry.png" },
                { name: "🫐 Rare Berry", chance: "5%", xp: "+50 XP", img: "/foods/berry.png" },
              ].map((food, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-3 bg-[#312e81] border border-yellow-300 rounded-xl"
                >
                  <img src={food.img} alt={food.name} className="w-12 h-12" />
                  <div>
                    <p className="text-yellow-100">{food.name}</p>
                    <p className="text-yellow-300 text-sm">
                      {food.chance}, {food.xp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4">
              All randomness is on-chain and provably fair via the smart contract.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg mb-2 text-yellow-300">⏳ Feeding Cooldown</h2>
            <p>
              Feed every 8 hours. If you skip 24h, you lose <strong>5 XP</strong> from hunger.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg mb-2 text-yellow-300">📈 Bunny Levels</h2>
            <p>Your bunny evolves through 5 levels. Each level has a unique look:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {[
                { level: 1, xp: "0 – 99 XP", img: "/bunnies/level-1.png" },
                { level: 2, xp: "100 – 249 XP", img: "/bunnies/level-2.png" },
                { level: 3, xp: "250 – 499 XP", img: "/bunnies/level-3.png" },
                { level: 4, xp: "500 – 899 XP", img: "/bunnies/level-4.png" },
                { level: 5, xp: "900+ XP", img: "/bunnies/level-5.png" },
              ].map((lvl) => (
                <div
                  key={lvl.level}
                  className="flex items-center space-x-4 p-3 bg-[#312e81] border border-yellow-300 rounded-xl"
                >
                  <img src={lvl.img} alt={`Level ${lvl.level}`} className="w-20 h-20" />
                  <div>
                    <p className="text-yellow-100">Level {lvl.level}</p>
                    <p className="text-yellow-300 text-sm">{lvl.xp}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg mb-2 text-yellow-300">🏆 Leaderboard & Rewards</h2>
            <p>Top players (by XP) get:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-100">
              <li>🎟️ Free NFT mint access</li>
              <li>🎖️ Whitelist spots</li>
              <li>💰 Testnet prize drops</li>
            </ul>
            <p className="text-xs text-yellow-400 mt-2 italic">
              *All based on real on chain activity.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg mb-2 text-yellow-300">🚀 What's Next?</h2>
            <p>
              This is just the beginning. We're currently on MegaETH Testnet, but BunnyPunk is built to evolve. Expect more mechanics soon — including items, training boosts, PvE duels, and seasonal events. Community input will shape where we go next. Got ideas? Join us on Discord and help decide the future of BunnyPunk.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

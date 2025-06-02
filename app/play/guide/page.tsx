export const metadata = {
  title: 'How to Play - BunnyPunk Guide',
  description: 'Learn how to play BunnyPunk, level up, and climb the leaderboard.',
};

export default function GuidePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 text-[18px] leading-relaxed font-body">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-yellow-300 shadow-lg">
          <h1 className="text-3xl mb-8 text-center text-yellow-100 font-pixel">
            How to Play Feed the BunnyPunk
          </h1>

          {/* 🎮 Game Goal */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">🎮 Game Goal</h2>
            <p>
              Feed your bunny every <strong>8 hours</strong> to get XP and help it grow.
              Each food gives you some XP. When your level goes up, your bunny changes how it looks!
            </p>
          </section>

          {/* 🍓 Food Rewards */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">🍓 Random Food Rewards</h2>
            <p>
              Every time you feed your bunny, you get a random food.
              Some foods are rare and give more XP.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
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
                    <p className="text-yellow-100 font-pixel">{food.name}</p>
                    <p className="text-yellow-300 text-sm">{food.chance}, {food.xp}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4">
              All randomness is done by the smart contract and is 100% fair and onchain.
            </p>
          </section>

          {/* ⏳ Cooldown */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">⏳ Feeding Cooldown</h2>
            <p>
              You can feed your bunny every 8 hours.
              If you don’t feed it for 24 hours, it loses <strong>5 XP</strong> because it gets hungry.
            </p>
          </section>

          {/* 📈 Levels */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">📈 Bunny Levels</h2>
            <p>Your bunny evolves through 5 levels. Each level gives your bunny a new appearance!</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {[
                { level: 1, xp: "0 – 249 XP", img: "/bunnies/level-1.png" },
                { level: 2, xp: "250 – 499 XP", img: "/bunnies/level-2.png" },
                { level: 3, xp: "500 – 899 XP", img: "/bunnies/level-3.png" },
                { level: 4, xp: "900 – 1499 XP", img: "/bunnies/level-4.png" },
                { level: 5, xp: "1500+ XP", img: "/bunnies/level-5.png" },
              ].map((lvl) => (
                <div
                  key={lvl.level}
                  className="flex items-center space-x-4 p-3 bg-[#312e81] border border-yellow-300 rounded-xl"
                >
                  <img src={lvl.img} alt={`Level ${lvl.level}`} className="w-20 h-20" />
                  <div>
                    <p className="text-yellow-100 font-pixel">Level {lvl.level}</p>
                    <p className="text-yellow-300 text-sm">{lvl.xp}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 🏆 Leaderboard */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">🏆 Leaderboard & Rewards</h2>
            <p>Top players (by XP) receive:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-100">
              <li>🎟️ Free NFT mint access</li>
              <li>🎖️ Whitelist spots</li>
              <li>💰 Testnet prize drops</li>
            </ul>
            <p className="text-xs text-yellow-400 mt-2 italic">
              *All rewards are based on verifiable on-chain activity.
            </p>
          </section>

          {/* 🚀 Future Plans */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">🚀 What's Next?</h2>
            <p>
              This is only the start. BunnyPunk is growing quickly.
              Soon you’ll see new features like items, training boosts, battles, and special events.
              Got cool ideas? Come hang out with us on Discord and help build what’s next!
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

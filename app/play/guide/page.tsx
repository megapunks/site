export const metadata = {
  title: 'How to Play - BunnyPunk Guide',
  description: 'Learn how to play BunnyPunk, level up, claim NFTs, and win prizes.',
};

export default function GuidePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 text-[18px] leading-relaxed font-body">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-yellow-300 shadow-lg">
          <h1 className="text-3xl mb-8 text-center text-yellow-100 font-pixel">
            🐰 How to Play BunnyPunk
          </h1>

          {/* 🎯 Game Goal */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">🎯 Goal of the Game</h2>
            <p>
              Feed your bunny every <strong>8 hours</strong> to earn XP, level up, and climb the leaderboard. 
              The more you care for your bunny, the higher your level and your rewards!
            </p>
          </section>

          {/* 🍽️ Food Rewards */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">🍽️ Food & XP Rewards</h2>
            <p>
              Feeding gives your bunny a random food, with XP based on rarity:
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
              All randomness is handled on-chain via smart contracts. 100% fair.
            </p>
          </section>

          {/* ⏳ Cooldown & Hunger */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">⏳ Cooldown & Hunger</h2>
            <p>You can feed your bunny once every <strong>8 hours</strong>.</p>
            <p className="mt-2">
              If you forget to feed, XP will decay:
            </p>

            <ul className="list-disc list-inside mt-3 text-yellow-100 space-y-1">
              <li>1 day missed → -5 XP</li>
              <li>2 days → -10 XP</li>
              <li>3 days → -20 XP</li>
              <li>4 days → -50 XP</li>
              <li>5+ days → ☠️ Bunny dies!</li>
            </ul>

            <p className="mt-3">
              When dead, bunny cannot earn XP until revived.
            </p>
          </section>

          {/* 💖 Revive Mechanic */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">💖 Revive Your Bunny</h2>
            <p>
              If your bunny dies, you can revive it for <strong>0.01 ETH</strong>.
              This will restore <strong>50% of your last XP</strong>.
            </p>
          </section>

          {/* 📈 Levels & Evolution */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">📈 Bunny Levels & Evolution</h2>
            <p>Your bunny evolves as you level up. Visual upgrades at each stage!</p>

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

          {/* 🎁 Level NFTs */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">🎁 Claimable Level NFTs</h2>
            <p>
              When you reach a new level, you unlock the right to claim a unique <strong>Level NFT</strong>.
              These NFTs give you:
            </p>
            <ul className="list-disc list-inside mt-2 text-yellow-100 space-y-1">
              <li>💸 Daily faucet rewards</li>
              <li>📸 Snapshot eligibility for airdrops</li>
              <li>🛡️ Access to exclusive features</li>
            </ul>
          </section>

          {/* 🏆 Leaderboard & Prizes */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">🏆 Leaderboard & Rewards</h2>
            <p>
              The top 100 players are ranked publicly.
              You can view your own stats anytime, even without wallet connection.
            </p>

            <p className="mt-3">
              🎁 <strong>Real rewards</strong> for top players include:
            </p>
            <ul className="list-disc list-inside mt-2 text-yellow-100 space-y-1">
              <li>💰 Cash prizes</li>
              <li>🎟️ Guaranteed NFT access</li>
              <li>🏆 Share of future revenue from mainnet MegaPunk collection</li>
            </ul>
          </section>

          {/* 🚀 Roadmap */}
          <section className="mb-10">
            <h2 className="text-xl mb-2 text-yellow-300 font-pixel">🚀 What’s Coming Next?</h2>
            <p>
              This is just the beginning. Upcoming features:
            </p>
            <ul className="list-disc list-inside mt-2 text-yellow-100 space-y-1">
              <li>⚔️ PvP Bunny Battles</li>
              <li>🎒 Item system and power-ups</li>
              <li>🔄 NFT trading & burning</li>
              <li>🎉 Seasonal events with big rewards</li>
            </ul>
            <p className="mt-4">
              Join us on Discord to help shape the game!
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

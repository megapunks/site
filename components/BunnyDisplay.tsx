import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface Props {
  level?: number;
  xp?: number;
  lastFed?: number;
  cooldownPassed?: boolean;
  onFeed?: () => void;
  isConnected?: boolean;
  isDead?: boolean;
}

export default function BunnyDisplay({
  level = 1,
  xp = 0,
  lastFed = 0,
  cooldownPassed = true,
  onFeed,
  isConnected = false,
  isDead = false,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!lastFed) {
        setSecondsLeft(0);
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const nextFeedTime = lastFed + 8 * 3600;
      const diff = nextFeedTime - now;
      setSecondsLeft(diff > 0 ? diff : 0);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lastFed]);

  const hrs = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  const maxXP =
    level === 1 ? 249 :
    level === 2 ? 499 :
    level === 3 ? 899 :
    level === 4 ? 1499 : 2000;

  const progress = useMemo(() => Math.min((xp / maxXP) * 100, 100), [xp, maxXP]);
  const canFeed = isConnected && cooldownPassed && secondsLeft === 0 && !isDead;

  return (
    <div className="bg-[#312e81] text-yellow-200 rounded-xl shadow-lg p-4 sm:p-6 mt-6 w-full max-w-[600px] mx-auto font-pixel">
      <h2 className="text-xl sm:text-2xl mb-3">Feed Your Bunny Punk</h2>

      <div className="w-full aspect-square border-4 border-yellow-400 rounded-xl overflow-hidden bg-[#1e1b4b] mx-auto flex items-center justify-center">
        <Image
          src={isDead ? `/bunnies/dead.png` : `/bunnies/level-${level}.png`}
          alt={isDead ? "Dead Bunny" : `Level ${level} Bunny`}
          width={512}
          height={512}
          className="object-contain max-w-full max-h-full"
          priority
        />
      </div>

      <div className="mt-4 text-center">
        {isDead ? (
          <>
            <p className="text-lg sm:text-xl text-red-300 mt-4">☠️ Your bunny is dead</p>
            <p className="text-sm text-yellow-100 mt-1">Revive it to keep growing!</p>
          </>
        ) : (
          <>
            <p className="text-xl sm:text-2xl">Level {level}</p>
            <p className="text-lg sm:text-xl">XP: {xp} / {maxXP}</p>

            <div className="w-full h-3 bg-yellow-100 rounded-full mt-2">
              <div
                className="h-3 bg-yellow-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        {!isDead && secondsLeft > 0 && (
          <div className="mt-4 text-red-300 text-base sm:text-lg">
            ⏳ Next feed in: {hrs}h {mins}m {secs}s
          </div>
        )}

        <div className="mt-4">
          {isConnected ? (
            canFeed ? (
              <button onClick={onFeed} className="button-pixel w-full sm:w-auto">
                🥕 Feed Bunny
              </button>
            ) : (
              <button disabled className="button-pixel w-full sm:w-auto opacity-50 cursor-not-allowed">
                {isDead ? "☠️ Bunny is dead" : "Bunny is full!"}
              </button>
            )
          ) : (
            <p className="text-xs text-gray-400 mt-2">🔌 Connect wallet to feed</p>
          )}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";

interface Props {
  level: number;
  xp: number;
  feeds: number;
  missed: number;
  rank: number;
  isDead?: boolean;
}

const LEVEL_IMAGES: Record<number, string> = {
  1: "/bunnies/level1.png",
  2: "/bunnies/level2.png",
  3: "/bunnies/level3.png",
  4: "/bunnies/level4.png",
  5: "/bunnies/level5.png",
};

export default function UserActivityCard({
  level,
  xp,
  feeds,
  missed,
  rank,
  isDead,
}: Props) {
  const maxXP =
    level === 1
      ? 249
      : level === 2
      ? 499
      : level === 3
      ? 899
      : level === 4
      ? 1499
      : 2000;

  const progress = Math.min((xp / maxXP) * 100, 100);
  const imageSrc = isDead ? "/bunnies/dead.png" : LEVEL_IMAGES[level] || LEVEL_IMAGES[1];

  return (
    <div className="bg-[#1e1b4b] border border-yellow-300 rounded-xl p-6 text-yellow-100 w-full">
      <h2 className="text-2xl font-bold text-yellow-300 text-center mb-4">
        🐰 Your Bunny Profile
      </h2>

      <div className="relative w-[180px] h-[180px] mx-auto mb-4">
        <Image
          src={imageSrc}
          alt={isDead ? "Dead Bunny" : `Level ${level} Bunny`}
          fill
          className="object-contain"
        />
      </div>

      {isDead ? (
        <div className="text-center text-red-300 font-bold text-lg mb-4">
          ☠️ Your Bunny is Dead
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <Stat label="💎 Rank" value={`#${rank}`} />
        <Stat label="💥 XP" value={`${xp}`} />
        <Stat label="🥕 Feeds" value={`${feeds}`} />
        <Stat label="😟 Missed Days" value={`${missed}`} />
      </div>

      <div>
        <p className="text-lg text-yellow-300 mb-1 text-center">XP Progress</p>
        <div className="w-full h-3 bg-white rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-lg mt-1 text-yellow-300">Level {level}</p>
      </div>
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-[#312e81] border border-yellow-300 p-2 rounded-lg text-center">
    <div className="text-yellow-300 text-xs">{label}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);

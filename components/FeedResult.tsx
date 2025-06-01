import { useEffect, useState } from "react";

interface Props {
  data: {
    food: string;
    xp: number;
  };
  onClose: () => void;
}

const foodAssets: Record<string, { image: string; message: string; sound: string }> = {
  "Carrot": {
    image: "/foods/carrot.png",
    message: "🥕 The bunny munched a sweet carrot!",
    sound: "/sounds/munch.mp3",
  },
  "Lettuce": {
    image: "/foods/lettuce.png",
    message: "🥬 Fresh lettuce gave the bunny a boost!",
    sound: "/sounds/munch.mp3",
  },
  "Strawberry": {
    image: "/foods/strawberry.png",
    message: "🍓 Yum! A juicy strawberry!",
    sound: "/sounds/munch.mp3",
  },
  "Berry": {
    image: "/foods/berry.png",
    message: "🫐 Lucky find! Rare berry eaten!",
    sound: "/sounds/munch.mp3",
  },
};

export default function FeedResult({ data, onClose }: Props) {
  const { food, xp } = data;
  const foodInfo = foodAssets[food] || {
    image: "/foods/carrot.png",
    message: `🍽️ Bunny enjoyed ${food}`,
    sound: "/sounds/munch.mp3",
  };

  const [closing, setClosing] = useState(false);

  useEffect(() => {
    
    const audio = new Audio(foodInfo.sound);
    audio.volume = 0.5;
    audio.play().catch((err) => console.warn("🔇 Sound blocked:", err));

   
    const timeout = setTimeout(() => handleClose(), 4000);
    return () => clearTimeout(timeout);
  }, [food, onClose, foodInfo.sound]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 400); 
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center transition-all ${
          closing ? "animate-fade-out-down" : "animate-fade-in-up"
        }`}
        onClick={(e) => e.stopPropagation()} 
      >
        <img
          src={foodInfo.image}
          alt={food}
          className="w-32 h-32 mx-auto mb-4 object-contain animate-pop"
        />
        <h2 className="text-xl font-bold text-gray-800">{foodInfo.message}</h2>
        <p className="text-sm text-gray-600 mt-2">+{xp} XP gained</p>
        <p className="mt-4 text-xs text-gray-400">(Click anywhere to close)</p>
      </div>
    </div>
  );
}

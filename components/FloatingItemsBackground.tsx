"use client";

import { useEffect, useState } from "react";

const FLOATING_ITEMS = [
  "/floats/berry-float.png",
  "/floats/carrot-float.png",
  "/floats/strawberry-float.png",
  "/floats/berry-float2.png",
  "/floats/lettuce2.png",
  "/floats/strawberry-float2.png",
  "/floats/lettuce.png",
  "/floats/carrot-float2.png",
];

interface FloatingItem {
  src: string;
  left: string;
  delay: string;
  size: string;
}

export default function FloatingItemsBackground() {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      src: FLOATING_ITEMS[i % FLOATING_ITEMS.length],
      left: `${Math.floor(Math.random() * 100)}%`,
      delay: `${(Math.random() * 20).toFixed(2)}s`,
      size: `${40 + Math.floor(Math.random() * 40)}px`,
    }));
    setItems(generated);
  }, []);

  return (
    <>
      {items.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt="floating"
          className="absolute animate-fall pointer-events-none opacity-10"
          style={{
            top: "-100px",
            left: item.left,
            width: item.size,
            height: "auto",
            animationDelay: item.delay,
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

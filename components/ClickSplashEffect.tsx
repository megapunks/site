"use client";

import { useEffect } from "react";

const IMAGES = [
  "/floats/carrot-float2.png",
  "/floats/carrot-float.png",
  "/floats/berry-float.png",
  "/floats/strawberry-float.png",
  "/floats/lettuce.png",
];

export default function ClickSplashEffect() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      
      const count = Math.floor(Math.random() * 4) + 4;

      for (let i = 0; i < count; i++) {
        const img = document.createElement("img");
        img.src = IMAGES[Math.floor(Math.random() * IMAGES.length)];
        img.className = "fixed pointer-events-none z-50 splash-item";
        img.style.left = `${e.clientX}px`;
        img.style.top = `${e.clientY}px`;
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 80 + 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        img.style.setProperty("--x", `${x}px`);
        img.style.setProperty("--y", `${y}px`);
        img.style.setProperty("--scale", `${0.8 + Math.random() * 0.6}`);

        document.body.appendChild(img);
        setTimeout(() => img.remove(), 800);
      }

    
      const target = e.target as HTMLElement;
      const isButtonOrLink =
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button";

      if (isButtonOrLink) {
        const audio = new Audio("/sfx/pop.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

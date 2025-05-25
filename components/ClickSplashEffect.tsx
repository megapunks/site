// components/ClickSplashEffect.tsx
import { useEffect } from "react";

const IMAGES = [
"/foods/carrot.png",
   "/foods/carrot.png",
   "/foods/carrot.png",
   "/foods/carrot.png",
];

export default function ClickSplashEffect() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const count = Math.floor(Math.random() * 4) + 4;

      for (let i = 0; i < count; i++) {
        const img = document.createElement("img");
        img.src = IMAGES[Math.floor(Math.random() * IMAGES.length)];
        img.className = "fixed pointer-events-none z-50 splash-item";

        // موقعیت شروع
        img.style.left = `${e.clientX}px`;
        img.style.top = `${e.clientY}px`;

        // جهت و شدت پرتاب رندوم
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 80 + 50; // بین 50 تا 130 پیکسل
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        img.style.setProperty("--x", `${x}px`);
        img.style.setProperty("--y", `${y}px`);
        img.style.setProperty("--scale", `${0.8 + Math.random() * 0.6}`);

        document.body.appendChild(img);
        setTimeout(() => img.remove(), 800);
      }

      const audio = new Audio("/sfx/pop.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

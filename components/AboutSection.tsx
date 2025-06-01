"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AboutSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setVisible(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full py-20 px-6 bg-[#1e1b4b] flex justify-center items-center">
      <div
        className={`max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        
        <div className="text-center md:text-left space-y-6">
          <h2 className="text-3xl md:text-4xl font-pixel text-yellow-300 flex items-center gap-3 justify-center md:justify-center">
            🛠️ About Us
          </h2>

         
          <p className="text-yellow-100 text-base leading-relaxed bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-yellow-400/20">
            <strong>MegaPunks</strong> is a fun and interactive mini game built on the <strong>MegaETH testnet</strong>.  
            We launched the project five months ago with a single, powerful mission: to build a strong, loyal community that not only supports the MegaETH ecosystem but actively helps it grow.
          </p>

          
          <p className="text-yellow-100 text-base leading-relaxed bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-yellow-400/20">
            Our goal is to make blockchain interaction feel natural and enjoyable.  
            With a simple, gamified system, users feed, level up, and evolve their digital BunnyPunks  all onchain.  
            MegaPunks isn’t just a testnet game; it's a movement to connect people with the future of Web3 in the most fun and meaningful way possible.
          </p>
        </div>

        
        <div className="flex justify-center">
          <Image
            src="/about-image.png"
            alt="About MegaPunks"
            width={350}
            height={350}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

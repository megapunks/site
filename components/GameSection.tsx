"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function GameSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) setVisible(true);
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
       
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-pixel text-yellow-300 flex items-center gap-3 justify-center text-center">
            🎮 The BunnyPunk Game
          </h2>

          <p className="text-yellow-100 text-xl leading-relaxed bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-yellow-400/20">
            The BunnyPunk Game is your first step into a fully on-chain, gamified experience on the MegaETH testnet.  
            Every 8 hours, you can feed your bunny and help it grow stronger. Over time, your actions help it evolve, unlock new forms, and potentially earn unique rewards in the future.
          </p>

          <p className="text-yellow-100 text-xl leading-relaxed bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-yellow-400/20">
            But it’s more than just a game ,  it’s a stress test for the MegaETH chain.  
            Every click, every level-up, every interaction is recorded fully onchain, helping us simulate real-world usage at scale.  
            You’re not just playing , you’re building, contributing, and shaping the network’s future.
          </p>

          <div className="flex justify-center">
            <Link href="/play">
              <button className="bg-yellow-300 text-black font-pixel px-6 py-3 border-4 border-black hover:scale-105 transition-transform shadow-lg">
                🚀 Play Now
              </button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/game-preview.png"
            alt="Game Preview"
            width={500}
            height={500}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-center text-center text-yellow-200 px-4 sm:px-6 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/Herrobanner.png')" }}
    >
      
      <img
        src="/strawberry.png"
        alt="strawberry"
        className="absolute top-10 left-[20%] w-10 sm:w-14 opacity-90 float-left-right-fast"
      />
      <img
        src="/cloud.png"
        alt="cloud"
        className="absolute top-2 left-[42%] w-28 sm:w-40 opacity-80 float-left-right-slow"
      />
      <img
        src="/carrot.png"
        alt="carrot"
        className="absolute top-10 right-[20%] w-12 sm:w-20 opacity-90 float-left-right-carrot"
      />

      
      <div className="z-10 max-w-2xl w-full px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-pixel mb-4 drop-shadow-xl leading-tight">
          Welcome to MegaPunks
        </h1>
        <h2 className="text-base sm:text-lg md:text-xl font-mono text-yellow-300 mb-8 leading-tight">
          <Typewriter
            words={["A MegaETH Testnet Experience"]}
            loop={false}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/play">
            <button className="bg-[#facc15] text-black font-pixel px-6 py-3 border-4 border-black hover:scale-105 transition-all duration-200 shadow-xl w-[240px] sm:w-auto">
              🔥 Play Now
            </button>
          </Link>
          <a
            href="https://discord.gg/ZsKZD3XrKg"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[240px] sm:w-auto"
          >
            <button className="bg-transparent text-yellow-200 font-pixel px-6 py-3 border-4 border-yellow-200 hover:bg-yellow-200 hover:text-black transition-all duration-200 shadow-md w-full">
              💬 Join Discord
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

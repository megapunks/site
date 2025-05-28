"use client";

import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="bg-[#1e1b4b] shadow-md sticky top-0 z-50 border-b border-[#312e81]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative font-pixel text-yellow-400 text-xl">
        
        <div className="flex space-x-6">
          <Link href="/guide" className="hover:text-yellow-300">Guide</Link>
          <Link href="/faucet" className="hover:text-yellow-300">🚰 Faucet</Link>
          <span className="opacity-30 cursor-not-allowed">Checker</span>
        </div>

        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${
            scrolled ? "top-2" : "top-6"
          }`}
        >
          <Link href="/">
            <img src="/logo.svg" alt="MegaPunks" className="h-10" />
          </Link>
        </div>

        <ConnectWalletButton />
      </div>
    </header>
  );
}

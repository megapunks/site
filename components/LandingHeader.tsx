"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

export default function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log("🔥 LandingHeader rendered");
  }, []);

  return (
    <header className="bg-[#1e1b4b] shadow-md sticky top-0 z-50 border-b border-[#312e81]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between font-pixel text-yellow-400 text-xl relative">
        {/* Left: Desktop buttons + Mobile menu icon */}
        <div className="flex items-center space-x-4">
          {/* Desktop buttons */}
          <div className="hidden md:flex space-x-4">
            <Link href="/play">
              <button className="button-pixel px-6 py-2 text-lg">Enter Game</button>
            </Link>
            <Link href="/play/faucet">
              <button className="button-pixel px-6 py-2 text-lg">🚰 Faucet</button>
            </Link>
          </div>
          {/* Mobile menu icon */}
          <button
            className="md:hidden text-yellow-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <img src="/logo.svg" alt="MegaPunks" className="h-10" />
          </Link>
        </div>

        {/* Right: Placeholder for layout balance */}
        <div className="w-[40px] md:w-[200px]" />

        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#1e1b4b] border-t border-yellow-400 z-50 flex flex-col items-start p-4 space-y-3 md:hidden">
            <Link href="/play" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="hover:text-yellow-300">Enter Game</span>
            </Link>
            <Link href="/play/faucet" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="hover:text-yellow-300">🚰 Faucet</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

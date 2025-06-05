// components/GameHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
const ConnectWalletButton = dynamic(() => import('./ConnectWalletButton'), { ssr: false });
import { useState } from "react";
import { Menu } from "lucide-react";

export default function GameHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/play/guide", label: "How to play" },
    { href: "/play/task", label: "Task" },
    { href: "/play/mint", label: "Mint" },
    { href: "/play/leaderboard", label: "Dashboard" },
    { href: "/play/wallet-checker", label: "Wallet Checker" },
  ];

  return (
    <header className="bg-[#1e1b4b] shadow-md sticky top-0 z-50 border-b border-[#312e81]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between font-pixel text-yellow-400 text-[20px] relative">
        {/* Left: Logo */}
        <Link href={(pathname || "").startsWith("/play") ? "/play" : "/"}>
          <img src="/logo.svg" alt="MegaPunks" className="h-10" />
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden focus:outline-none"
        >
          <Menu size={24} />
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-7 absolute left-1/2 transform -translate-x-1/2">
          {(pathname || "").startsWith("/play") && (
            <Link href="/" className="hover:text-yellow-300">Home</Link>
          )}
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-yellow-300">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Wallet Button */}
        <div className="hidden md:block">
          <ConnectWalletButton />
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1e1b4b] px-4 pb-4 font-pixel text-yellow-300 space-y-3">
          {(pathname || "").startsWith("/play") && (
            <Link href="/" className="block">Home</Link>
          )}
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block">
              {link.label}
            </Link>
          ))}
          <ConnectWalletButton />
        </div>
      )}
    </header>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#1e1b4b] text-yellow-200 flex flex-col items-center justify-center text-center px-4 font-pixel">
      
      <div className="mb-6">
        <Image
          src="/404.png" 
          alt="404 Not Found"
          width={180}
          height={180}
          className="mx-auto"
        />
      </div>

      <h1 className="text-4xl sm:text-5xl mb-4">404 - Page Not Found</h1>
      <p className="text-lg sm:text-xl mb-8">Oops! We couldn't find what you're looking for.</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <button className="button-pixel bg-yellow-300 text-black px-6 py-3 border-2 border-black hover:bg-yellow-400">
            🏠 Go Home
          </button>
        </Link>
        <Link href="/play">
          <button className="button-pixel bg-transparent border-2 border-yellow-300 text-yellow-200 px-6 py-3 hover:bg-yellow-200 hover:text-black">
            🎮 Play Now
          </button>
        </Link>
      </div>
    </div>
  );
}

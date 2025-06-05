"use client";

import Image from "next/image";
import Link from "next/link";

const nftImages = [1, 2, 3, 4, 5, 6];

export default function NftGallerySection() {
  return (
    <section className="w-full py-20 px-6 bg-[#1e1b4b] text-center">
      <h2 className="text-3xl md:text-4xl font-pixel text-yellow-300 mb-10 glow-text flex items-center justify-center gap-3">
        🖼️ NFT Gallery
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        {nftImages.map((num) => (
          <div
            key={num}
            className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-yellow-300 shadow-md hover:scale-105 hover:shadow-yellow-200 transition-transform duration-300"
          >
            <Image
              src={`/nfts/${num}.png`}
              alt={`BunnyPunk #${num}`}
              width={300}
              height={300}
              className="rounded-md"
            />
          </div>
        ))}
      </div>

      <Link href="https://megapunks.org/" target="_blank">
        <button className="button-pixel px-8 py-3 text-lg mt-4">
          🔍 View More
        </button>
      </Link>
    </section>
  );
}

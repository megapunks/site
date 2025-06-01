"use client";

import Image from "next/image";
import Link from "next/link";

const nftImages = [1, 2, 3, 4, 5, 6];

export default function NftGallerySection() {
  return (
    <section className="w-full py-20 px-6 bg-[#1e1b4b] text-center">
      <h2 className="text-3xl md:text-4xl font-pixel text-yellow-300 mb-10 flex items-center justify-center gap-3">
        🖼️ NFT Gallery
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        {nftImages.map((num) => (
          <div
            key={num}
            className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-yellow-400/20 shadow-lg hover:scale-105 transition-transform"
          >
            <Image
              src={`/nfts/${num}.png`}
              alt={`BunnyPunk #${num}`}
              width={300}
              height={300}
              className="rounded"
            />
          </div>
        ))}
      </div>

      <Link href="https://megapunks.org/">
        <button className="bg-yellow-300 text-black font-pixel px-6 py-3 border-4 border-black hover:scale-105 transition-transform shadow-lg">
          🔍 View More
        </button>
      </Link>
    </section>
  );
}

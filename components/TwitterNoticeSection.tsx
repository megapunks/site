"use client";

import { useEffect, useState } from "react";

export default function TwitterNoticeSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setVisible(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full py-20 px-6 bg-[#1e1b4b] flex justify-center items-center">
      <div
        className={`max-w-3xl text-center transition-opacity duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-pixel text-yellow-300 mb-6 flex items-center justify-center gap-3">
          💔 Why a New Twitter?
        </h2>
        <p className="text-yellow-100 text-xl leading-relaxed bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-yellow-400/20 mb-6">
          Our original Twitter account was unfortunately suspended.  
          It was a tough moment, but it reminded us how powerful our community truly is.  
          Instead of slowing down, we chose to rebuild  stronger, sharper, and more united than ever.  
          We’re continuing with full energy under a new handle, and this is just the beginning.
        </p>

        <a
          href="https://twitter.com/Megaeth_Punks"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-300 text-black font-pixel px-6 py-3 border-4 border-black hover:scale-105 transition-transform shadow-lg"
        >
          🔁 Follow Our New Twitter
        </a>
      </div>
    </section>
  );
}

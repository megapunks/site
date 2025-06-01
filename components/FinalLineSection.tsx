"use client";

import { Typewriter } from "react-simple-typewriter";

export default function FinalLineSection() {
  return (
    <section className="w-full py-20 px-6 bg-[#1e1b4b] flex justify-center items-center text-center">
      <h2 className="text-3xl md:text-4xl font-pixel text-yellow-300 italic tracking-wide">
        <Typewriter
          words={['"Punks write history..."']}
          loop={false}
          cursor
          cursorStyle="_"
          typeSpeed={80}
          deleteSpeed={0}
          delaySpeed={1000}
        />
      </h2>
    </section>
  );
}

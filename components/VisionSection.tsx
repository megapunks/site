"use client";

export default function VisionSection() {
  return (
    <section className="w-full py-20 px-6 bg-[#1e1b4b] flex justify-center items-center text-center">
      <div className="max-w-3xl space-y-8">
        <h2 className="text-3xl md:text-4xl font-pixel text-yellow-300 flex items-center justify-center gap-3">
          🧠 Our Vision
        </h2>

        <blockquote className="text-yellow-100 text-lg md:text-xl leading-relaxed bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-yellow-400/20 shadow-lg italic">
          "We believe interaction with blockchain should be <span className="text-yellow-300 font-bold">simple</span>,  
          <span className="text-yellow-300 font-bold">rewarding</span>, and  
          <span className="text-yellow-300 font-bold"> fun</span>.  
          Games are just the beginning , our mission is to turn everyday users into empowered participants of the MegaETH ecosystem."
        </blockquote>
      </div>
    </section>
  );
}

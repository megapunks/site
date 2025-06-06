"use client";

export default function WhatsNextSection() {
  const features = [
    {
      title: "Interact with the chain",
      icon: "🔗",
      desc: "Use your BunnyPunk to explore new features onchain and test the full capabilities of the MegaETH network.",
    },
    {
      title: "Track your activity",
      icon: "📊",
      desc: "Keep a record of your actions, progress, and engagement across the ecosystem , all saved onchain.",
    },
    {
      title: "Grow with the ecosystem",
      icon: "🌱",
      desc: "As MegaETH expands, so will the opportunities. Be part of the next generation of user-driven networks.",
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-[#1e1b4b] text-center font-body">
      
      <h2 className="text-3xl md:text-4xl font-pixel text-yellow-300 mb-10 flex items-center justify-center gap-3">
        🚀 What’s Next?
      </h2>

      
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-yellow-400/20 shadow-lg hover:scale-105 transition-transform"
          >
            <div className="text-4xl mb-4">{f.icon}</div>
           
            <h3 className="text-xl font-pixel text-yellow-200 mb-2">{f.title}</h3>
            
            <p className="text-yellow-100 text-sm leading-relaxed font-body">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

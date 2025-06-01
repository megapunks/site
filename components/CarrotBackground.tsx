export default function CarrotBackground() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <img
          key={i}
          src="/carrot-float.png"
          alt="Carrot"
          className="absolute w-10 opacity-30 animate-carrot"
          style={{
            top: `${5 + i * 15}%`,
            right: `-${50 + i * 20}px`,
            animationDelay: `${i * 4}s`,
          }}
        />
      ))}
    </>
  );
}

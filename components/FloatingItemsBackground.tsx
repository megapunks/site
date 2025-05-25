const FLOATING_ITEMS = [
  "/floats/berry-float.png",
  "/floats/carrot-float.png",
  "/floats/strawberry-float.png",
  "/floats/Sport Sunglasses floats.png",
  "/floats/Brown Homburg.png",
  "/floats/Crown.png",
  "/floats/cigarette.png",
  "/floats/lettuce.png"
];

export default function FloatingItemsBackground() {
  return (
    <>
      {[...Array(15)].map((_, i) => {
        const item = FLOATING_ITEMS[i % FLOATING_ITEMS.length];
        const left = `${Math.floor(Math.random() * 100)}%`;
        const delay = (Math.random() * 10).toFixed(2); // بیشتر تصادفی
        const size = `${40 + Math.floor(Math.random() * 40)}px`; // 40 تا 80 پیکسل

        return (
          <img
            key={i}
            src={item}
            alt="floating"
            className="absolute animate-fall pointer-events-none opacity-30"
            style={{
              top: "-100px",
              left,
              width: size,
              height: "auto",
              animationDelay: `${delay}s`,
              zIndex: 0,
            }}
          />
        );
      })}
    </>
  );
}

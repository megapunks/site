"use client";

import Image from "next/image";

export default function PopupModal({
  message,
  onClose,
  type = "success",
}: {
  message: string;
  onClose: () => void;
  type?: "success" | "error";
}) {
  const imageSrc =
    type === "success"
      ? "/bunnies/punk-happy.png"
      : "/bunnies/punk-sad.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
      <div className="bg-[#312e81] border-4 border-yellow-300 text-yellow-100 p-6 rounded-xl w-full max-w-sm text-center font-pixel shadow-xl animate-slidefade relative">
        <Image
          src={imageSrc}
          alt="Punk Reaction"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <p className="text-base mb-4">{message}</p>
        <button onClick={onClose} className="button-pixel px-6 py-2">
          Close
        </button>
      </div>
    </div>
  );
}

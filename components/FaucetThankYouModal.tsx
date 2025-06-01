import Modal from "react-modal";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  twitterHandle: string;
  amount: string;
}

export default function FaucetThankYouModal({
  isOpen,
  onRequestClose,
  twitterHandle,
  amount,
}: Props) {
  const tweetText = encodeURIComponent(
    `I just claimed ${amount} $MEGAETH faucet from the @${twitterHandle} ! 🐰🚰\nTry it here: https://megapunks.org/play/faucet  
    #MegaPunks #Megaeth `
    
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="bg-[#1e1b4b] text-yellow-200 rounded-xl max-w-sm w-full p-6 font-pixel border border-yellow-300 shadow-xl text-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
    >
      <h2 className="text-lg mb-3">🎉 Thanks!</h2>
      <p className="mb-3 text-base">
        You claimed <strong>{amount} MEGAETH</strong> ✅
      </p>
      <p className="mb-4 text-sm">Want to help? Tweet or follow us!</p>

      <div className="flex flex-col space-y-2">
        <a
          href={`https://x.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="button-pixel"
        >
          Post it on X
        </a>
        <a
          href={`https://x.com/${twitterHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="button-pixel"
        >
          ⭐ Follow @{twitterHandle}
        </a>
      </div>

      <button
        onClick={onRequestClose}
        className="mt-4 text-xs text-yellow-300 hover:underline"
      >
        Maybe later
      </button>
    </Modal>
  );
}

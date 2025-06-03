import Modal from "react-modal";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  twitterHandle: string;
  amount: string;
  reason?: string; // دلیل دریافت فاست (NFT یا Mainnet)
}

export default function FaucetThankYouModal({
  isOpen,
  onRequestClose,
  twitterHandle,
  amount,
  reason,
}: Props) {
  const tweetText = encodeURIComponent(
    `I just claimed ${amount} $MEGAETH faucet from the @${twitterHandle} 🐰🚰 thanks to ${reason}!\nTry it here: https://megapunks.org/play/faucet\n#MegaPunks #Megaeth`
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="bg-[#1e1b4b] text-yellow-200 rounded-xl max-w-sm w-full p-6 font-pixel border border-yellow-300 shadow-xl text-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
    >
      <h2 className="text-lg mb-3">🎉 Faucet Claimed!</h2>

      <p className="mb-3 text-base">
        You claimed <strong>{amount} MEGAETH</strong> ✅
      </p>

      {reason && (
        <p className="mb-4 text-sm text-yellow-100">
          Based on: <span className="font-bold">{reason}</span>
        </p>
      )}

      <p className="mb-4 text-sm">Want to support us? Share or follow:</p>

      <div className="flex flex-col space-y-2">
        <a
          href={`https://x.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="button-pixel"
        >
          🐰 Tweet it!
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

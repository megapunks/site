import Modal from "react-modal";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  twitterHandle: string;
  amountEth?: string;   
  wonWL?: boolean;
  wonFM?: boolean;
  txHash?: string;
}

export default function SlotResultModal({
  isOpen,
  onRequestClose,
  twitterHandle,
  amountEth,
  wonWL,
  wonFM,
  txHash,
}: Props) {
 
  const base = [
    "I just spun the MEGAPUNKS Slot! 🎰",
    wonFM ? "Hit a 🎟️ FreeMint!" : "",
    wonWL ? "Won a ✅ Whitelist spot!" : "",
    amountEth ? `Scored ${amountEth} ETH 💰` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const tweetText = encodeURIComponent(
    `${base}\nTry it here: https://megapunks.org/play/wheel\ #MegaPunks #MegaETH`
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="bg-[#1e1b4b] text-yellow-200 rounded-xl max-w-sm w-full p-6 font-pixel border border-yellow-300 shadow-xl text-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
    >
      <h2 className="text-lg mb-3">🎉 Congrats!</h2>

      {wonFM && (
        <p className="mb-1 text-base">
          You unlocked a <strong>FreeMint</strong> spot 🪄
        </p>
      )}
      {wonWL && (
        <p className="mb-1 text-base">
          You won a <strong>Whitelist</strong> spot ✅
        </p>
      )}
      {amountEth && (
        <p className="mb-3 text-base">
          Plus <strong>{amountEth} ETH</strong> 💰
        </p>
      )}

      {txHash && (
        <p className="mb-4 text-[10px] text-yellow-100 break-all opacity-80">
          Tx: {txHash}
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

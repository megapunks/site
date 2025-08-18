'use client';

import React, { useMemo } from 'react';
import Modal from 'react-modal';

type ResultLike = {
  amountEth?: string;   // مثلاً '0.00312'
  wonWL?: boolean;
  wonFM?: boolean;
  txHash?: string | null;
};

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  twitterHandle?: string;   // پیش‌فرض: 'Megaeth_Punks'
  shareUrl?: string;        // پیش‌فرض: https://megapunks.org/play/slot
  result: ResultLike | null;
}

/** الگوهای متن — از این‌ها یکی به صورت تصادفی انتخاب می‌شود */
function shareTemplates(handle: string, amt: string) {
  return [
    `Spun the @${handle} slot and bagged ${amt} ETH 💰`,
    `Hit spin. Got paid. ${amt} ETH from the @${handle} slot ⚡`,
    `One pull, one win – ${amt} ETH in the wallet! 🎯 Thanks @${handle}`,
    `Lucky lever at @${handle}! Pulled and landed ${amt} ETH ✨`,
    `Daily spin at @${handle}: ${amt} ETH secured 🧲`,
  ];
}

export default function SlotResultModal({
  isOpen,
  onRequestClose,
  twitterHandle = 'Megaeth_Punks',
  shareUrl,
  result,
}: Props) {
  const url = shareUrl || 'https://megapunks.org/play/slot';

  // متن رندوم فقط وقتی مودال باز می‌شود محاسبه شود
  const tweetText = useMemo(() => {
    if (!result) return '';
    const amt = result.amountEth || '0';
    const list = shareTemplates(twitterHandle, amt);
    const base = list[Math.floor(Math.random() * list.length)];
    const extras = result.wonFM ? ' + FreeMint 🎟️' : result.wonWL ? ' + Whitelist ✅' : '';
    return `${base}${extras}\n${url}\n#MegaPunks #MegaETH`;
  }, [isOpen, result, twitterHandle, url]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="bg-[#1e1b4b] text-yellow-200 rounded-xl max-w-sm w-full p-6 font-pixel border border-yellow-300 shadow-xl text-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
    >
      <h2 className="text-lg mb-3">🎉 Spin Complete!</h2>

      {result?.wonFM && <p className="mb-1 text-base">You snagged a <strong>FreeMint</strong> spot! 🪄</p>}
      {result?.wonWL && <p className="mb-1 text-base">You won a <strong>Whitelist</strong> spot! ✅</p>}
      {typeof result?.amountEth !== 'undefined'
        ? <p className="mb-2 text-base">You pocketed <strong>{result.amountEth} ETH</strong> 🪙</p>
        : <p className="mb-2 text-base">Spin confirmed. Good luck next time!</p>
      }

      {result?.txHash && (
        <p className="mb-4 text-[11px] text-yellow-300/80 break-all">
          Tx: {result.txHash}
        </p>
      )}

      <div className="flex flex-col space-y-2">
        <a
          href={`https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="button-pixel"
        >
          🐰 TWEET IT!
        </a>
        <a
          href={`https://x.com/${twitterHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="button-pixel"
        >
          ⭐ FOLLOW @{twitterHandle}
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

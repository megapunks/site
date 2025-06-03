'use client';

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import FaucetThankYouModal from "@/components/FaucetThankYouModal";

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [faucetAmount, setFaucetAmount] = useState<string>("0.001");
  const [reason, setReason] = useState<string>("your NFT level"); // جدید ✅
  const [showModal, setShowModal] = useState(false);

  const TWITTER_HANDLE = "Megaeth_Punks";

  const handleFaucet = async () => {
    if (!captchaToken || !address) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("/api/request-faucet", {
        address,
        captcha: captchaToken,
      });

      setResult(res.data.message);
      setFaucetAmount(res.data.amount || "0.001");

      // اگر API دلیل رو برگردونه
      setReason(res.data.reason || "your NFT level"); // می‌تونی اینو از سرور تعیین کنی

      if (res.data.message?.toLowerCase().includes("success")) {
        setShowModal(true);
      }
    } catch (err: any) {
      setResult(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-md">
      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto text-center fade-in">
        <img
          src="/bunnies/faucet-banner.png"
          alt="Faucet Bunny"
          className="mx-auto mb-6 w-full max-w-[500px] h-auto"
        />

        <div className="bg-[#312e81] p-8 rounded-xl shadow-md border border-yellow-300">
          <h1 className="text-2xl mb-5 text-yellow-100">🚰 MegaPunk Faucet</h1>

          <div className="text-lg mb-6 text-center leading-relaxed space-y-2">
            <p>Claim <strong>free MEGAETH</strong> every <strong>24h</strong> based on your NFT:</p>

            <div className="flex justify-center gap-10 text-lg">
              <div className="text-left space-y-1">
                <div>🫐 <strong>Level 5</strong></div>
                <div>🍓 <strong>Level 4</strong></div>
                <div>🥬 <strong>Level 3</strong></div>
                <div>🥕 <strong>Level 2</strong></div>
              </div>
              <div className="text-right space-y-1">
                <div><strong>0.02</strong> MEGAETH</div>
                <div><strong>0.005</strong> MEGAETH</div>
                <div><strong>0.003</strong> MEGAETH</div>
                <div><strong>0.002</strong> MEGAETH</div>
              </div>
            </div>

            <p className="mt-4">
              🪙 No NFT? Hold <strong>0.01 ETH</strong> on mainnet to get <strong>0.001 MEGAETH</strong>
            </p>
          </div>

          <div className="mb-4 flex justify-center">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>

          <button
            onClick={handleFaucet}
            disabled={!captchaToken || !isConnected || loading}
            className="button-pixel w-full"
          >
            {loading ? "Checking..." : "Claim Faucet"}
          </button>

          {result && (
            <div className="mt-4 text-sm text-yellow-300">{result}</div>
          )}
        </div>
      </main>

      <FaucetThankYouModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        twitterHandle={TWITTER_HANDLE}
        amount={faucetAmount}
        reason={reason}
      />
    </div>
  );
}

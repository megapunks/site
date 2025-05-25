import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import FaucetThankYouModal from "../components/FaucetThankYouModal";

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
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
    <div className="flex flex-col min-h-screen font-pixel text-yellow-200 overflow-hidden">
      <Header />

      <main className="flex-1 p-6 max-w-2xl mx-auto text-center">
        <img
          src="/bunnies/faucet-banner.png"
          alt="Faucet Bunny"
          className="mx-auto mb-6 w-[600px]"
        />

        <div className="bg-[#312e81] p-6 rounded-xl shadow-md border border-yellow-300">
          <h1 className="text-lg mb-3">🚰 MegaETH Faucet</h1>
          <p className="text-sm mb-4">
            Claim <strong>0.001 MEGAETH</strong> every 48h if you hold 0.02 ETH on mainnet.
          </p>

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
            <div className="mt-4 text-sm text-yellow-100">{result}</div>
          )}
        </div>
      </main>

      <Footer />

      <FaucetThankYouModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        twitterHandle={TWITTER_HANDLE}
      />
    </div>
  );
}

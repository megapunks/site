import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const shorten = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function ConnectWalletButton() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const correctChainId = 6342;

  if (isConnected && chain?.id !== correctChainId) {
    return <div className="text-red-400 font-pixel text-xs">❌ Switch to MegaETH Testnet</div>;
  }

  return isConnected ? (
    <button onClick={() => disconnect()} className="button-pixel">
      Disconnect ({shorten(address!)})
    </button>
  ) : (
    <button onClick={() => connect()} className="button-pixel">
      Connect Wallet
    </button>
  );
}

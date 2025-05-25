import '../styles/globals.css';
import { AppProps } from 'next/app';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { Chain } from 'wagmi';
import ClickSplashEffect from "../components/ClickSplashEffect";

const megaETH: Chain = {
  id: 1337,
  name: 'MegaETH Testnet',
  network: 'megaeth',
  nativeCurrency: {
    name: 'MEGA',
    symbol: 'MEGA',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.megaeth.xyz'],
    },
    public: {
      http: ['https://rpc.megaeth.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'MegaETH Explorer', url: 'https://explorer.megaeth.xyz' },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [megaETH],
  [jsonRpcProvider({ rpc: () => ({ http: 'https://rpc.megaeth.xyz' }) })]
);

const client = createClient({
  autoConnect: true,
  connectors: [],
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ClickSplashEffect />
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default MyApp;

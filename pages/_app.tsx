// /pages/_app.tsx
import '../styles/globals.css';
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
  connectors: [], // بدون RainbowKit فعلاً کانکتور نیاز نداریم
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
        <ClickSplashEffect />
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default MyApp;


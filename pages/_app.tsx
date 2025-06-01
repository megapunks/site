// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig } from 'wagmi';
import { http } from 'wagmi';
import { Chain } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ClickSplashEffect from '../components/ClickSplashEffect';

const megaETH: Chain = {
  id: 6342,
  name: 'MegaETH Testnet',
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

const config = createConfig({
  chains: [megaETH],
  transports: {
    [megaETH.id]: http('https://rpc.megaeth.xyz'),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ClickSplashEffect />
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiConfig>
  );
}

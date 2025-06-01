// ✅ File: app/providers.tsx
'use client'

import { ReactNode } from 'react'
import { WagmiConfig, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected } from 'wagmi/connectors'

const megaeth = {
  id: 6342,
  name: 'MegaETH Testnet',
  nativeCurrency: {
    name: 'MegaETH',
    symbol: 'MEGA',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.megaeth.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MegaETH Explorer', url: 'https://explorer.megaeth.xyz' },
  },
  testnet: true,
}

const config = createConfig({
  connectors: [injected()],
  chains: [megaeth],
  transports: {
    [megaeth.id]: http('https://rpc.megaeth.xyz'),
  },
  ssr: true,
})

const queryClient = new QueryClient()

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiConfig>
  )
}
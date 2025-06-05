import { defineChain } from 'viem'

export const megaeth = defineChain({
  id: 6342,
  name: 'MegaETH Testnet',
  nativeCurrency: {
    name: 'MegaETH',
    symbol: 'MEGA',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://carrot.megaeth.com/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MegaETH Explorer',
      url: 'https://explorer.megaeth.xyz',
    },
  },
  testnet: true,
})

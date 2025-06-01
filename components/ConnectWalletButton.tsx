'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

const shorten = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

export default function ConnectWalletButton() {
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()

  return isConnected && address ? (
    <button onClick={() => disconnect()} className="button-pixel">
      {shorten(address)} ✖
    </button>
  ) : (
    <button onClick={() => connect({ connector: injected() })} className="button-pixel">
      Connect Wallet
    </button>
  )
}

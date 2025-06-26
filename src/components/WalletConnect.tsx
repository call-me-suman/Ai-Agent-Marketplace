import * as React from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";

export default function WalletConnect() {
  const { connectors, connect } = useConnect();
  const { address, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();

  if (activeConnector) {
    console.log(address)
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">
          Connected to {activeConnector.name}
        </span>
        <button
          type="button"
          onClick={() => disconnect()}
          className="text-red-500 hover:text-red-600 text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return connectors
    .filter((connector) => connector.name.toLowerCase().includes('coinbase'))
    .map((connector) => (
      <button
        type="button"
        key={connector.uid}
        onClick={() => connect({ connector })}
        className="text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-md text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
      >
        Connect Coinbase Wallet
      </button>
    ));
}
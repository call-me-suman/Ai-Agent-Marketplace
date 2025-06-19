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

  return connectors.map((connector) => (
    <button
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      key={connector.uid}
      onClick={() => connect({ connector })}
    >
      {connector.name === "MetaMask" ? "Connect MetaMask" : "Connect Coinbase Wallet"}
    </button>
  ));
}
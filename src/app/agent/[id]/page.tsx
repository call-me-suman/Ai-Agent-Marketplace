"use client";

import { useState, useEffect, use } from "react";
import { Toaster } from "react-hot-toast";
import { Agent } from "@/types";
import { getAgentById } from "@/lib/api";
import WalletConnect from "@/components/WalletConnect";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { ChatInterface } from "@/components/ui/chat-interface";
import SubscriptionButton from "@/components/SubscriptionButton";
import CancelSubscriptionButton from "@/components/CancelSubscriptionButton";

export default function AgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const data = await getAgentById(resolvedParams.id);
        setAgent(data);
        const trialUsed = localStorage.getItem(
          `trial_used_${resolvedParams.id}`
        );
        setHasUsedTrial(!!trialUsed);
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };

    fetchAgent();
  }, [resolvedParams.id]);

  // Check subscription status whenever the wallet changes
  useEffect(() => {
    if (!address) return;
    const subKey = `subscription_${address}`;
    const active = localStorage.getItem(subKey) === "active";
    setIsSubscribed(active);
  }, [address]);

  const handleSubscribeSuccess = (txHash: string) => {
    if (!address) return;
    localStorage.setItem(`subscription_${address}`, "active");
    setIsSubscribed(true);
    toast.success("Subscription successful! You can now chat without limits.");
  };

  const handleCancelSubscription = () => {
    if (!address) return;
    localStorage.removeItem(`subscription_${address}`);
    setIsSubscribed(false);
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />

      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {agent.name}
              </h1>
              <p className="mt-2 text-gray-400">{agent.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {!isConnected ? (
          <div className="text-center p-8 bg-gray-900 rounded-lg border border-gray-800 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">
              Connect Your Wallet to Start
            </h2>
            <p className="text-gray-400 mb-4">
              Connect your wallet to use this AI agent. You'll get one free
              trial, after which a small fee will apply.
            </p>
            <WalletConnect />
          </div>
        ) : isSubscribed ? (
          <div className="max-w-2xl mx-auto mb-6 text-center space-y-2">
            <p className="text-green-400">
              Subscription active – unlimited queries.
            </p>
            <CancelSubscriptionButton onCancel={handleCancelSubscription} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-6 text-center space-y-4">
            {!hasUsedTrial && (
              <p className="text-sm text-center text-gray-400">
                You have one free trial. Alternatively, subscribe now for
                unlimited queries, or pay per use after the trial.
              </p>
            )}
            {hasUsedTrial && (
              <p className="text-sm text-center text-gray-400">
                Pay-per-use mode: you'll be prompted to pay {agent.cost} ETH for
                each query.
              </p>
            )}
            <SubscriptionButton
              amount={"0.005"}
              recipientAddress={address as `0x${string}`}
              onSubscribeSuccess={handleSubscribeSuccess}
            />
          </div>
        )}

        {isConnected && (
          <div className="mt-6">
            <ChatInterface
              agentId={resolvedParams.id}
              hasUsedTrial={isSubscribed ? false : hasUsedTrial}
              onTrialUsed={
                isSubscribed
                  ? () => {}
                  : () => {
                      localStorage.setItem(
                        `trial_used_${resolvedParams.id}`,
                        "true"
                      );
                      setHasUsedTrial(true);
                      toast.success("Trial used successfully!");
                    }
              }
              paymentMode={isSubscribed ? "subscription" : "payPerUse"}
              isSubscribed={isSubscribed}
              costPerPrompt={agent.cost}
              recipientAddress={address as `0x${string}`}
            />
          </div>
        )}
      </div>
    </main>
  );
}

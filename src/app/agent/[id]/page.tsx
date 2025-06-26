'use client';

import { useState, useEffect, use } from 'react';
import { Toaster } from 'react-hot-toast';
import { Agent } from '@/types';
import { getAgentById } from '@/lib/api';
import PaymentButton from '@/components/PaymentButton';
import WalletConnect from '@/components/WalletConnect';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { ChatInterface } from '@/components/ui/chat-interface';

export default function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const data = await getAgentById(resolvedParams.id);
        setAgent(data);
        const trialUsed = localStorage.getItem(`trial_used_${resolvedParams.id}`);
        setHasUsedTrial(!!trialUsed);
      } catch (error) {
        console.error('Error fetching agent:', error);
      }
    };

    fetchAgent();
  }, [resolvedParams.id]);

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
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet to Start</h2>
            <p className="text-gray-400 mb-4">
              Connect your wallet to use this AI agent. You'll get one free trial, after which a small fee will apply.
            </p>
            <WalletConnect />
          </div>
        ) : hasUsedTrial ? (
          <div className="max-w-2xl mx-auto mb-6 text-center">
            <PaymentButton
              amount={agent.cost}
              recipientAddress={address as `0x${string}`}
              onPaymentSuccess={(hash) => {
                // Payment success is now handled in the ChatInterface component
                toast.success('Payment successful! You can now continue chatting.');
              }}
            />
            <p className="text-sm text-center text-gray-400 mt-2">
              You've used your free trial. Pay a small fee to continue using this agent.
            </p>
          </div>
        ) : null}

        {isConnected && (
          <div className="mt-6">
            <ChatInterface 
              agentId={resolvedParams.id} 
              hasUsedTrial={hasUsedTrial}
              onTrialUsed={() => {
                localStorage.setItem(`trial_used_${resolvedParams.id}`, 'true');
                setHasUsedTrial(true);
                toast.success('Trial used successfully!');
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
} 
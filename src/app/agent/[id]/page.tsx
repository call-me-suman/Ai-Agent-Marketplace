'use client';

import { useState, useEffect, use } from 'react';
import { Toaster } from 'react-hot-toast';
import { Agent } from '@/types';
import { getAgentById } from '@/lib/api';
import PaymentButton from '@/components/PaymentButton';
import WalletConnect from '@/components/WalletConnect';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

export default function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<{ id: string; url: string } | null>(null);
  
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

  // Check subscription status
  const checkSubscription = async (invoiceId: string) => {
    try {
      const response = await fetch(
        `/api/agents/${agent?.id}/subscribe?invoiceId=${invoiceId}&address=${address}`
      );
      const data = await response.json();

      if (data.status === 'subscribed') {
        setIsSubscribed(true);
        setInvoice(null);
      } else if (data.status === 'expired') {
        setSubscriptionError('Payment expired. Please try again.');
        setInvoice(null);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  // Poll for subscription status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (invoice?.id && !isSubscribed) {
      interval = setInterval(() => {
        checkSubscription(invoice.id);
      }, 5000); // Check every 5 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [invoice, isSubscribed, agent?.id, address]);

  // Handle subscription
  const handleSubscribe = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsSubscribing(true);
      setSubscriptionError(null);

      const response = await fetch(`/api/agents/${agent?.id}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      setInvoice(data);
      window.open(data.url, '_blank');
    } catch (error: any) {
      console.error('Error subscribing:', error);
      setSubscriptionError(error.message || 'Failed to subscribe');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Check if this is beyond the first free use
    const hasUsedFree = localStorage.getItem(`trial_used_${agent?.id}`);
    if (hasUsedFree && !isSubscribed) {
      toast.error('Please subscribe to continue using this agent');
      return;
    }

    setIsLoading(true);
    setOutput('');

    try {
      if (!hasUsedTrial) {
        // First-time use (trial) with streaming
        setIsStreaming(true);
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: input,
            agentId: resolvedParams.id,
            walletAddress: address
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from agent');
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No reader available');
        }

        // Read the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Convert the chunk to text and update the output
          const chunk = new TextDecoder().decode(value);
          setOutput(prev => prev + chunk);
        }
        
        // Mark trial as used
        localStorage.setItem(`trial_used_${resolvedParams.id}`, 'true');
        setHasUsedTrial(true);
        toast.success('Analysis completed and stored on IPFS!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process request: ' + (error as Error).message);
      setOutput('');
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handlePaymentSuccess = async (transactionHash: string) => {
    try {
      setIsLoading(true);
      setIsStreaming(true);
      setOutput('');
      
      // After successful payment, process the request with streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          agentId: resolvedParams.id,
          transactionHash,
          walletAddress: address
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from agent');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text and update the output
        const chunk = new TextDecoder().decode(value);
        setOutput(prev => prev + chunk);
      }
      
      toast.success('Analysis completed and stored on IPFS!');
    } catch (error) {
      console.error('Error processing paid request:', error);
      toast.error('Failed to process request: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getPlaceholderText = () => {
    switch(agent.id) {
      case "2":
        return "Describe your needs for an AI agent or ask for recommendations...";
      case "3":
        return "Ask any question or request assistance with a task...";
      case "4":
        return "Enter a website URL or describe what you'd like to analyze...";
      case "5":
        return "Ask for fundraising advice or startup guidance...";
      case "8":
        return "Ask about crypto markets, trends, or specific tokens...";
      default:
        return "Type your message here...";
    }
  };

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
            <div className="flex items-center space-x-4">
              <WalletConnect />
              {isConnected && !isSubscribed && localStorage.getItem(`trial_used_${agent.id}`) && (
                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isSubscribing
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubscribing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {subscriptionError && (
        <div className="container mx-auto px-6 py-4">
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded">
            {subscriptionError}
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {!isConnected ? (
            <div className="text-center p-8 bg-gray-900 rounded-lg border border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Connect Your Wallet to Start</h2>
              <p className="text-gray-400 mb-4">
                Connect your wallet to use this AI agent. You'll get one free trial, after which a small fee will apply.
              </p>
              <WalletConnect />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="input" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Query
                </label>
                <textarea
                  id="input"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={getPlaceholderText()}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4">
                {!hasUsedTrial ? (
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 
                      ${isLoading 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                      }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                      </span>
                    ) : (
                      'Try for Free'
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <PaymentButton
                      amount={agent.cost}
                      recipientAddress={address as `0x${string}`}
                      onPaymentSuccess={handlePaymentSuccess}
                      disabled={!input.trim() || isLoading}
                    />
                    <p className="text-sm text-center text-gray-400">
                      You've used your free trial. Pay a small fee to continue using this agent.
                    </p>
                  </div>
                )}
              </div>
            </form>
          )}

          {output && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Analysis Results
                </label>
                {isStreaming && (
                  <span className="flex items-center text-sm text-blue-400">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </span>
                )}
              </div>
              <div className="w-full px-6 py-4 rounded-lg bg-gray-900 border border-gray-700 prose prose-invert max-w-none">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 
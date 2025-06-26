'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getHistoryFromIPFS } from '@/lib/pinata';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryEntry {
  agentId: string;
  userMessage: string;
  assistantResponse: string;
  timestamp: string;
  ipfsHash?: string;
  transactionHash?: string;
  transactionType?: 'trial' | 'paid';
  walletAddress: string;
}

export default function HistoryPage() {
  const { address } = useAccount();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchHistory = async () => {
      if (!address) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await getHistoryFromIPFS(address);
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [address]);

  const toggleResponse = (id: string) => {
    setExpandedResponses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getTransactionTypeDisplay = (entry: HistoryEntry) => {
    // Default to 'trial' if transactionType is missing
    const type = entry.transactionType || (entry.transactionHash ? 'paid' : 'trial');
    return type.toUpperCase();
  };

  const getTransactionTypeStyle = (entry: HistoryEntry) => {
    // Default to 'trial' if transactionType is missing
    const type = entry.transactionType || (entry.transactionHash ? 'paid' : 'trial');
    return type === 'paid' 
      ? 'bg-green-900 text-green-300'
      : 'bg-blue-900 text-blue-300';
  };

  const truncateResponse = (response: string) => {
    const maxLength = 150;
    if (response.length <= maxLength) return response;
    return response.substring(0, maxLength) + '...';
  };

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl text-gray-400">Please connect your wallet to view history</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Interaction History</h1>
        
        {history.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No history found</p>
        ) : (
          <div className="space-y-6">
            {history.map((entry) => {
              const id = entry.ipfsHash || `${entry.timestamp}-${entry.agentId}`;
              const isExpanded = expandedResponses.has(id);

              return (
                <div
                  key={id}
                  className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getTransactionTypeStyle(entry)}`}>
                        {getTransactionTypeDisplay(entry)}
                      </span>
                      <span className="text-gray-400">
                        {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      {entry.transactionHash && (
                        <a
                          href={`https://sepolia.basescan.org/tx/${entry.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          View Transaction ↗
                        </a>
                      )}
                      {entry.ipfsHash && (
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${entry.ipfsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          View IPFS ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Query</h3>
                      <p className="bg-gray-800 rounded p-3">{entry.userMessage}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-400">Response</h3>
                        <button
                          onClick={() => toggleResponse(id)}
                          className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-1" />
                              Show More
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-gray-800 rounded p-3 prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap">
                          {isExpanded ? entry.assistantResponse : truncateResponse(entry.assistantResponse)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                      <span>Agent ID: {entry.agentId}</span>
                      <span className="truncate ml-4">
                        Wallet: {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 
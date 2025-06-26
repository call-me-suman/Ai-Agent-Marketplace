import { useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import type { Hash } from 'viem';
import toast from 'react-hot-toast';

interface SubscriptionButtonProps {
  amount: string;
  recipientAddress: `0x${string}`;
  onSubscribeSuccess: (transactionHash: string) => void;
  disabled?: boolean;
}

export default function SubscriptionButton({
  amount,
  recipientAddress,
  onSubscribeSuccess,
  disabled = false,
}: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { sendTransaction } = useSendTransaction({
    mutation: {
      onSuccess(data: Hash) {
        toast.success('Subscription payment sent!');
        onSubscribeSuccess(data);
        setIsLoading(false);
      },
      onError(error: Error) {
        toast.error('Subscription failed: ' + error.message);
        setIsLoading(false);
      },
    },
  });

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      sendTransaction({
        to: recipientAddress,
        value: parseEther(amount),
      });
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
      console.error('Subscription error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={disabled || isLoading}
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-300 disabled:opacity-50"
    >
      {isLoading ? 'Processing...' : <>Subscribe ({amount} ETH)</>}
    </button>
  );
} 
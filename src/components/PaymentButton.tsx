import { useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import type { Hash } from 'viem';
import toast from 'react-hot-toast';

interface PaymentButtonProps {
  amount: string;
  recipientAddress: `0x${string}`;
  onPaymentSuccess: (transactionHash: string) => void;
  disabled?: boolean;
}

export default function PaymentButton({
  amount,
  recipientAddress,
  onPaymentSuccess,
  disabled = false,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { sendTransaction } = useSendTransaction({
    mutation: {
      onSuccess(data: Hash) {
        toast.success('Transaction sent!');
        onPaymentSuccess(data);
        setIsLoading(false);
      },
      onError(error: Error) {
        toast.error('Transaction failed: ' + error.message);
        setIsLoading(false);
      },
    }
  });

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      sendTransaction({
        to: recipientAddress,
        value: parseEther(amount),
      });
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-300 disabled:opacity-50"
    >
      {isLoading ? (
        'Processing...'
      ) : (
        <>Pay {amount} ETH</>
      )}
    </button>
  );
} 
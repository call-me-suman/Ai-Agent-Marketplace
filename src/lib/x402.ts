import { PaymentResponse } from '@/types';

// Mock implementation of x402Pay interaction
// In production, this would interact with the actual x402Pay contract
export const initiatePayment = async (
  amount: string,
  recipientAddress: string
): Promise<PaymentResponse> => {
  try {
    // Mock transaction hash
    const mockTransactionHash = '0x' + Math.random().toString(16).slice(2);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      transactionHash: mockTransactionHash,
    };
  } catch (error) {
    console.error('Payment error:', error);
    return {
      success: false,
      error: 'Payment failed',
    };
  }
};

export const formatEthAmount = (amount: string): string => {
  return `${amount} ETH`;
}; 
export interface Agent {
  id: string;
  name: string;
  description: string;
  cost: string;
  imageUrl?: string;
  metadata?: AgentMetadata;
  tasks_completed?: string;
  rating?: number;
  reviews?: number;
}

export interface AgentMetadata {
  capabilities: string[];
  version: string;
  author: string;
  lastUpdated: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface AgentExecutionResult {
  success: boolean;
  result?: string;
  ipfsCid?: string;
  error?: string;
}

export interface ChatInteraction {
  agentId: string;
  userMessage: string;
  assistantResponse: string;
  timestamp: string;
  walletAddress: string;
  transactionType: 'paid' | 'trial';
  transactionHash?: string;
} 
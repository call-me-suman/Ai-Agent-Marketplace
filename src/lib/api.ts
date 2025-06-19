import axios from "axios";
import { Agent, AgentExecutionResult, PaymentResponse } from "@/types";

const api = axios.create({
  // For local development, we don't need a base URL since we're using relative paths
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Sample agents data for development
const sampleAgents: Agent[] = [
  {
    id: "1",
    name: "TrendHustler",
    description: "AI-powered trend analysis and market research assistant",
    cost: "0.001",
    tasks_completed: "1.2K",
    rating: 4.36,
    reviews: 14,
    imageUrl: "/globe.svg"
  },
  {
    id: "2",
    name: "Maestro | Agent Finder",
    description: "Intelligent agent recommendation and matching system",
    cost: "0.001",
    tasks_completed: "1.2K",
    rating: 3.67,
    reviews: 3,
    imageUrl: "/file.svg"
  },
  {
    id: "3",
    name: "GPT-4.1 Agent",
    description: "Advanced language model with specialized capabilities",
    cost: "0.001",
    tasks_completed: "1.2K",
    rating: 4.00,
    reviews: 72,
    imageUrl: "/window.svg"
  },
  {
    id: "4",
    name: "Talk To Website",
    description: "Interactive website analysis and communication tool",
    cost: "0.001",
    tasks_completed: "1.1K",
    rating: 3.80,
    reviews: 15,
    imageUrl: "/next.svg"
  },
  {
    id: "5",
    name: "NextRaise - Startup Fundraising Agent",
    description: "AI-powered fundraising assistant for startups",
    cost: "0.001",
    tasks_completed: "1.5K",
    rating: 5.00,
    reviews: 4,
    imageUrl: "/vercel.svg"
  },
  {
    id: "6",
    name: "Book Recommender",
    description: "Personalized book recommendations based on your interests",
    cost: "0.001",
    tasks_completed: "1.4K",
    rating: 4.00,
    reviews: 7,
    imageUrl: "/file.svg"
  },
  {
    id: "7",
    name: "Study Guide",
    description: "AI tutor that creates personalized study materials",
    cost: "0.001",
    tasks_completed: "1.3K",
    rating: 4.50,
    reviews: 8,
    imageUrl: "/window.svg"
  },
  {
    id: "8",
    name: "The Crypto Play",
    description: "Cryptocurrency market analysis and trading insights",
    cost: "0.001",
    tasks_completed: "1.3K",
    rating: 4.09,
    reviews: 33,
    imageUrl: "/globe.svg"
  }
];

export const getAgents = async (): Promise<Agent[]> => {
  // For development, return sample data
  return sampleAgents;
};

export const getAgentById = async (id: string): Promise<Agent> => {
  // For development, find in sample data
  const agent = sampleAgents.find(a => a.id === id);
  if (!agent) {
    throw new Error('Agent not found');
  }
  return agent;
};

export const verifyPayment = async (
  transactionHash: string
): Promise<PaymentResponse> => {
  const { data } = await api.post("/api/payments/verify", { transactionHash });
  return data;
};

export const runAgent = async (
  agentId: string,
  input: string,
  transactionHash: string
): Promise<AgentExecutionResult> => {
  const { data } = await api.post("/api/agents/run", {
    agentId,
    input,
    transactionHash,
  });
  return data;
};

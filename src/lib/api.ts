import axios from "axios";
import { Agent, AgentExecutionResult, PaymentResponse } from "@/types";
import { nextGenAgentContexts } from "@/lib/ai-utils";

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
  // Transform EnhancedAgentContext objects into the simplified Agent type expected by the UI
  const dynamicAgents: Agent[] = Object.values(nextGenAgentContexts).map(ctx => ({
    id: ctx.id,
    name: ctx.name,
    description: ctx.description,
    cost: "0.001", // Default placeholder cost; update when pricing model is available
    imageUrl: "/globe.svg", // Generic placeholder image; replace with specific images if available
    metadata: {
      capabilities: ctx.capabilities.map(cap => cap.name),
      version: ctx.version,
      author: "AI Agent",
      lastUpdated: new Date(ctx.lastUpdated).toISOString(),
    },
    tasks_completed: `${Math.round(ctx.performanceMetrics.successRate * 1000)}`,
    rating: Math.round(ctx.performanceMetrics.userSatisfaction * 50) / 10, // Scale 0-5 and keep one decimal
    reviews: 0,
  }));

  // If for some reason the dynamic list is empty (e.g. during SSR build), fall back to static sample data
  if (dynamicAgents.length === 0) {
    return sampleAgents;
  }

  return dynamicAgents;
};

export const getAgentById = async (id: string): Promise<Agent> => {
  const ctx = nextGenAgentContexts[id];
  if (!ctx) {
    throw new Error("Agent not found");
  }

  return {
    id: ctx.id,
    name: ctx.name,
    description: ctx.description,
    cost: "0.001",
    imageUrl: "/globe.svg",
    metadata: {
      capabilities: ctx.capabilities.map(cap => cap.name),
      version: ctx.version,
      author: "AI Agent",
      lastUpdated: new Date(ctx.lastUpdated).toISOString(),
    },
    tasks_completed: `${Math.round(ctx.performanceMetrics.successRate * 1000)}`,
    rating: Math.round(ctx.performanceMetrics.userSatisfaction * 50) / 10,
    reviews: 0,
  };
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

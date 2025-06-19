import { NextResponse } from 'next/server';
import { Agent } from '@/types';

// Sample agents data (this should match the data in your api.ts file)
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

// Handler for GET requests - Get agent by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const agent = sampleAgents.find(a => a.id === params.id);
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the agent' },
      { status: 500 }
    );
  }
}
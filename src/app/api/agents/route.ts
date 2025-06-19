import { NextResponse } from 'next/server';
interface Agent {
  id: string;
  name: string;
  description: string;
  cost: string;
}
// Sample data - in a real app, this would come from a database


// Handler for GET requests - List all agents
export async function GET() {
  return NextResponse.json({ agents });
}

// Handler for POST requests - Get agent details (temporarily without payment)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentId } = body;
    
    const agent = agents.find(a => a.id === agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Return detailed agent information (no payment required for testing)
    return NextResponse.json({
      ...agent,
      detailed_capabilities: [
        "Full capability description",
        "Access to agent API",
        "Usage examples and documentation"
      ],
      api_key: "demo_api_key_" + agentId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { 
  generateAgentRecommendations,
  generateAdvancedResponse,
  generateWebsiteAnalysis,
  generateFundraisingAdvice,
  generateCryptoAnalysis
} from '@/lib/ai-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentId, input } = body;

    console.log('Received request for agent:', agentId);

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    let result;
    
    // Handle different agents
    switch (agentId) {
      case "2": // Maestro | Agent Finder
        console.log('Processing Maestro request...');
        result = await generateAgentRecommendations(input);
        console.log('Maestro recommendations completed');
        break;
      case "3": // GPT-4.1 Agent
        console.log('Processing GPT-4.1 request...');
        result = await generateAdvancedResponse(input);
        console.log('GPT-4.1 response completed');
        break;
      case "4": // Talk To Website
        console.log('Processing Talk To Website request...');
        result = await generateWebsiteAnalysis(input);
        console.log('Website analysis completed');
        break;
      case "5": // NextRaise
        console.log('Processing NextRaise request...');
        result = await generateFundraisingAdvice(input);
        console.log('Fundraising advice completed');
        break;
      case "8": // The Crypto Play
        console.log('Processing Crypto Play request...');
        result = await generateCryptoAnalysis(input);
        console.log('Crypto analysis completed');
        break;
      default:
        return NextResponse.json(
          { error: 'Agent not found or not implemented yet' },
          { status: 404 }
        );
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error processing request:', error);
    // Return more detailed error message
    return NextResponse.json(
      { 
        error: 'An error occurred while processing your request',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
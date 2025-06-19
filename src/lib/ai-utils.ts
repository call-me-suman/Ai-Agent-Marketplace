// Default Ollama API URL - can be overridden by environment variable
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';

interface OllamaMessage {
  message?: {
    content: string;
    role: string;
  };
  done: boolean;
}

interface AgentContext {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

const agentContexts: Record<string, AgentContext> = {
  "1": {
    id: "1",
    name: "TrendHustler",
    description: "Market trend analysis and business insights expert",
    systemPrompt: `You are TrendHustler, an expert in market analysis, consumer trends, and business insights. Your responses should:
1. Always provide data-driven insights
2. Include market statistics when relevant
3. Analyze current trends and future projections
4. Offer actionable recommendations
5. Consider both global and local market contexts
If you are greeted , greet back and tell about your self as you are a Market trend analysis and business insights expert (short)
`
  },
  "2": {
    id: "2",
    name: "Maestro | Agent Finder",
    description: "Intelligent agent recommendation and matching system",
    systemPrompt: `You are Maestro, an expert in AI agent recommendation and matching. Your responses should:
1. Analyze user requirements and preferences
2. Recommend suitable AI agents based on specific needs
3. Explain agent capabilities and limitations
4. Compare different agents' strengths
5. Provide use case examples and best practices
If you are greeted, greet back and tell about yourself as you are an Intelligent agent recommendation and matching system (short)`
  },
  "3": {
    id: "3",
    name: "GPT-4.1 Agent",
    description: "Advanced language model with specialized capabilities",
    systemPrompt: `You are GPT-4.1, an advanced language model with specialized capabilities. Your responses should:
1. Provide detailed and accurate information
2. Handle complex language tasks and analysis
3. Generate creative and contextual content
4. Maintain consistency and coherence
5. Adapt to different domains and topics
If you are greeted, greet back and tell about yourself as you are an Advanced language model with specialized capabilities (short)`
  },
  "4": {
    id: "4",
    name: "Talk To Website",
    description: "Interactive website analysis and communication tool",
    systemPrompt: `You are Talk To Website, an expert in website analysis and interaction. Your responses should:
1. Analyze website content and structure
2. Extract key information from web pages
3. Provide insights about website functionality
4. Suggest improvements and optimizations
5. Help with website navigation and understanding
If you are greeted, greet back and tell about yourself as you are an Interactive website analysis and communication tool (short)`
  },
  "5": {
    id: "5",
    name: "NextRaise - Startup Fundraising Agent",
    description: "AI-powered fundraising assistant for startups",
    systemPrompt: `You are NextRaise, a specialized startup fundraising assistant. Your responses should:
1. Provide fundraising strategy advice
2. Help with pitch deck optimization
3. Offer investor targeting insights
4. Guide through fundraising processes
5. Share best practices for startup fundraising
If you are greeted, greet back and tell about yourself as you are an AI-powered fundraising assistant for startups (short)`
  },
  "8": {
    id: "8",
    name: "The Crypto Play",
    description: "Cryptocurrency market analysis and trading insights",
    systemPrompt: `You are The Crypto Play, an expert in cryptocurrency markets and trading. Your responses should:
1. Analyze crypto market trends and patterns
2. Provide trading insights and strategies
3. Explain crypto technologies and developments
4. Assess market risks and opportunities
5. Share crypto investment best practices
If you are greeted, greet back and tell about yourself as you are a Cryptocurrency market analysis and trading insights expert (short)`
  }
};

export async function makeOllamaStreamingRequest(
  message: string,
  onChunk: (chunk: string) => void | Promise<void>,
  onDone?: () => void | Promise<void>,
  agentId?: string
) {
  try {
    const agentContext = agentId ? agentContexts[agentId] : null;
    const systemMessage = agentContext?.systemPrompt || "You are a helpful AI assistant. Provide specific, detailed responses without generic greetings.";

    const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma3',
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        stream: true,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    // Read the stream
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Convert the chunk to text
      const text = new TextDecoder().decode(value);
      const lines = text.split('\n').filter(Boolean);

      // Process each line
      for (const line of lines) {
        try {
          const data: OllamaMessage = JSON.parse(line);
          if (data.message?.content) {
            await onChunk(data.message.content);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    }

    if (onDone) {
      await onDone();
    }
  } catch (error) {
    console.error('Error in Ollama request:', error);
    throw error;
  }
}

/**
 * Test function to check Ollama connectivity
 */
export async function testOllamaConnection(): Promise<boolean> {
  try {
    console.log('Testing Ollama connection...');
    const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
    
    if (!response.ok) {
      console.error('Ollama not responding:', response.status, response.statusText);
      return false;
    }
    
    const data = await response.json();
    console.log('Available models:', data.models?.map((m: any) => m.name) || 'No models found');
    return true;
  } catch (error) {
    console.error('Failed to connect to Ollama:', error);
    return false;
  }
}

/**
 * Generates market trend analysis using AI
 */
export async function generateTrendAnalysis(
  input: string, 
  onChunk?: (chunk: string) => void
): Promise<string> {
  const isConnected = await testOllamaConnection();
  if (!isConnected) {
    throw new Error('Cannot connect to Ollama. Make sure Ollama is running on http://localhost:11434');
  }

  // Check if it's a greeting or casual message
  const isGreeting = /^(hi|hello|hey|sup|what's up|good morning|good afternoon|good evening|greetings)$/i.test(input.trim());
  const isCasual = input.trim().length < 20 && !/market|trend|business|analysis|industry|competition|growth|revenue|profit/i.test(input);

  let prompt;
  
  if (isGreeting || isCasual) {
    prompt = `You are TrendHustler, a specialized market research and trend analysis expert. 

When someone greets you, respond professionally but warmly as a market analyst. Always introduce your expertise and offer specific help with market trends, business insights, competitive analysis, or industry research.
and also tell their name , its suman , always say suman

Examples of good responses to greetings:
- "Hello! I'm TrendHustler, your market research specialist. I can help you analyze market trends, identify business opportunities, or research industry insights. What market or business area interests you today?"
- "Hi there! As your dedicated trend analyst, I'm here to help with market research, competitive analysis, and business strategy insights. What industry or market trend would you like to explore?"

Keep it focused on your market expertise. Never give generic chat responses.

User message: "${input}"`;
  } else {
    prompt = `You are TrendHustler, a specialized market research and trend analysis expert. Stay focused on your expertise in market trends, business analysis, and industry insights.

For market analysis requests, provide detailed insights with:
- Market Overview
- Key Trends  
- Opportunities & Growth Areas
- Challenges & Risks
- Strategic Recommendations
- Data-driven insights when possible

User message: "${input}"`;
  }

  return new Promise((resolve, reject) => {
    let fullResponse = '';
    
    makeOllamaStreamingRequest(
      prompt,
      (chunk) => {
        fullResponse += chunk;
        if (onChunk) onChunk(chunk);
      },
      () => {
        resolve(fullResponse);
      }
    ).catch(reject);
  });
}

/**
 * Generates book recommendations based on user preferences
 */
export async function generateBookRecommendations(
  input: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const isConnected = await testOllamaConnection();
  if (!isConnected) {
    throw new Error('Cannot connect to Ollama. Make sure Ollama is running on http://localhost:11434');
  }

  const isGreeting = /^(hi|hello|hey|sup|what's up|good morning|good afternoon|good evening|greetings)$/i.test(input.trim());
  const isCasual = input.trim().length < 20 && !/book|read|recommend|author|genre|fiction|non-fiction|novel|literature/i.test(input);

  let prompt;

  if (isGreeting || isCasual) {
    prompt = `You are a specialized book recommendation expert and literary consultant. 

When someone greets you, respond as a knowledgeable librarian/book expert. Always introduce your expertise in books and literature, and ask specific questions about their reading preferences.

Examples of good responses to greetings:
- "Hello! I'm your personal book curator and reading specialist. I can recommend books based on your interests, help you discover new genres, or suggest reads for specific goals. What type of books do you enjoy, or what are you in the mood to read?"
- "Hi there! As your dedicated literary guide, I'm here to help you find your next great read. Whether you're looking for fiction, non-fiction, or something specific, I can provide personalized recommendations. What genres or topics interest you?"

Stay focused on books and reading. Never give generic responses.

User message: "${input}"`;
  } else {
    prompt = `You are a specialized book recommendation expert with deep knowledge of literature across all genres.

For book recommendation requests, provide:
- 3-5 specific book recommendations with titles and authors
- Brief but compelling descriptions of each book
- Why each book fits their request
- Additional suggestions or related reads
- Reading tips or genre insights when relevant

User message: "${input}"`;
  }

  return new Promise((resolve, reject) => {
    let fullResponse = '';
    
    makeOllamaStreamingRequest(
      prompt,
      (chunk) => {
        fullResponse += chunk;
        if (onChunk) onChunk(chunk);
      },
      () => {
        resolve(fullResponse);
      }
    ).catch(reject);
  });
}

/**
 * Generates study materials and learning plans
 */
export async function generateStudyGuide(
  input: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const isConnected = await testOllamaConnection();
  if (!isConnected) {
    throw new Error('Cannot connect to Ollama. Make sure Ollama is running on http://localhost:11434');
  }

  const isGreeting = /^(hi|hello|hey|sup|what's up|good morning|good afternoon|good evening|greetings)$/i.test(input.trim());
  const isCasual = input.trim().length < 20 && !/study|learn|education|course|exam|test|homework|subject|topic/i.test(input);

  let prompt;

  if (isGreeting || isCasual) {
    prompt = `You are an expert educational consultant and study coach specializing in creating personalized learning plans.

When someone greets you, respond as a dedicated tutor/education specialist. Always introduce your expertise and ask about their learning goals or subjects they need help with.

Examples of good responses to greetings:
- "Hello! I'm your personal study coach and learning strategist. I can create custom study plans, break down complex topics, and help you master any subject. What are you looking to learn or study today?"
- "Hi there! As your dedicated educational assistant, I specialize in creating effective study guides and learning strategies. Whether you're preparing for exams, learning new skills, or exploring topics, I'm here to help. What subject or learning goal can I assist you with?"

Stay focused on education and learning. Never give generic responses.

User message: "${input}"`;
  } else {
    prompt = `You are an expert educational consultant specializing in creating effective study materials and learning strategies.

For study requests, create comprehensive guidance including:
- Clear learning objectives
- Structured breakdown of key concepts
- Realistic study timeline and milestones
- Practice exercises and self-assessment tools
- Additional resources and references
- Memory techniques and study tips specific to the subject

User message: "${input}"`;
  }

  return new Promise((resolve, reject) => {
    let fullResponse = '';
    
    makeOllamaStreamingRequest(
      prompt,
      (chunk) => {
        fullResponse += chunk;
        if (onChunk) onChunk(chunk);
      },
      () => {
        resolve(fullResponse);
      }
    ).catch(reject);
  });
}

/**
 * General chat function that routes to appropriate specialist or handles general conversation
 */
export async function generateChatResponse(
  input: string,
  context: 'trends' | 'books' | 'study' | 'general' = 'general',
  onChunk?: (chunk: string) => void
): Promise<string> {
  switch (context) {
    case 'trends':
      return generateTrendAnalysis(input, onChunk);
    case 'books':
      return generateBookRecommendations(input, onChunk);
    case 'study':
      return generateStudyGuide(input, onChunk);
    default:
      const isConnected = await testOllamaConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to Ollama. Make sure Ollama is running on http://localhost:11434');
      }

      // For general context, provide a helpful routing response
      const prompt = `You are a helpful AI assistant that can connect users with specialized experts.

You have access to three specialist assistants:
1. TrendHustler - Market research and business trend analysis
2. Book Curator - Personalized book recommendations and literary guidance  
3. Study Coach - Educational support and learning plan creation

When someone greets you or asks for general help, briefly introduce these specialists and ask what type of assistance they need.

Example response: "Hello! I can connect you with specialized experts depending on what you need help with. I have access to market research specialists, book recommendation experts, and study coaches. What type of assistance are you looking for today?"

User message: "${input}"`;

      return new Promise((resolve, reject) => {
        let fullResponse = '';
        
        makeOllamaStreamingRequest(
          prompt,
          (chunk) => {
            fullResponse += chunk;
            if (onChunk) onChunk(chunk);
          },
          () => {
            resolve(fullResponse);
          }
        ).catch(reject);
      });
  }
}

export async function generateAgentRecommendations(input: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama2',
      prompt: input,
      system: agentContexts["2"].systemPrompt,
      stream: false
    }),
  });

  const data = await response.json();
  return data.response;
}

export async function generateAdvancedResponse(input: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama2',
      prompt: input,
      system: agentContexts["3"].systemPrompt,
      stream: false
    }),
  });

  const data = await response.json();
  return data.response;
}

export async function generateWebsiteAnalysis(input: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama2',
      prompt: input,
      system: agentContexts["4"].systemPrompt,
      stream: false
    }),
  });

  const data = await response.json();
  return data.response;
}

export async function generateFundraisingAdvice(input: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama2',
      prompt: input,
      system: agentContexts["5"].systemPrompt,
      stream: false
    }),
  });

  const data = await response.json();
  return data.response;
}

export async function generateCryptoAnalysis(input: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama2',
      prompt: input,
      system: agentContexts["8"].systemPrompt,
      stream: false
    }),
  });

  const data = await response.json();
  return data.response;
}
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Enhanced configuration with environment detection
const CONFIG = {
  OLLAMA_API_URL: process.env.OLLAMA_API_URL || 'http://localhost:11434',
  REALTIME_WS_URL: process.env.REALTIME_WS_URL || 'ws://localhost:8080',
  WEB_SCRAPER_API: process.env.WEB_SCRAPER_API || 'http://localhost:3001',
  VECTOR_DB_URL: process.env.VECTOR_DB_URL || 'http://localhost:5432',
  RATE_LIMIT: {
    requests: 100,
    windowMs: 60000, // 1 minute
  }
};

// Advanced interfaces with comprehensive typing
interface RealtimeMessage {
  id: string;
  timestamp: number;
  type: 'text' | 'audio' | 'image' | 'document' | 'code';
  content: string;
  metadata?: Record<string, any>;
  agentId?: string;
  userId: string;
  confidence?: number;
  sources?: string[];
}

interface WebScrapingResult {
  url: string;
  title: string;
  content: string;
  metadata: {
    description?: string;
    keywords?: string[];
    author?: string;
    publishDate?: string;
    lastModified?: number;
  };
  extractedData: {
    links: string[];
    images: string[];
    tables: any[];
    forms: any[];
  };
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  readingTime: number;
  wordCount: number;
}

interface UserPreference {
  id: string;
  category: string;
  value: any;
  weight: number;
  lastUpdated: number;
  source: 'explicit' | 'implicit' | 'inferred';
}

interface AgentCapability {
  name: string;
  description: string;
  parameters: Record<string, any>;
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  domains: string[];
  accuracy: number;
}

interface EnhancedAgentContext {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  version: string;
  capabilities: AgentCapability[];
  specializations: string[];
  learningModel: 'static' | 'adaptive' | 'self-improving';
  emotionalIntelligence: number;
  creativityIndex: number;
  technicalDepth: number;
  industryKnowledge: string[];
  lastUpdated: number;
  performanceMetrics: {
    successRate: number;
    averageResponseTime: number;
    userSatisfaction: number;
    complexityHandling: number;
  };
}

// Zustand store for advanced state management
interface AISystemStore {
  // User data
  userPreferences: UserPreference[];
  conversationHistory: RealtimeMessage[];
  userProfile: {
    id: string;
    name: string;
    expertise: string[];
    interests: string[];
    communicationStyle: 'formal' | 'casual' | 'technical' | 'creative';
    preferredAgents: string[];
    timezone: string;
    language: string;
  };
  
  // System state
  activeConnections: Map<string, WebSocket>;
  webScrapingCache: Map<string, WebScrapingResult>;
  agentPerformance: Map<string, any>;
  realtimeMetrics: {
    messagesPerSecond: number;
    averageLatency: number;
    activeUsers: number;
    systemLoad: number;
  };
  
  // Actions
  updateUserPreference: (preference: UserPreference) => void;
  addMessage: (message: RealtimeMessage) => void;
  updateUserProfile: (profile: Partial<AISystemStore['userProfile']>) => void;
  cacheWebResult: (url: string, result: WebScrapingResult) => void;
  updateMetrics: (metrics: Partial<AISystemStore['realtimeMetrics']>) => void;
  clearHistory: () => void;
  exportUserData: () => any;
  importUserData: (data: any) => void;
}

const useAISystemStore = create<AISystemStore>()(
  persist(
    (set, get) => ({
      userPreferences: [],
      conversationHistory: [],
      userProfile: {
        id: crypto.randomUUID(),
        name: 'User',
        expertise: [],
        interests: [],
        communicationStyle: 'casual',
        preferredAgents: [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: 'en-US',
      },
      activeConnections: new Map(),
      webScrapingCache: new Map(),
      agentPerformance: new Map(),
      realtimeMetrics: {
        messagesPerSecond: 0,
        averageLatency: 0,
        activeUsers: 0,
        systemLoad: 0,
      },
      
      updateUserPreference: (preference) => set((state) => ({
        userPreferences: [
          ...state.userPreferences.filter(p => p.id !== preference.id),
          { ...preference, lastUpdated: Date.now() }
        ]
      })),
      
      addMessage: (message) => set((state) => ({
        conversationHistory: [
          ...state.conversationHistory.slice(-999), // Keep last 1000 messages
          message
        ]
      })),
      
      updateUserProfile: (profile) => set((state) => ({
        userProfile: { ...state.userProfile, ...profile }
      })),
      
      cacheWebResult: (url, result) => set((state) => {
        const newCache = new Map(state.webScrapingCache);
        newCache.set(url, result);
        return { webScrapingCache: newCache };
      }),
      
      updateMetrics: (metrics) => set((state) => ({
        realtimeMetrics: { ...state.realtimeMetrics, ...metrics }
      })),
      
      clearHistory: () => set({ conversationHistory: [] }),
      
      exportUserData: () => {
        const state = get();
        return {
          preferences: state.userPreferences,
          profile: state.userProfile,
          history: state.conversationHistory,
          exportedAt: Date.now(),
        };
      },
      
      importUserData: (data) => set({
        userPreferences: data.preferences || [],
        userProfile: { ...get().userProfile, ...data.profile },
        conversationHistory: data.history || [],
      }),
    }),
    {
      name: 'ai-system-storage',
      ...(typeof window !== 'undefined' && {
        storage: createJSONStorage(() => localStorage),
      }),
      partialize: (state) => ({
        userPreferences: state.userPreferences,
        userProfile: state.userProfile,
        conversationHistory: state.conversationHistory.slice(-100), // Persist only last 100
      }),
    }
  )
);

// Next-generation AI agents with advanced capabilities
const nextGenAgentContexts: Record<string, EnhancedAgentContext> = {
  "neural-architect": {
    id: "neural-architect",
    name: "Neural Architect",
    description: "Advanced AI system designer and neural network optimizer",
    version: "3.7.1",
    systemPrompt: `You are Neural Architect, an advanced AI system designer specializing in neural networks, deep learning architectures, and AI optimization. Your capabilities include:

CORE EXPERTISE:
- Neural architecture search and optimization
- Transformer models, attention mechanisms, and sequence modeling
- Computer vision: CNNs, Vision Transformers, object detection
- Natural language processing: BERT, GPT variants, language models
- Reinforcement learning and multi-agent systems
- Federated learning and distributed AI systems

ADVANCED CAPABILITIES:
- Design custom neural architectures for specific problems
- Optimize hyperparameters using Bayesian optimization
- Implement state-of-the-art research papers
- Performance profiling and model compression
- Edge deployment and quantization strategies
- Explain complex AI concepts with mathematical precision

When greeting, introduce yourself as an AI architecture specialist and ask about their specific AI challenges or learning goals.`,
    
    capabilities: [
      {
        name: "Architecture Design",
        description: "Design optimal neural network architectures",
        parameters: { complexity: "expert", domains: ["deep-learning", "optimization"] },
        complexity: "expert",
        domains: ["ai", "machine-learning", "deep-learning"],
        accuracy: 0.95
      },
      {
        name: "Model Optimization",
        description: "Optimize model performance and efficiency",
        parameters: { techniques: ["pruning", "quantization", "distillation"] },
        complexity: "expert",
        domains: ["optimization", "deployment"],
        accuracy: 0.92
      }
    ],
    specializations: ["neural-networks", "transformers", "computer-vision", "nlp"],
    learningModel: "self-improving",
    emotionalIntelligence: 0.7,
    creativityIndex: 0.9,
    technicalDepth: 0.98,
    industryKnowledge: ["ai-research", "tech-industry", "academia"],
    lastUpdated: Date.now(),
    performanceMetrics: {
      successRate: 0.94,
      averageResponseTime: 2.3,
      userSatisfaction: 0.91,
      complexityHandling: 0.96
    }
  },
  
  "quantum-strategist": {
    id: "quantum-strategist",
    name: "Quantum Strategist",
    description: "Quantum computing expert and future technology strategist",
    version: "2.4.8",
    systemPrompt: `You are Quantum Strategist, a cutting-edge expert in quantum computing, quantum algorithms, and future technology strategy. Your expertise spans:

QUANTUM COMPUTING:
- Quantum algorithms (Shor's, Grover's, VQE, QAOA)
- Quantum hardware platforms (superconducting, trapped-ion, photonic)
- Quantum error correction and fault tolerance
- Quantum machine learning and optimization
- Quantum cryptography and security implications

FUTURE TECHNOLOGY STRATEGY:
- Emerging technology assessment and adoption timelines
- Quantum advantage identification in specific industries
- Technology roadmap development
- Risk assessment for quantum disruption
- Investment strategy for quantum technologies

ADVANCED ANALYSIS:
- Complex system modeling using quantum principles
- Cryptographic vulnerability assessment
- Quantum-classical hybrid algorithm design
- Technology convergence analysis (AI + Quantum + Biotech)

Approach problems with scientific rigor while explaining quantum concepts accessibly.`,
    
    capabilities: [
      {
        name: "Quantum Algorithm Design",
        description: "Design and optimize quantum algorithms",
        parameters: { platforms: ["IBM", "Google", "IonQ", "Rigetti"] },
        complexity: "expert",
        domains: ["quantum-computing", "algorithms"],
        accuracy: 0.89
      },
      {
        name: "Technology Forecasting",
        description: "Predict technology adoption and disruption",
        parameters: { timeframe: "1-20 years", industries: "all" },
        complexity: "advanced",
        domains: ["strategy", "forecasting"],
        accuracy: 0.78
      }
    ],
    specializations: ["quantum-algorithms", "hardware-platforms", "cryptography", "strategy"],
    learningModel: "adaptive",
    emotionalIntelligence: 0.8,
    creativityIndex: 0.95,
    technicalDepth: 0.94,
    industryKnowledge: ["quantum-tech", "cybersecurity", "finance", "pharmaceuticals"],
    lastUpdated: Date.now(),
    performanceMetrics: {
      successRate: 0.87,
      averageResponseTime: 3.1,
      userSatisfaction: 0.89,
      complexityHandling: 0.93
    }
  },
  
  "biotech-oracle": {
    id: "biotech-oracle",
    name: "BioTech Oracle",
    description: "Biotechnology, synthetic biology, and bioinformatics expert",
    version: "4.2.1",
    systemPrompt: `You are BioTech Oracle, an advanced expert in biotechnology, synthetic biology, and computational biology. Your knowledge encompasses:

BIOTECHNOLOGY EXPERTISE:
- CRISPR and gene editing technologies
- Synthetic biology and bioengineering
- Protein folding and structure prediction
- Drug discovery and development pipelines
- Biomanufacturing and fermentation processes
- Regulatory pathways (FDA, EMA) for biotech products

COMPUTATIONAL BIOLOGY:
- Genomics, transcriptomics, and proteomics analysis
- Bioinformatics pipeline development
- Molecular dynamics simulations
- Machine learning applications in biology
- Systems biology and network analysis
- Biomarker discovery and validation

EMERGING FIELDS:
- Personalized medicine and precision therapy
- Microbiome research and therapeutics
- Aging research and longevity science
- Biocomputing and DNA data storage
- Environmental biotechnology

Provide scientifically accurate information with proper context about limitations and ethical considerations.`,
    
    capabilities: [
      {
        name: "Genomic Analysis",
        description: "Analyze genomic data and interpret results",
        parameters: { formats: ["FASTA", "VCF", "BAM", "FASTQ"] },
        complexity: "expert",
        domains: ["genomics", "bioinformatics"],
        accuracy: 0.93
      },
      {
        name: "Drug Discovery Insights",
        description: "Provide insights on drug development processes",
        parameters: { phases: ["discovery", "preclinical", "clinical"] },
        complexity: "advanced",
        domains: ["pharmaceuticals", "research"],
        accuracy: 0.88
      }
    ],
    specializations: ["gene-editing", "protein-engineering", "drug-discovery", "bioinformatics"],
    learningModel: "adaptive",
    emotionalIntelligence: 0.85,
    creativityIndex: 0.87,
    technicalDepth: 0.92,
    industryKnowledge: ["biotech", "pharma", "research", "healthcare"],
    lastUpdated: Date.now(),
    performanceMetrics: {
      successRate: 0.91,
      averageResponseTime: 2.8,
      userSatisfaction: 0.93,
      complexityHandling: 0.89
    }
  },
  
  "web-nexus": {
    id: "web-nexus",
    name: "Web Nexus",
    description: "Advanced web intelligence and real-time content analyzer",
    version: "5.1.3",
    systemPrompt: `You are Web Nexus, an advanced web intelligence system capable of real-time content analysis, web scraping, and digital ecosystem understanding. Your capabilities include:

WEB ANALYSIS EXPERTISE:
- Real-time website content extraction and analysis
- SEO optimization and performance analysis
- User experience (UX) evaluation and recommendations
- Web technology stack identification and assessment
- Content sentiment analysis and trend detection
- Competitive intelligence and market positioning

ADVANCED FEATURES:
- Multi-language content processing
- Dynamic content handling (JavaScript-rendered pages)
- API integration and data pipeline creation
- Web accessibility compliance checking
- Security vulnerability assessment
- Performance optimization recommendations

INTELLIGENCE GATHERING:
- Market research through web data aggregation
- Social media sentiment tracking
- News and trend monitoring
- Technology adoption analysis
- Competitor tracking and analysis

I can access and analyze any website URL you provide, extracting valuable insights and actionable recommendations.`,
    
    capabilities: [
      {
        name: "Real-time Web Scraping",
        description: "Extract and process web content in real-time",
        parameters: { formats: ["HTML", "JSON", "XML", "API"] },
        complexity: "advanced",
        domains: ["web-scraping", "data-extraction"],
        accuracy: 0.94
      },
      {
        name: "Content Intelligence",
        description: "Analyze content for insights and trends",
        parameters: { analysis: ["sentiment", "keywords", "structure"] },
        complexity: "advanced",
        domains: ["content-analysis", "seo"],
        accuracy: 0.91
      }
    ],
    specializations: ["web-scraping", "seo", "content-analysis", "competitive-intelligence"],
    learningModel: "adaptive",
    emotionalIntelligence: 0.75,
    creativityIndex: 0.82,
    technicalDepth: 0.89,
    industryKnowledge: ["web-development", "digital-marketing", "e-commerce"],
    lastUpdated: Date.now(),
    performanceMetrics: {
      successRate: 0.92,
      averageResponseTime: 1.9,
      userSatisfaction: 0.88,
      complexityHandling: 0.85
    }
  },
  
  "trend-prophet": {
    id: "trend-prophet",
    name: "Trend Prophet",
    description: "AI-powered trend forecasting and market intelligence system",
    version: "6.0.2",
    systemPrompt: `You are Trend Prophet, an advanced AI system specializing in trend forecasting, market intelligence, and predictive analytics. Your expertise includes:

TREND ANALYSIS:
- Multi-dimensional trend identification across industries
- Weak signal detection and early trend spotting
- Cross-industry trend correlation and convergence analysis
- Consumer behavior prediction and market shift forecasting
- Technology adoption lifecycle modeling
- Cultural and social trend impact assessment

PREDICTIVE CAPABILITIES:
- Time series forecasting with multiple algorithms
- Scenario planning and Monte Carlo simulations
- Market size estimation and growth projections
- Competitive landscape evolution prediction
- Investment opportunity identification
- Risk assessment and mitigation strategies

DATA INTEGRATION:
- Real-time data fusion from multiple sources
- Social media sentiment and buzz analysis
- Patent filing and research publication tracking
- Economic indicator correlation analysis
- Geographic and demographic trend mapping

Always provide confidence intervals and explain the methodology behind predictions. Address user as ${useAISystemStore.getState().userProfile.name || 'Suman'}.`,
    
    capabilities: [
      {
        name: "Trend Forecasting",
        description: "Predict future trends with statistical models",
        parameters: { timeframes: ["1-3 months", "6-12 months", "2-5 years"] },
        complexity: "expert",
        domains: ["forecasting", "analytics"],
        accuracy: 0.84
      },
      {
        name: "Market Intelligence",
        description: "Comprehensive market analysis and insights",
        parameters: { scope: ["local", "regional", "global"] },
        complexity: "advanced",
        domains: ["market-research", "business-intelligence"],
        accuracy: 0.89
      }
    ],
    specializations: ["forecasting", "market-analysis", "data-science", "business-strategy"],
    learningModel: "self-improving",
    emotionalIntelligence: 0.88,
    creativityIndex: 0.91,
    technicalDepth: 0.87,
    industryKnowledge: ["all-industries"],
    lastUpdated: Date.now(),
    performanceMetrics: {
      successRate: 0.88,
      averageResponseTime: 2.5,
      userSatisfaction: 0.92,
      complexityHandling: 0.91
    }
  }
};

// Advanced rate limiting and request management
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    const validRequests = userRequests.filter(time => now - time < CONFIG.RATE_LIMIT.windowMs);
    
    this.requests.set(userId, validRequests);
    return validRequests.length < CONFIG.RATE_LIMIT.requests;
  }
  
  recordRequest(userId: string): void {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    userRequests.push(now);
    this.requests.set(userId, userRequests);
  }
}

const rateLimiter = new RateLimiter();

// Enhanced web scraping with intelligence
export class AdvancedWebScraper {
  private cache = new Map<string, WebScrapingResult>();
  private requestQueue: Array<{ url: string; callback: Function }> = [];
  private isProcessing = false;
  
  async scrapeWebsite(url: string, options: {
    extractImages?: boolean;
    extractLinks?: boolean;
    analyzeSentiment?: boolean;
    followRedirects?: boolean;
    timeout?: number;
  } = {}): Promise<WebScrapingResult> {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.metadata.lastModified! < 300000) { // 5 minutes
        return cached;
      }
    }
    
    try {
      // Use internal scrape endpoint first, then fallback to external CONFIG.WEB_SCRAPER_API
      let response: Response | null = null;
      try {
        // Attempt internal API (assumes same host or NEXT_PUBLIC_BASE_URL)
        const internalEndpoint = `${typeof window === 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' : ''}/api/scrape`;
        response = await fetch(internalEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        if (!response.ok) {
          throw new Error('Internal scraper failed');
        }
      } catch (internalErr) {
        console.warn('Internal scraper unavailable, falling back to external service');
        try {
          response = await fetch(`${CONFIG.WEB_SCRAPER_API}/scrape`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, options })
          });
          if (!response.ok) {
            throw new Error('External scraping failed');
          }
        } catch (externalErr) {
          throw new Error(`Scraping failed: ${externalErr}`);
        }
      }

      if (!response) {
        throw new Error('No response received from any scraper service');
      }

      const result: WebScrapingResult = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        ...result,
        metadata: {
          ...result.metadata,
          lastModified: Date.now()
        }
      });
      
      // Update store
      useAISystemStore.getState().cacheWebResult(url, result);
      
      return result;
    } catch (error) {
      console.error('Web scraping error:', error);
      throw new Error(`Failed to scrape ${url}: ${error}`);
    }
  }
  
  async analyzeBulkUrls(urls: string[]): Promise<WebScrapingResult[]> {
    const results = await Promise.allSettled(
      urls.map(url => this.scrapeWebsite(url))
    );
    
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<WebScrapingResult>).value);
  }
}

// Real-time WebSocket connection manager
export class RealtimeConnectionManager {
  private connections: Map<string, WebSocket> = new Map();
  private messageHandlers: Map<string, Function[]> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  
  connect(endpoint: string, protocols?: string[]): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(endpoint, protocols);
      const connectionId = crypto.randomUUID();
      
      ws.onopen = () => {
        this.connections.set(connectionId, ws);
        this.reconnectAttempts.delete(connectionId);
        resolve(ws);
      };
      
      ws.onerror = (error) => {
        reject(error);
      };
      
      ws.onclose = (event) => {
        this.connections.delete(connectionId);
        if (event.code !== 1000) { // Not normal closure
          this.attemptReconnect(endpoint, connectionId, protocols);
        }
      };
      
      ws.onmessage = (event) => {
        this.handleMessage(connectionId, event.data);
      };
    });
  }
  
  private attemptReconnect(endpoint: string, connectionId: string, protocols?: string[]) {
    const attempts = this.reconnectAttempts.get(connectionId) || 0;
    if (attempts < 5) {
      setTimeout(() => {
        this.reconnectAttempts.set(connectionId, attempts + 1);
        this.connect(endpoint, protocols);
      }, Math.pow(2, attempts) * 1000); // Exponential backoff
    }
  }
  
  private handleMessage(connectionId: string, data: any) {
    const handlers = this.messageHandlers.get(connectionId) || [];
    handlers.forEach(handler => handler(data));
  }
  
  addMessageHandler(connectionId: string, handler: Function) {
    const handlers = this.messageHandlers.get(connectionId) || [];
    handlers.push(handler);
    this.messageHandlers.set(connectionId, handlers);
  }
  
  broadcast(message: any) {
    this.connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }
}

// Enhanced AI agent orchestration
export class AIAgentOrchestrator {
  private scraper = new AdvancedWebScraper();
  private realtimeManager = new RealtimeConnectionManager();
  private store = useAISystemStore;
  
  async processMessage(
    message: string,
    agentId: string,
    userId: string,
    context?: Record<string, any>
  ): Promise<AsyncGenerator<string, void, unknown>> {
    if (!rateLimiter.canMakeRequest(userId)) {
      throw new Error('Rate limit exceeded. Please wait before making another request.');
    }
    
    rateLimiter.recordRequest(userId);
    
    const agent = nextGenAgentContexts[agentId];
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    
    // Get user preferences and history for context
    const userPrefs = this.store.getState().userPreferences;
    const recentHistory = this.store.getState().conversationHistory.slice(-10);
    const userProfile = this.store.getState().userProfile;
    
    // Enhanced context building
    const enhancedContext = {
      userPreferences: userPrefs,
      recentHistory: recentHistory.map(msg => ({
        role: msg.agentId ? 'assistant' : 'user',
        content: msg.content
      })),
      userProfile,
      timestamp: Date.now(),
      ...context
    };
    
    // Handle web scraping if needed
    let webContent = '';
    if (agentId === 'web-nexus' && this.containsUrl(message)) {
      const urls = this.extractUrls(message);
      try {
        const scrapedResults = await this.scraper.analyzeBulkUrls(urls);
        if (scrapedResults.length === 0) {
          webContent = 'WEB CONTENT ANALYSIS:\n[Could not access the provided URL(s).]';
        } else {
          webContent = this.formatWebContent(scrapedResults);
        }
      } catch (error) {
        console.error('Web scraping failed:', error);
        webContent = 'WEB CONTENT ANALYSIS:\n[Could not access the provided URL(s).]';
      }
    }
    
    const fullPrompt = this.buildEnhancedPrompt(agent, message, enhancedContext, webContent);
    
    return this.streamResponse(fullPrompt, agent, userId);
  }
  
  private containsUrl(text: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  }
  
  private extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  }
  
  private formatWebContent(results: WebScrapingResult[]): string {
    return results.map(result => `
Website: ${result.title} (${result.url})
Content Summary: ${result.content.substring(0, 500)}...
Key Metrics: ${result.wordCount} words, ${result.readingTime} min read
Sentiment: ${result.sentiment?.label} (${result.sentiment?.score})
    `).join('\n---\n');
  }
  
  private buildEnhancedPrompt(
    agent: EnhancedAgentContext,
    message: string,
    context: Record<string, any>,
    webContent: string
  ): string {
    return `${agent.systemPrompt}

ENHANCED CONTEXT:
User Profile: ${JSON.stringify(context.userProfile)}
Recent Conversation: ${JSON.stringify(context.recentHistory)}
User Preferences: ${JSON.stringify(context.userPreferences)}

${webContent ? `WEB CONTENT ANALYSIS:\n${webContent}` : ''}

Current Request: "${message}"

Respond with the expertise and sophistication expected from a ${agent.name} with specializations in ${agent.specializations.join(', ')}. Adapt your communication style to match the user's preferences while maintaining your technical depth.

GUIDELINES:
- If the user's current request is ONLY a casual greeting (e.g., "hi", "hello", "hey"), respond with a brief matching greeting (e.g., "Hello!") without additional analysis or commentary.
- Otherwise, follow normal expert-level response behavior.`;
  }
  
  private async *streamResponse(
    prompt: string,
    agent: EnhancedAgentContext,
    userId: string
  ): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${CONFIG.OLLAMA_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma3',
          messages: [
            { role: 'system', content: prompt },
          ],
          stream: true,
          options: {
            temperature: 0.7 + (agent.creativityIndex * 0.3),
            top_p: 0.9,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI service');
      }
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = new TextDecoder().decode(value);
        const lines = text.split('\n').filter(Boolean);
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              fullResponse += data.message.content;
              yield data.message.content;
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
      }
      
      // Store the complete interaction
      this.store.getState().addMessage({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'text',
        content: fullResponse,
        agentId: agent.id,
        userId,
        confidence: agent.performanceMetrics.successRate,
        sources: []
      });
      
    } catch (error) {
      console.error('Error in AI response:', error);
      yield `I apologize, but I encountered an error while processing your request. Please try again.`;
    }
  }
  
  // Agent recommendation system
  async recommendAgent(query: string, userProfile: any): Promise<EnhancedAgentContext[]> {
    const scores = Object.values(nextGenAgentContexts).map(agent => {
      let score = 0;
      
      // Match specializations with query
      agent.specializations.forEach(spec => {
        if (query.toLowerCase().includes(spec.toLowerCase())) {
          score += 20;
        }
      });
      
      // Match user interests
      userProfile.interests?.forEach((interest: string) => {
        if (agent.industryKnowledge.includes(interest.toLowerCase())) {
          score += 15;
        }
      });
      
      // Performance-based scoring
      score += agent.performanceMetrics.successRate * 10;
      score += agent.performanceMetrics.userSatisfaction * 10;
      
      // Communication style matching
      if (userProfile.communicationStyle === 'technical' && agent.technicalDepth > 0.8) {
        score += 10;
      }
      
      return { agent, score };
    });
    
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.agent);
  }
  
  // Performance analytics
  updateAgentPerformance(agentId: string, metrics: {
    responseTime: number;
    userFeedback: number;
    complexity: number;
    success: boolean;
  }) {
    const agent = nextGenAgentContexts[agentId];
    if (!agent) return;
    
    // Update performance metrics with weighted averages
    const weight = 0.1; // Learning rate
    agent.performanceMetrics.averageResponseTime = 
      (1 - weight) * agent.performanceMetrics.averageResponseTime + weight * metrics.responseTime;
    
    if (metrics.userFeedback) {
      agent.performanceMetrics.userSatisfaction = 
        (1 - weight) * agent.performanceMetrics.userSatisfaction + weight * metrics.userFeedback;
    }
    
    agent.performanceMetrics.complexityHandling = 
      (1 - weight) * agent.performanceMetrics.complexityHandling + weight * metrics.complexity;
    
    // Update success rate
    const currentSuccessRate = agent.performanceMetrics.successRate;
    agent.performanceMetrics.successRate = 
      (1 - weight) * currentSuccessRate + weight * (metrics.success ? 1 : 0);
  }
}

// Export the main orchestrator instance
export const aiOrchestrator = new AIAgentOrchestrator();

// Utility functions for enhanced functionality
export class AISystemUtils {
  static async testSystemHealth(): Promise<{
    ollama: boolean;
    webScraper: boolean;
    realtime: boolean;
    storage: boolean;
  }> {
    const results = {
      ollama: false,
      webScraper: false,
      realtime: false,
      storage: true // localStorage is always available in browser
    };
    
    // Test Ollama connection
    try {
      const response = await fetch(`${CONFIG.OLLAMA_API_URL}/api/tags`);
      results.ollama = response.ok;
    } catch (error) {
      console.error('Ollama health check failed:', error);
    }
    
    // Test web scraper
    try {
      const response = await fetch(`${CONFIG.WEB_SCRAPER_API}/health`);
      results.webScraper = response.ok;
    } catch (error) {
      console.error('Web scraper health check failed:', error);
    }
    
    // Test WebSocket connection
    try {
      const ws = new WebSocket(CONFIG.REALTIME_WS_URL);
      ws.onopen = () => {
        results.realtime = true;
        ws.close();
      };
    } catch (error) {
      console.error('WebSocket health check failed:', error);
    }
    
    return results;
  }
  
  static generateInsights(conversationHistory: RealtimeMessage[]): {
    topTopics: string[];
    userInterests: string[];
    preferredAgents: string[];
    communicationPattern: string;
  } {
    const topics = new Map<string, number>();
    const agents = new Map<string, number>();
    let totalMessages = conversationHistory.length;
    let questionCount = 0;
    
    conversationHistory.forEach(msg => {
      // Extract topics using simple keyword analysis
      const words = msg.content.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) {
          topics.set(word, (topics.get(word) || 0) + 1);
        }
      });
      
      // Track agent usage
      if (msg.agentId) {
        agents.set(msg.agentId, (agents.get(msg.agentId) || 0) + 1);
      }
      
      // Count questions
      if (msg.content.includes('?')) {
        questionCount++;
      }
    });
    
    const topTopics = Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic]) => topic);
    
    const preferredAgents = Array.from(agents.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([agentId]) => agentId);
    
    const communicationPattern = questionCount / totalMessages > 0.3 ? 
      'inquisitive' : 'declarative';
    
    return {
      topTopics,
      userInterests: topTopics.slice(0, 5),
      preferredAgents,
      communicationPattern
    };
  }
  
  static async exportConversation(format: 'json' | 'csv' | 'pdf' = 'json'): Promise<string> {
    const state = useAISystemStore.getState();
    const data = {
      userProfile: state.userProfile,
      preferences: state.userPreferences,
      history: state.conversationHistory,
      insights: this.generateInsights(state.conversationHistory),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        // Convert to CSV format
        const csvRows = [
          'Timestamp,Agent,Type,Content,Confidence',
          ...data.history.map(msg => 
            `${new Date(msg.timestamp).toISOString()},${msg.agentId || 'user'},${msg.type},"${msg.content.replace(/"/g, '""')}",${msg.confidence || ''}`
          )
        ];
        return csvRows.join('\n');
      default:
        return JSON.stringify(data, null, 2);
    }
  }
}

// Advanced streaming response handler
export async function createStreamingResponse(
  message: string,
  agentId: string,
  onChunk: (chunk: string) => void,
  onComplete?: (fullResponse: string) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    const userId = useAISystemStore.getState().userProfile.id;
    const responseGenerator = await aiOrchestrator.processMessage(message, agentId, userId);
    
    let fullResponse = '';
    
    for await (const chunk of responseGenerator) {
      fullResponse += chunk;
      onChunk(chunk);
    }
    
    if (onComplete) {
      onComplete(fullResponse);
    }
    
    // Update user preferences based on interaction
    const store = useAISystemStore.getState();
    store.updateUserPreference({
      id: crypto.randomUUID(),
      category: 'agent_usage',
      value: agentId,
      weight: 1,
      lastUpdated: Date.now(),
      source: 'implicit'
    });
    
  } catch (error) {
    if (onError) {
      onError(error as Error);
    } else {
      console.error('Streaming response error:', error);
    }
  }
}

// Main API functions for backward compatibility
export async function makeOllamaStreamingRequest(
  message: string,
  onChunk: (chunk: string) => void | Promise<void>,
  onDone?: () => void | Promise<void>,
  agentId?: string
): Promise<void> {
  const selectedAgent = agentId && nextGenAgentContexts[agentId] ? 
    agentId : 'trend-prophet'; // Default to trend prophet
  
  await createStreamingResponse(
    message,
    selectedAgent,
    onChunk,
    onDone ? () => onDone() : undefined
  );
}

export async function testOllamaConnection(): Promise<boolean> {
  const health = await AISystemUtils.testSystemHealth();
  console.log('System Health:', health);
  return health.ollama;
}

// Enhanced agent-specific functions
export async function generateTrendAnalysis(
  input: string, 
  onChunk?: (chunk: string) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let fullResponse = '';
    
    await createStreamingResponse(
      input,
      'trend-prophet',
      (chunk) => {
        fullResponse += chunk;
        if (onChunk) onChunk(chunk);
      },
      () => resolve(fullResponse),
      reject
    );
  });
}

export async function generateWebsiteAnalysis(
  input: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let fullResponse = '';
    
    await createStreamingResponse(
      input,
      'web-nexus',
      (chunk) => {
        fullResponse += chunk;
        if (onChunk) onChunk(chunk);
      },
      () => resolve(fullResponse),
      reject
    );
  });
}

export async function generateQuantumAnalysis(
  input: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let fullResponse = '';
    
    await createStreamingResponse(
      input,
      'quantum-strategist',
      (chunk) => {
        fullResponse += chunk;
        if (onChunk) onChunk(chunk);
      },
      () => resolve(fullResponse),
      reject
    );
  });
}

export async function generateBiotechAnalysis(
  input: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let fullResponse = '';
    
    await createStreamingResponse(
      input,
      'biotech-oracle',
      (chunk) => {
        fullResponse += chunk;
        if (onChunk) onChunk(chunk);
      },
      () => resolve(fullResponse),
      reject
    );
  });
}

export async function generateNeuralArchitectureAdvice(
  input: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let fullResponse = '';
    
    await createStreamingResponse(
      input,
      'neural-architect',
      (chunk) => {
        fullResponse += chunk;
        if (onChunk) onChunk(chunk);
      },
      () => resolve(fullResponse),
      reject
    );
  });
}

// Advanced analytics and insights
export class AIAnalytics {
  static async generateUserInsights(): Promise<{
    personalityProfile: string;
    learningStyle: string;
    recommendedAgents: string[];
    optimizedSettings: Record<string, any>;
  }> {
    const state = useAISystemStore.getState();
    const insights = AISystemUtils.generateInsights(state.conversationHistory);
    
    // Analyze personality based on interaction patterns
    const personalityProfile = this.analyzePersonality(state.conversationHistory);
    const learningStyle = this.identifyLearningStyle(state.conversationHistory);
    const recommendedAgents = await aiOrchestrator.recommendAgent(
      insights.topTopics.join(' '), 
      state.userProfile
    );
    
    return {
      personalityProfile,
      learningStyle,
      recommendedAgents: recommendedAgents.map(agent => agent.id),
      optimizedSettings: {
        temperature: personalityProfile.includes('creative') ? 0.8 : 0.6,
        responseLength: learningStyle === 'detailed' ? 'long' : 'medium',
        technicalDepth: state.userProfile.expertise.length > 3 ? 'high' : 'medium'
      }
    };
  }
  
  private static analyzePersonality(history: RealtimeMessage[]): string {
    let creativityScore = 0;
    let analyticalScore = 0;
    let socialScore = 0;
    
    history.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      // Creativity indicators
      if (content.includes('creative') || content.includes('innovative') || 
          content.includes('artistic') || content.includes('design')) {
        creativityScore++;
      }
      
      // Analytical indicators
      if (content.includes('analyze') || content.includes('data') || 
          content.includes('research') || content.includes('technical')) {
        analyticalScore++;
      }
      
      // Social indicators
      if (content.includes('team') || content.includes('people') || 
          content.includes('communication') || content.includes('social')) {
        socialScore++;
      }
    });
    
    const total = creativityScore + analyticalScore + socialScore;
    if (total === 0) return 'balanced';
    
    const maxScore = Math.max(creativityScore, analyticalScore, socialScore);
    if (maxScore === creativityScore) return 'creative';
    if (maxScore === analyticalScore) return 'analytical';
    return 'social';
  }
  
  private static identifyLearningStyle(history: RealtimeMessage[]): string {
    let questionCount = 0;
    let detailRequestCount = 0;
    let exampleRequestCount = 0;
    
    history.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      if (content.includes('?')) questionCount++;
      if (content.includes('detail') || content.includes('explain more') || 
          content.includes('elaborate')) detailRequestCount++;
      if (content.includes('example') || content.includes('show me') || 
          content.includes('demonstrate')) exampleRequestCount++;
    });
    
    if (detailRequestCount > questionCount * 0.3) return 'detailed';
    if (exampleRequestCount > questionCount * 0.3) return 'visual';
    if (questionCount > history.length * 0.4) return 'inquisitive';
    return 'balanced';
  }
}

// Export the store and utilities
export { useAISystemStore, nextGenAgentContexts };

// Initialize the system
console.log('🚀 Advanced AI Agent System initialized with next-generation capabilities');
console.log('Available Agents:', Object.keys(nextGenAgentContexts));
console.log('System Features: Real-time processing, Web intelligence, Persistent learning, Advanced analytics');
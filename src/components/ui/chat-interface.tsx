'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Loader2, Square } from 'lucide-react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  isStreaming?: boolean;
  ipfsHash?: string;
}

interface ChatInterfaceProps {
  agentId?: string;
  hasUsedTrial: boolean;
  onTrialUsed: () => void;
}

export function ChatInterface({ agentId, hasUsedTrial, onTrialUsed }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesDivRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();

  const scrollToBottom = () => {
    if (messagesDivRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = messagesDivRef.current;
      const isAtBottom = scrollHeight - clientHeight <= scrollTop + 100;
      
      if (isAtBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
      
      // Update the last message to show generation was stopped
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant' && lastMessage.isStreaming) {
          lastMessage.isStreaming = false;
          lastMessage.content += '\n[Generation stopped]';
        }
        return newMessages;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent, transactionHash?: string) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);

    // Create a new AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          agentId,
          walletAddress: address,
          transactionHash,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      let ipfsHash = '';
      let currentContent = '';

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        
        // Check if this chunk contains the IPFS hash
        if (chunk.includes('---\nChat history stored in IPFS:')) {
          const hashMatch = chunk.match(/IPFS: ([a-zA-Z0-9]+)/);
          if (hashMatch) {
            ipfsHash = hashMatch[1];
            // Don't add the IPFS message to the content
            continue;
          }
        }

        // Update the content without the IPFS message
        if (!chunk.includes('---\nChat history stored in IPFS:')) {
          currentContent += chunk;
          // Update the last message with the new content
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content = currentContent;
              if (ipfsHash) {
                lastMessage.ipfsHash = ipfsHash;
              }
            }
            return newMessages;
          });
        }
      }

      // If this was a trial message, notify parent component
      if (!hasUsedTrial && !transactionHash) {
        onTrialUsed();
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // Handle abort case - already handled in stopGeneration
        return;
      }
      
      console.error('Error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.content = 'Sorry, an error occurred while processing your request.';
        }
        return newMessages;
      });
      toast.error('Failed to process request: ' + (error as Error).message);
    } finally {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.isStreaming = false;
        }
        return newMessages;
      });
      setIsLoading(false);
      setAbortController(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] max-w-3xl mx-auto bg-gray-900 rounded-lg border border-gray-800">
      <div 
        ref={messagesDivRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <div className="prose prose-invert whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              {message.isStreaming && (
                <div className="mt-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <button
                    onClick={stopGeneration}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Square className="w-3 h-3" />
                    Stop
                  </button>
                </div>
              )}
              {message.ipfsHash && !message.isStreaming && (
                <div className="mt-2 text-xs text-gray-400">
                  Stored in IPFS: {message.ipfsHash}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white rounded-lg p-3 min-h-[44px] max-h-[200px] resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 
import { Agent } from '@/types';
import Link from 'next/link';
import { formatEthAmount } from '@/lib/x402';
import { useState } from 'react';

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-6 
        transition-all duration-300 ${isHovered ? 'transform scale-105 shadow-2xl shadow-blue-500/20' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-6">
        {agent.imageUrl ? (
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30 shadow-inner">
            <img
              src={agent.imageUrl}
              alt={agent.name}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-3xl text-white">{agent.name.charAt(0)}</span>
          </div>
        )}
        
        <div className="absolute top-0 right-0 backdrop-blur-md bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          <span className="text-green-400 text-sm font-medium">
            {formatEthAmount(agent.cost)}
          </span>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
        <p className="text-gray-300 line-clamp-2 text-sm">{agent.description}</p>
      </div>

      <Link
        href={`/agent/${agent.id}`}
        className={`block w-full text-center py-3 rounded-lg font-medium 
          backdrop-blur-sm transition-all duration-300 ${
          isHovered 
            ? 'bg-blue-600/80 text-white transform translate-y-0 shadow-lg shadow-blue-500/30'
            : 'bg-white/10 text-blue-400 transform translate-y-1'
        }`}
      >
        Use Agent
      </Link>
    </div>
  );
} 
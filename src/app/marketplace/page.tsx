'use client';

import { useState, useEffect } from "react";
import { Agent } from "@/types";
import { getAgents } from "@/lib/api";
import AgentCard from "@/components/AgentCard";
import { LineChart, Brain, Bot, Network, Zap } from 'lucide-react';

export default function Marketplace() {  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0118] text-white pt-24">


      {/* Agents Grid */}
      <section >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4"> Agents</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our collection of specialized AI agents, each designed to excel in specific tasks
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              {agents.length === 0 ? (
                <div className="text-center text-gray-400">
                  <p>No agents available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {agents.map((agent: Agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
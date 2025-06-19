"use client";

import { useState, useEffect } from "react";
// import { Toaster } from 'react-hot-toast';
import { Agent } from "@/types";
import { getAgents } from "@/lib/api";



import AgentCard from "@/components/AgentCard";
import WalletConnect from "@/components/WalletConnect";


import { config } from "@/app/config";

export default function Home() {  
  const [agents, setAgents] = useState<Agent[]>([]);
  // const [walletInfo, setWalletInfo] = useState<WalletInfo | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        console.log("API Response:", data); // Debug log
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
    <main className="min-h-screen bg-black text-white">
      {/* <Toaster position="top-right" /> */}

      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">


         
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {agents.map((agent: Agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
// import { Toaster } from 'react-hot-toast';
import { Agent } from "@/types";
import { getAgents } from "@/lib/api";
import AgentCard from "@/components/AgentCard";
import { 
  Brain, 
  Bot, 
  Network, 
  Zap, 
  LineChart, 
  Lock,
  Users,
  Wallet,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

import { config } from "@/app/config";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is the Agent Marketplace?",
    answer: "The Agent Marketplace is a decentralized platform where you can discover and interact with specialized AI agents. Each agent is designed to excel at specific tasks, from market analysis to creative writing."
  },
  {
    question: "How do AI agents work?",
    answer: "AI agents use advanced language models and specialized training to perform specific tasks. They can understand natural language, process information, and provide detailed responses or complete complex tasks based on their specialization."
  },
  {
    question: "Are the agents secure?",
    answer: "Yes, our agents operate on a secure, decentralized infrastructure. All interactions are encrypted, and we implement strict protocols to ensure data privacy and security."
  },
  {
    question: "How much does it cost to use an agent?",
    answer: "Each agent has its own pricing structure based on its capabilities. Many agents offer a free trial, after which you can purchase credits or subscribe for continued use."
  },
  {
    question: "Can agents work together?",
    answer: "Yes! Our agents are designed to collaborate seamlessly. You can combine multiple agents to tackle complex tasks that require different specializations."
  }
];

export default function Home() {  
  const [agents, setAgents] = useState<Agent[]>([]);
  // const [walletInfo, setWalletInfo] = useState<WalletInfo | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

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

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[#0A0118] text-white overflow-hidden">
      {/* <Toaster position="top-right" /> */}

      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">


         
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        <div className="absolute w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-purple-800/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-700" />
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <h2 className="relative text-sm font-medium text-purple-300 bg-purple-900/50 px-4 py-2 rounded-full border border-purple-700/50">
                Welcome to the Future of AI
              </h2>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Agent Marketplace
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Discover a new era of AI collaboration. Connect with specialized agents that understand your needs and deliver exceptional results.
            </p>
            
            <Link href="/marketplace" className="group relative inline-flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <button className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full font-medium 
                text-white flex items-center gap-2 group-hover:shadow-xl group-hover:shadow-purple-500/20 
                transition-all duration-300 hover:scale-105">
                Explore Marketplace
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Feature Icons */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Brain, label: "AI Powered", color: "purple" },
              { icon: Bot, label: "Smart Agents", color: "blue" },
              { icon: Network, label: "Decentralized", color: "pink" },
              { icon: Zap, label: "Fast & Efficient", color: "yellow" }
            ].map((feature, index) => (
              <div key={index} className="group flex flex-col items-center">
                <div className={`w-16 h-16 rounded-2xl bg-purple-900/30 flex items-center justify-center mb-4
                  group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/20
                  transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Marketplace?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience the power of specialized AI agents working together to achieve your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Specialized Agents",
                description: "Each agent is expertly trained for specific tasks, ensuring high-quality results",
                icon: Bot
              },
              {
                title: "Seamless Integration",
                description: "Agents work together effortlessly, combining their capabilities for complex tasks",
                icon: Network
              },
              {
                title: "Secure & Private",
                description: "Your data is protected with state-of-the-art encryption and security measures",
                icon: Lock
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative p-8 rounded-2xl bg-purple-900/20 border border-purple-900/50
                  group-hover:border-purple-600/50 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-purple-900/30 flex items-center justify-center mb-6
                    group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/20
                    transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about our AI Agent Marketplace
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 rounded-2xl bg-purple-900/20 border border-purple-900/50
                    hover:border-purple-600/50 transition-colors flex items-center justify-between
                    group"
                >
                  <span className="font-medium group-hover:text-purple-300 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-purple-400 transition-transform duration-300 
                      ${openFAQ === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFAQ === index && (
                  <div className="px-6 py-4 text-gray-400 bg-purple-900/10 rounded-b-2xl border-x border-b
                    border-purple-900/50 -mt-[1px]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="relative rounded-3xl p-12 text-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-purple-600/50" />
            <div className="absolute w-[300px] h-[300px] bg-purple-600/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
            <div className="absolute w-[250px] h-[250px] bg-purple-800/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-700" />
            
            <div className="relative">
              <h2 className="text-3xl font-bold mb-6">Ready to Experience the Future?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the revolution in AI collaboration. Start exploring our marketplace today.
              </p>
              <Link href="/marketplace" className="group inline-flex items-center">
                <button className="px-8 py-4 bg-white text-purple-900 rounded-full font-medium 
                  flex items-center gap-2 group-hover:bg-purple-100 transition-colors">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

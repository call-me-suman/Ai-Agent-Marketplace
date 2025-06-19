'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { metaMask, coinbaseWallet } from 'wagmi/connectors';
import { History, Wallet } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-sm';

  return (
    <a href={href} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
    </div>
  );

  const navLinksData = [
    { label: 'Marketplace', href: '/' },
    { label: 'History', href: '/history', icon: <History className="w-4 h-4" /> },
  ];

  const connectMetamask = () => {
    connect({ connector: metaMask() });
  };

  const connectCoinbase = () => {
    connect({ connector: coinbaseWallet() });
  };

  const walletButtons = isConnected ? (
    <div className="flex items-center gap-2">
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <button
        onClick={connectMetamask}
        className="px-4 py-2 text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors"
      >
        MetaMask
      </button>
      <button
        onClick={connectCoinbase}
        className="px-4 py-2 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200"
      >
        Coinbase
      </button>
    </div>
  );

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-sm
                       ${headerShapeClass}
                       border border-[#333] bg-[#1f1f1f57]
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-0 ease-in-out`}>
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center gap-2">
          {logoElement}
          <Link 
            href="/" 
            className={`text-white font-semibold transition-colors hover:text-blue-400 ${
              isActive('/') ? 'text-blue-500' : 'text-gray-200'
            }`}
          >
            Agent Marketplace
          </Link>
        </div>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-medium transition-colors hover:text-blue-400 ${
                isActive(link.href) ? 'text-blue-500' : 'text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {link.icon}
                <span>{link.label}</span>
              </div>
              {isActive(link.href) && (
                <span className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-blue-500" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          {walletButtons}
        </div>

        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-gray-300 hover:text-white transition-colors w-full text-center flex items-center justify-center gap-2 ${
                isActive(link.href) ? 'text-blue-500' : ''
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {walletButtons}
        </div>
      </div>
    </header>
  );
} 
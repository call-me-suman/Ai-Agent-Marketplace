"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import WalletConnect from "../WalletConnect";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full");
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass("rounded-xl");
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass("rounded-full");
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

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                     flex flex-col items-center
                     pl-6 pr-6 py-3 backdrop-blur-sm
                     ${headerShapeClass}
                     border border-[#333] bg-[#1f1f1f57]
                     w-[calc(100%-2rem)] sm:w-auto
                     transition-[border-radius] duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center gap-2">
          {logoElement}
          <Link
            href="/"
            className={`text-white font-semibold transition-colors hover:text-purple-400 ${
              isActive("/") ? "text-purple-500" : "text-gray-200"
            }`}
          >
            AI Agents
          </Link>
        </div>

        <nav className="hidden sm:flex items-center space-x-6 text-sm">
          <Link
            href="/marketplace"
            className={`relative font-medium transition-colors hover:text-purple-400 ${
              isActive("/marketplace") ? "text-purple-500" : "text-gray-200"
            }`}
          >
            <span>Marketplace</span>
            {isActive("/marketplace") && (
              <span className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-purple-500" />
            )}
          </Link>
          <Link
            href="/history"
            className={`relative font-medium transition-colors hover:text-purple-400 ${
              isActive("/history") ? "text-purple-500" : "text-gray-200"
            }`}
          >
            <span>History</span>
            {isActive("/history") && (
              <span className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-purple-500" />
            )}
          </Link>
        </nav>

        <div className="hidden sm:block">
          <WalletConnect />
        </div>

        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          )}
        </button>
      </div>

      <div
        className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                     ${
                       isOpen
                         ? "max-h-[1000px] opacity-100 pt-4"
                         : "max-h-0 opacity-0 pt-0 pointer-events-none"
                     }`}
      >
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          <Link
            href="/marketplace"
            className={`text-gray-300 hover:text-white transition-colors w-full text-center ${
              isActive("/marketplace") ? "text-purple-500" : ""
            }`}
          >
            Marketplace
          </Link>
          <Link
            href="/faq"
            className={`text-gray-300 hover:text-white transition-colors w-full text-center ${
              isActive("/faq") ? "text-purple-500" : ""
            }`}
          >
            FAQ
          </Link>
        </nav>
        <div className="mt-4 w-full">
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}

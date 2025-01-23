import React from "react";
import { Link } from "react-router-dom";
import { Timer } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Navbar() {
  const { isConnected } = useAccount();
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Timer className="h-8 w-8 text-purple-600" />
            <span className="font-bold text-xl">JIT Liquidity</span>
          </Link>
          {isConnected ? (
            <>
              <ConnectButton />
              <Link
                to="/app"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Launch App
              </Link>
            </>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </nav>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import Background from "../components/Background";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <>
      <Background />
      <div className="min-h-screen relative">
        {/* Hero Section */}
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Cross-Chain Liquidity,{" "}
                <span className="text-purple-600">Just in Time</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Access instant cross-chain liquidity powered by Analog-GMP
                technology. Bridge assets seamlessly across multiple blockchains
                with maximum efficiency.
              </p>
              <div className="flex gap-4 justify-center">
                {isConnected ? (
                  <>
                    <Link
                      to="/app"
                      className="inline-flex items-center bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Launch App
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/faucet"
                      className="inline-flex items-center bg-white text-purple-600 border border-purple-200 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      Get Test Tokens
                    </Link>
                  </>
                ) : (
                  <ConnectButton />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Zap className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Instant Liquidity
                </h3>
                <p className="text-gray-600">
                  Access liquidity across multiple chains instantly without
                  waiting for confirmations.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Shield className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Transfers</h3>
                <p className="text-gray-600">
                  Powered by Analog-GMP for secure and reliable cross-chain
                  communication.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Globe className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Multi-Chain Support
                </h3>
                <p className="text-gray-600">
                  Support for major blockchain networks with seamless
                  integration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 transform hover:-translate-y-1 transition-transform">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  $1B+
                </div>
                <div className="text-gray-600 font-medium">Total Liquidity</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 transform hover:-translate-y-1 transition-transform">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  10+
                </div>
                <div className="text-gray-600 font-medium">
                  Supported Chains
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 transform hover:-translate-y-1 transition-transform">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  100K+
                </div>
                <div className="text-gray-600 font-medium">Transactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

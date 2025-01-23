import React, { useState } from "react";
import { Droplets, Check, Loader2 } from "lucide-react";
import { tokens } from "../data/tokens";

export default function Faucet() {
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimed, setClaimed] = useState<Set<string>>(new Set());

  const handleClaim = async (symbol: string) => {
    setClaiming(symbol);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setClaiming(null);
    setClaimed((prev) => new Set([...prev, symbol]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pt-24 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Droplets className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold">Testnet Faucet</h1>
          </div>

          <p className="text-gray-600 mb-8">
            Get test tokens to experiment with our Just-in-Time Liquidity
            platform. These tokens mirror their mainnet counterparts but have no
            real value.
          </p>

          <div className="grid gap-4">
            {tokens.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <img src={token.logo} alt={token.name} className="w-8 h-8" />
                  <div>
                    <h3 className="font-medium">{token.symbol}</h3>
                    <p className="text-sm text-gray-500">{token.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleClaim(token.symbol)}
                  disabled={
                    claiming === token.symbol || claimed.has(token.symbol)
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    claimed.has(token.symbol)
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {claiming === token.symbol ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : claimed.has(token.symbol) ? (
                    <span className="flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      Claimed
                    </span>
                  ) : (
                    "Claim"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> The faucet has a cooldown period of 24 hours
            per wallet address. Please use these tokens responsibly.
          </p>
        </div>
      </div>
    </div>
  );
}

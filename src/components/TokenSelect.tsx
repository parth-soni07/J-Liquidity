import React , { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Token } from "../data/tokens";

interface TokenSelectProps {
  value: string;
  onChange: (value: string) => void;
  tokens: Token[];
}

export default function TokenSelect({
  value,
  onChange,
  tokens,
}: TokenSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedToken = tokens.find((t) => t.symbol === value);

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3 hover:border-purple-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedToken ? (
          <div className="flex items-center">
            <img
              src={selectedToken.logo}
              alt={selectedToken.symbol}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span>{selectedToken.symbol}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select Token</span>
        )}
        <ChevronDown className="h-5 w-5 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1">
            {tokens.map((token) => (
              <button
                key={token.symbol}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center"
                onClick={() => {
                  onChange(token.symbol);
                  setIsOpen(false);
                }}
              >
                <img
                  src={token.logo}
                  alt={token.symbol}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <div>
                  <div>{token.symbol}</div>
                  <div className="text-sm text-gray-500">{token.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

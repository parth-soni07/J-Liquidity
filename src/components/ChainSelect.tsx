import React, { useState } from "react";
import { Link2 } from "lucide-react";
import type { Chain } from "../data/chains";

interface ChainSelectProps {
  value: string;
  onChange: (value: string) => void;
  chains: Chain[];
}

export default function ChainSelect({
  value,
  onChange,
  chains,
}: ChainSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedChain = chains.find((c) => c.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3 hover:border-purple-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedChain ? (
          <div className="flex items-center">
            <img
              src={selectedChain.icon}
              alt={selectedChain.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span>{selectedChain.name}</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <Link2 className="w-6 h-6 mr-2" />
            <span>Select Chain</span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1">
            {chains.map((chain) => (
              <button
                key={chain.id}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center"
                onClick={() => {
                  onChange(chain.id);
                  setIsOpen(false);
                }}
              >
                <img
                  src={chain.icon}
                  alt={chain.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span>{chain.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

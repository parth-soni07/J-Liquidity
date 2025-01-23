import React from "react";
import { Info } from "lucide-react";

export default function InfoBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-100 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <Info className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
        <p className="text-sm text-gray-700">
          You're currently on testnet. The tokens here mirror their mainnet
          counterparts but have no real value. Visit our{" "}
          <a
            href="/faucet"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            faucet page
          </a>{" "}
          to claim test tokens for experimenting with the platform.
        </p>
      </div>
    </div>
  );
}

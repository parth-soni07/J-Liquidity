import React, { useState } from "react";
import TokenSelect from "../components/TokenSelect";
import ChainSelect from "../components/ChainSelect";
import TransactionHistory from "../components/TransactionHistory";
import { tokens } from "../data/tokens";
import { chains } from "../data/chains";
import { useTransactionHistory } from "../hooks/useTransactionHistory";

import { ethers } from "ethers";
import { abi } from "../abi/CrossChainJustInLiquidity.json";

export default function App() {
  const [selectedToken, setSelectedToken] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const { transactions, addTransaction } = useTransactionHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToken || !selectedChain || !recipientAddress || !amount)
      return;

    addTransaction({
      token: selectedToken,
      chain: selectedChain,
      recipient: recipientAddress,
      amount,
    });

    // Reset form
    setSelectedToken("");
    setSelectedChain("");
    setRecipientAddress("");
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pt-24 px-4 pb-12">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Get Just-in-Time Liquidity
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Network
              </label>
              <ChainSelect
                value={selectedChain}
                onChange={setSelectedChain}
                chains={chains}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Token
              </label>
              <TokenSelect
                value={selectedToken}
                onChange={setSelectedToken}
                tokens={tokens}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="any"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {selectedToken && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {selectedToken}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination Network
              </label>
              <ChainSelect
                value={selectedChain}
                onChange={setSelectedChain}
                chains={chains}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={
                !selectedToken || !selectedChain || !recipientAddress || !amount
              }
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Liquidity
            </button>
          </form>
        </div>

        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
}

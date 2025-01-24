import React, { useState } from "react";
import TokenSelect from "../components/TokenSelect";
import ChainSelect from "../components/ChainSelect";
import TransactionHistory from "../components/TransactionHistory";
import { tokens } from "../data/tokens";
import { chains } from "../data/chains";
import { useTransactionHistory } from "../hooks/useTransactionHistory";

import { ethers, parseEther } from "ethers";
import { abi } from "../abi/CrossChainJustInLiquidity.json";

// Map chain IDs to contract address keys
const contractAddresses = {
  sepolia: import.meta.env.VITE_CONTRACT_ADDRESS_SEPOLIA,
  otherNetwork: import.meta.env.VITE_CONTRACT_ADDRESS_OTHER,
};

type NetworkType = keyof typeof contractAddresses;

// Map chain names to NetworkType
const networkMapping: Record<string, NetworkType> = {
  "Ethereum Sepolia": "sepolia",
  "Arbitrum Sepolia": "otherNetwork",
};

export async function getContractInstance(network: NetworkType) {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      contractAddresses[network],
      abi,
      signer
    );
    return contract;
  }
  throw new Error("Ethereum provider not found");
}

export default function App() {
  const [selectedToken, setSelectedToken] = useState("");
  const [sourceChain, setSourceChain] = useState<number | null>(null);
  const [destinationChain, setDestinationChain] = useState<number | null>(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const { transactions, addTransaction } = useTransactionHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedToken ||
      !sourceChain ||
      !destinationChain ||
      !recipientAddress ||
      !amount
    )
      return;

    try {
      // Find the selected chain
      const selectedSourceChainName = chains.find(
        (chain) => chain.id === sourceChain
      )?.name;
      if (!selectedSourceChainName) {
        throw new Error("Invalid chain selected.");
      }
      const selectedDestinationChainName = chains.find(
        (chain) => chain.id === destinationChain
      )?.name;
      if (!selectedDestinationChainName) {
        throw new Error("Invalid chain selected.");
      }

      // Map the chain name to the contract address key
      const networkKey = networkMapping[selectedSourceChainName];
      if (!networkKey) {
        throw new Error("Unsupported network selected.");
      }

      // Get the contract instance
      const contract = await getContractInstance(networkKey);

      if (!contract) {
        alert("Failed to load contract instance");
        return;
      }

      // Prepare values for the contract function
      const sourceNetwork = chains.find(
        (chain) => chain.name === "Ethereum Sepolia"
      )?.id;
      const destinationNetwork = chains.find(
        (chain) => chain.id === destinationChain
      )?.id;
      if (sourceNetwork === undefined || destinationNetwork === undefined) {
        throw new Error("Source or destination network not found.");
      }

      // Encode additional parameters (empty for now)
      const params = "0x";

      // Call the contract function
      const tx = await contract.requestCrossChainLiquidity(
        sourceNetwork,
        destinationNetwork,
        selectedToken,
        parseEther(amount),
        recipientAddress,
        contractAddresses[networkKey], // Destination contract
        params,
        { value: parseEther("0.01") } // Assume this is the required fee
      );

      await tx.wait();

      // Add to transaction history
      addTransaction({
        token: selectedToken,
        chain: selectedSourceChainName,
        recipient: recipientAddress,
        amount,
      });

      alert("Liquidity request submitted successfully!");

      // Reset form
      setSelectedToken("");
      setSourceChain(null);
      setDestinationChain(null);
      setRecipientAddress("");
      setAmount("");
    } catch (error) {
      console.error("Error submitting liquidity request:", error);
      alert("Failed to submit liquidity request. See console for details.");
    }
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
                value={sourceChain?.toString() || ""}
                onChange={(value) => setSourceChain(Number(value))}
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
                value={destinationChain?.toString() || ""}
                onChange={(value) => setDestinationChain(Number(value))}
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
                !selectedToken || !sourceChain || !destinationChain || !recipientAddress || !amount
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

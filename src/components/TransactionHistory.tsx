import React from "react";
import { Clock } from "lucide-react";
import { Transaction } from "../types/transaction";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        Transaction History
      </h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {tx.amount} {tx.token} on {tx.chain}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  To: {tx.recipient}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(tx.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

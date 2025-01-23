import { useState, useEffect } from "react";
import { Transaction } from "../types/transaction";

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  const addTransaction = (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  return { transactions, addTransaction };
}

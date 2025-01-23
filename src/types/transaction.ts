export interface Transaction {
  id: string;
  timestamp: number;
  token: string;
  chain: string;
  recipient: string;
  amount: string;
}

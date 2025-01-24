export interface Chain {
  id: number;
  name: string;
  icon: string;
  rpcUrl: string;
}

export const chains: Chain[] = [
  {
    id: 5,
    name: "Ethereum Sepolia",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    rpcUrl: "https://sepolia.infura.io/v3/",
  },
  {
    id: 7,
    name: "Arbitrum Sepolia",
    icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg",
    rpcUrl: "https://arbitrum-mainnet.infura.io/v3/",
  },
];

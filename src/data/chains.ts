export interface Chain {
  id: string;
  name: string;
  icon: string;
  rpcUrl: string;
}

export const chains: Chain[] = [
  {
    id: "sepolia",
    name: "Sepolia Testnet",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    rpcUrl: "https://sepolia.infura.io/v3/",
  },
  {
    id: "arbitrum",
    name: "Arbitrum One",
    icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg",
    rpcUrl: "https://arbitrum-mainnet.infura.io/v3/",
  },
];

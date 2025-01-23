export interface Token {
  symbol: string;
  name: string;
  logo: string;
  address: string;
}

export const tokens: Token[] = [
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
];

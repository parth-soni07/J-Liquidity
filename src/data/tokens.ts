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
    address: "0x6E084360Fb7F30ae1211EE9Ac6A48aafE3a1Dea7",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
    address: "0xd9b58c17583e6AD1De76eb6e05119D6C5D6435a4",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    address: "0xf9bD4d267a87cC9729EBAc3A37FF9601D0Fc93a5",
  },
];

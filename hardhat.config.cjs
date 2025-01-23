require("@nomicfoundation/hardhat-toolbox");
const { holesky, sepolia } = require("viem/chains");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const HOLESKY_RPC = process.env.HOLESKY_RPC_URL;
const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.28",
  networks: {
    holesky: {
      url: HOLESKY_RPC,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 17000,
    },
    sepolia: {
      url: SEPOLIA_RPC,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
};

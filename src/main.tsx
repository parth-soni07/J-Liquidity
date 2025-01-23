import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia, hardhat, holesky } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Navbar from "./components/Nabar";

//INTERNAL IMPORTS
import Home from "./pages/Home";
import App from "./pages/App";
import Faucet from "./pages/Faucet";
import "./index.css";

const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: import.meta.env.VITE_PROJECT_NAME,
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [mainnet, sepolia, hardhat, holesky],
  ssr: true, // If your dApp uses server side rendering (SSR)
});


createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/app" element={<App />} />
            <Route path="/faucet" element={<Faucet />} />
          </Routes>
        </Router>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

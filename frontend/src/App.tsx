import { useTheme } from "./store/Theme";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import FuturisticLoader from "./components/Loader";
import LandingPage from "./pages";
import Dashboard from "./pages/Dashboard";
import ClaimPage from "./pages/ClaimPage";

import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import { baseSepolia } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://dashboard.reown.com
const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

// 2. Create a metadata object - optional
const metadata = {
	name: "AppKit",
	description: "AppKit Example",
	url: "https://localhost:4006/dashboard", // origin must match your domain & subdomain
	icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Set the networks

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
	networks: [baseSepolia],
	projectId,
	// ssr: true,
});

// 5. Create modal
createAppKit({
	adapters: [wagmiAdapter],
	networks: [baseSepolia],
	projectId,
	metadata,
	features: {
		analytics: true,
	},
});

const App = () => {
	const { theme } = useTheme();
	useEffect(() => {
		document.body.className = theme;
	}, [theme]);

	return (
		<WagmiProvider config={wagmiAdapter.wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<AnimatePresence mode="wait">
					(
					<Router key="router">
						<Routes>
							<Route path="/" element={<LandingPage />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/claim/:transactionId" element={<ClaimPage />} />
						</Routes>
					</Router>
					)
				</AnimatePresence>
			</QueryClientProvider>
		</WagmiProvider>
	);
};
export default App;

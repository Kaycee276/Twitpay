"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FuturisticLoaderProps {
	onLoadingComplete: () => void;
}

const FuturisticLoader = ({ onLoadingComplete }: FuturisticLoaderProps) => {
	const [progress, setProgress] = useState(0);
	const [loadingText, setLoadingText] = useState("INITIALIZING");

	useEffect(() => {
		const loadingSteps = [
			{ progress: 20, text: "INITIALIZING", duration: 800 },
			{ progress: 40, text: "CONNECTING", duration: 600 },
			{ progress: 60, text: "SYNCING DATA", duration: 700 },
			{ progress: 80, text: "OPTIMIZING", duration: 500 },
			{ progress: 100, text: "READY", duration: 400 },
		];

		let currentStep = 0;
		const interval = setInterval(() => {
			if (currentStep < loadingSteps.length) {
				const step = loadingSteps[currentStep];
				setProgress(step.progress);
				setLoadingText(step.text);
				currentStep++;
			} else {
				clearInterval(interval);
				setTimeout(() => {
					onLoadingComplete();
				}, 500);
			}
		}, 600);

		return () => clearInterval(interval);
	}, [onLoadingComplete]);

	return (
		<motion.div
			initial={{ opacity: 1 }}
			exit={{ opacity: 0, scale: 1.1 }}
			transition={{ duration: 0.8, ease: "easeInOut" }}
			className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden"
		>
			{/* Animated Background */}
			<div className="absolute inset-0">
				{/* Rotating Rings */}
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-500/20 rounded-full"
				/>
				<motion.div
					animate={{ rotate: -360 }}
					transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-purple-500/20 rounded-full"
				/>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-pink-500/20 rounded-full"
				/>

				{/* Floating Particles */}
				{[...Array(30)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 bg-cyan-400 rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							y: [0, -50, 0],
							opacity: [0, 1, 0],
							scale: [0, 1, 0],
						}}
						transition={{
							duration: 2 + Math.random() * 2,
							repeat: Infinity,
							delay: Math.random() * 2,
						}}
					/>
				))}

				{/* Grid Pattern */}
				<div className="absolute inset-0 opacity-5">
					<svg width="100%" height="100%">
						<defs>
							<pattern
								id="loaderGrid"
								width="40"
								height="40"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 40 0 L 0 0 0 40"
									fill="none"
									stroke="currentColor"
									strokeWidth="1"
								/>
							</pattern>
						</defs>
						<rect
							width="100%"
							height="100%"
							fill="url(#loaderGrid)"
							className="text-white"
						/>
					</svg>
				</div>
			</div>

			{/* Main Loader Content */}
			<div className="relative z-10 flex flex-col items-center">
				{/* Central Logo/Spinner */}
				<div className="relative mb-12">
					{/* Outer Ring */}
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
						className="w-32 h-32 border-2 border-transparent border-t-cyan-400 border-r-purple-400 rounded-full"
					/>

					{/* Middle Ring */}
					<motion.div
						animate={{ rotate: -360 }}
						transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
						className="absolute inset-2 w-28 h-28 border-2 border-transparent border-t-purple-400 border-l-pink-400 rounded-full"
					/>

					{/* Inner Ring */}
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
						className="absolute inset-4 w-24 h-24 border-2 border-transparent border-t-pink-400 border-b-cyan-400 rounded-full"
					/>

					{/* Center Core */}
					<motion.div
						animate={{
							scale: [1, 1.2, 1],
							boxShadow: [
								"0 0 20px rgba(6, 182, 212, 0.5)",
								"0 0 40px rgba(139, 92, 246, 0.8)",
								"0 0 20px rgba(6, 182, 212, 0.5)",
							],
						}}
						transition={{ duration: 2, repeat: Infinity }}
						className="absolute inset-8 w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center"
					>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
							className="text-white font-bold text-xl"
						>
							T
						</motion.div>
					</motion.div>

					{/* Orbiting Dots */}
					{[0, 120, 240].map((angle, i) => (
						<motion.div
							key={i}
							className="absolute w-3 h-3 bg-cyan-400 rounded-full"
							style={{
								top: "50%",
								left: "50%",
								transformOrigin: "0 0",
							}}
							animate={{
								rotate: 360,
								x: Math.cos((angle * Math.PI) / 180) * 70,
								y: Math.sin((angle * Math.PI) / 180) * 70,
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: "linear",
								delay: i * 0.5,
							}}
						/>
					))}
				</div>

				{/* Loading Text */}
				<motion.div
					key={loadingText}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className="mb-8"
				>
					<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider">
						{loadingText}
					</h2>
				</motion.div>

				{/* Progress Bar */}
				<div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
					<motion.div
						className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full"
						initial={{ width: 0 }}
						animate={{ width: `${progress}%` }}
						transition={{ duration: 0.5, ease: "easeOut" }}
					/>
				</div>

				{/* Progress Percentage */}
				<motion.div
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 1.5, repeat: Infinity }}
					className="text-gray-400 font-mono text-sm"
				>
					{progress}%
				</motion.div>

				{/* Status Indicators */}
				<div className="flex gap-2 mt-8">
					{[...Array(4)].map((_, i) => (
						<motion.div
							key={i}
							className="w-2 h-2 rounded-full bg-gray-600"
							animate={{
								backgroundColor:
									progress > (i + 1) * 25 ? "#06b6d4" : "#4b5563",
								scale: progress > (i + 1) * 25 ? [1, 1.5, 1] : 1,
							}}
							transition={{
								duration: 0.3,
								repeat: progress > (i + 1) * 25 ? Infinity : 0,
							}}
						/>
					))}
				</div>

				{/* Scanning Lines Effect */}
				<motion.div
					className="absolute inset-0 pointer-events-none"
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, 0.3, 0] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					<motion.div
						className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
						animate={{ y: [0, window.innerHeight] }}
						transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
					/>
				</motion.div>
			</div>

			{/* Corner Decorations */}
			<div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50" />
			<div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-purple-400/50" />
			<div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-purple-400/50" />
			<div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50" />
		</motion.div>
	);
};

export default FuturisticLoader;

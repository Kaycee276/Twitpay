import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import React from "react";
import TwitterSignInModal from "../components/TwitterSignInModal";

const LandingPage = () => {
	// Animation variants for orchestrated entrance
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.2,
			},
		},
	};

	const mainContentVariants = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				delay: 1.2,
				type: "spring" as const,
				damping: 12,
				stiffness: 100,
			},
		},
	};

	const orbVariants = {
		hidden: { scale: 0, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				type: "spring",
				damping: 8,
				stiffness: 100,
				delay: 0.5,
			},
		},
	} as const;

	const particleVariants = {
		hidden: { scale: 0, opacity: 0 },
		visible: (i: number) => ({
			scale: 1,
			opacity: 1,
			transition: {
				delay: 1 + i * 0.1,
				duration: 0.5,
			},
		}),
	};

	// Modal state
	const [modalOpen, setModalOpen] = React.useState(false);

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
		>
			{/* Animated Background Elements */}
			<div className="absolute inset-0">
				{/* Floating Orbs with dramatic entrance */}
				<motion.div
					variants={orbVariants}
					className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-xl"
					animate={{
						x: [0, 100, 0],
						y: [0, -50, 0],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					variants={orbVariants}
					className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-xl"
					animate={{
						x: [0, -80, 0],
						y: [0, 60, 0],
						scale: [1, 0.8, 1],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					variants={orbVariants}
					className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-xl"
					animate={{
						x: [0, 60, 0],
						y: [0, -40, 0],
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				{/* Grid Pattern with fade-in */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.1 }}
					transition={{ delay: 0.8, duration: 1 }}
					className="absolute inset-0"
				>
					<svg width="100%" height="100%" className="absolute inset-0">
						<defs>
							<pattern
								id="grid"
								width="50"
								height="50"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 50 0 L 0 0 0 50"
									fill="none"
									stroke="currentColor"
									strokeWidth="1"
								/>
							</pattern>
						</defs>
						<rect
							width="100%"
							height="100%"
							fill="url(#grid)"
							className="text-white"
						/>
					</svg>
				</motion.div>

				{/* Floating Particles with staggered entrance */}
				{[...Array(20)].map((_, i) => (
					<motion.div
						key={i}
						custom={i}
						variants={particleVariants}
						className="absolute w-1 h-1 bg-white rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							y: [0, -100, 0],
							opacity: [0, 1, 0],
						}}
						transition={{
							duration: 3 + Math.random() * 2,
							repeat: Infinity,
							delay: Math.random() * 2 + 2, // Start after initial animation
						}}
					/>
				))}
			</div>

			{/* Main Content */}
			<motion.div
				variants={mainContentVariants}
				initial="hidden"
				animate="visible"
				className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
			>
				{/* Logo/Icon with dramatic spin entrance */}
				<motion.div
					initial={{ scale: 0, rotate: -720, opacity: 0 }}
					animate={{ scale: 1, rotate: 0, opacity: 1 }}
					transition={{
						type: "spring",
						damping: 10,
						stiffness: 100,
						duration: 1.5,
					}}
					className="mb-8"
				>
					<div className="relative">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
							className="w-24 h-24 border-2 border-cyan-400/50 rounded-full flex items-center justify-center"
						>
							<motion.div
								animate={{ rotate: -360 }}
								transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
								className="w-16 h-16 border border-purple-400/50 rounded-full flex items-center justify-center"
							>
								<Zap className="w-8 h-8 text-cyan-400" />
							</motion.div>
						</motion.div>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 1, type: "spring", stiffness: 200 }}
							className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full"
						/>
					</div>
				</motion.div>

				{/* Title with typewriter effect */}
				<motion.h1
					initial={{ opacity: 0, y: 100, scale: 0.5 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{
						type: "spring",
						damping: 12,
						stiffness: 100,
						delay: 0.5,
					}}
					className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6 text-center"
				>
					<motion.span
						initial={{ backgroundPosition: "0%" }}
						animate={{ backgroundPosition: ["0%", "100%"] }}
						transition={{
							duration: 3,
							repeat: Infinity,
							ease: "linear",
							delay: 1,
						}}
						className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-[length:200%_100%] bg-clip-text text-transparent"
					>
						TwitPay
					</motion.span>
				</motion.h1>

				{/* Subtitle with slide-up animation */}
				<motion.p
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						type: "spring",
						damping: 12,
						stiffness: 100,
						delay: 0.8,
					}}
					className="text-xl md:text-2xl text-gray-300 mb-12 text-center max-w-2xl leading-relaxed"
				>
					Your{" "}
					<motion.span
						initial={{ color: "#06b6d4" }}
						animate={{ color: ["#06b6d4", "#8b5cf6", "#ec4899", "#06b6d4"] }}
						transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
						className="font-semibold"
					>
						one-stop solution
					</motion.span>{" "}
					for Twitter payments in the future.
				</motion.p>

				{/* Feature Icons with staggered bounce entrance */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2 }}
					className="flex gap-8 mb-12"
				>
					{[
						{ icon: Zap, color: "text-yellow-400", label: "Fast" },
						{ icon: Shield, color: "text-green-400", label: "Secure" },
						{ icon: Sparkles, color: "text-purple-400", label: "Smart" },
					].map((item, index) => (
						<motion.div
							key={index}
							initial={{ scale: 0, y: 100, rotate: -180 }}
							animate={{ scale: 1, y: 0, rotate: 0 }}
							transition={{
								type: "spring",
								damping: 8,
								stiffness: 100,
								delay: 1.4 + index * 0.2,
							}}
							whileHover={{ scale: 1.2, rotate: 5 }}
							className="flex flex-col items-center gap-2"
						>
							<motion.div
								whileHover={{ boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)" }}
								className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
							>
								<item.icon className={`w-8 h-8 ${item.color}`} />
							</motion.div>
							<span className="text-sm text-gray-400 font-medium">
								{item.label}
							</span>
						</motion.div>
					))}
				</motion.div>

				{/* CTA Button with dramatic entrance */}
				<motion.button
					initial={{ opacity: 0, y: 100, scale: 0.5 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{
						type: "spring",
						damping: 8,
						stiffness: 100,
						delay: 2,
					}}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="group relative  bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 font-semibold text-lg flex items-center gap-3 overflow-hidden"
					onClick={() => setModalOpen(true)}
				>
					<motion.div
						className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
						initial={false}
					/>
					<span className="relative z-10">Get Started</span>
					<motion.div
						animate={{ x: [0, 5, 0] }}
						transition={{ duration: 1.5, repeat: Infinity, delay: 2.5 }}
						className="relative z-10"
					>
						<ArrowRight className="w-5 h-5" />
					</motion.div>

					{/* Button Glow Effect */}
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 0.2 }}
						transition={{ delay: 2.2, duration: 0.5 }}
						className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 blur-xl"
					/>
				</motion.button>

				{/* Floating Elements with delayed entrance */}
				<motion.div
					initial={{ opacity: 0, scale: 0, rotate: -180 }}
					animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
					transition={{ delay: 2.5, duration: 1 }}
					className="absolute top-1/4 left-10 text-cyan-400/30"
				>
					<motion.svg
						animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
						transition={{ duration: 4, repeat: Infinity, delay: 3 }}
						width="60"
						height="60"
						viewBox="0 0 60 60"
						fill="currentColor"
					>
						<polygon points="30,5 35,20 50,20 38,30 42,45 30,37 18,45 22,30 10,20 25,20" />
					</motion.svg>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0, rotate: 180 }}
					animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
					transition={{ delay: 2.7, duration: 1 }}
					className="absolute top-1/3 right-10 text-purple-400/30"
				>
					<motion.svg
						animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
						transition={{ duration: 3, repeat: Infinity, delay: 3.5 }}
						width="40"
						height="40"
						viewBox="0 0 40 40"
						fill="currentColor"
					>
						<circle cx="20" cy="20" r="3" />
						<circle cx="20" cy="8" r="2" />
						<circle cx="20" cy="32" r="2" />
						<circle cx="8" cy="20" r="2" />
						<circle cx="32" cy="20" r="2" />
						<circle cx="12" cy="12" r="1.5" />
						<circle cx="28" cy="28" r="1.5" />
						<circle cx="28" cy="12" r="1.5" />
						<circle cx="12" cy="28" r="1.5" />
					</motion.svg>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0, x: -100 }}
					animate={{ opacity: 0.3, scale: 1, x: 0 }}
					transition={{ delay: 2.9, duration: 1 }}
					className="absolute bottom-1/4 left-1/4 text-pink-400/30"
				>
					<motion.svg
						animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
						transition={{ duration: 5, repeat: Infinity, delay: 4 }}
						width="50"
						height="50"
						viewBox="0 0 50 50"
						fill="currentColor"
					>
						<path d="M25 5 L30 20 L45 20 L33 30 L38 45 L25 37 L12 45 L17 30 L5 20 L20 20 Z" />
					</motion.svg>
				</motion.div>
			</motion.div>

			{/* Twitter Sign-In Modal */}
			<TwitterSignInModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
			/>

			{/* Burst effect on initial load */}
			<motion.div
				initial={{ scale: 0, opacity: 1 }}
				animate={{ scale: 4, opacity: 0 }}
				transition={{ duration: 1.5, ease: "easeOut" }}
				className="absolute inset-0 bg-gradient-radial from-cyan-400/20 via-purple-400/10 to-transparent pointer-events-none"
			/>
		</motion.div>
	);
};

export default LandingPage;

"use client";

import { Zap, LogOut, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/auth";

const Header = () => {
	const logout = useAuthStore((state) => state.logout);
	const user = useAuthStore((state) => state.user);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const dropdownVariants = {
		hidden: {
			opacity: 0,
			scale: 0.95,
			y: -10,
		},
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				type: "spring" as const,
				stiffness: 400,
				damping: 25,
				duration: 0.2,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			y: -10,
			transition: {
				duration: 0.15,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: 20 },
		visible: (i: number) => ({
			opacity: 1,
			x: 0,
			transition: {
				delay: i * 0.1,
				duration: 0.3,
			},
		}),
	};

	return (
		<header className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-3">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{
								duration: 8,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						>
							<Zap className="w-8 h-8 text-cyan-400" />
						</motion.div>
						<h1 className="text-base md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
							TwitPay Dashboard
						</h1>
					</div>

					{/* Desktop actions */}
					<div className="hidden md:flex items-center space-x-2 md:space-x-4">
						<motion.img
							src={user?.profileImageUrl}
							alt={user?.displayName}
							className="md:w-12 w-10 h-auto rounded-full"
							whileHover={{ scale: 1.1, borderColor: "rgba(6, 182, 212, 0.8)" }}
							transition={{ type: "spring", stiffness: 300, damping: 25 }}
						/>
						<motion.button
							onClick={logout}
							className="text-white hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/10"
							title="Logout"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							<LogOut className="w-6 h-6" />
						</motion.button>
						<appkit-button />
					</div>

					{/* Mobile dropdown */}
					<div className="md:hidden relative" ref={dropdownRef}>
						<motion.button
							onClick={() => setDropdownOpen((open) => !open)}
							className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
							aria-label="Open menu"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							<motion.div
								animate={{ rotate: dropdownOpen ? 90 : 0 }}
								transition={{ duration: 0.2 }}
							>
								<Menu className="w-7 h-7" />
							</motion.div>
						</motion.button>

						<AnimatePresence>
							{dropdownOpen && (
								<motion.div
									className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
									variants={dropdownVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
								>
									{/* Glow effect */}
									<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl" />

									{/* Floating particles */}
									{[...Array(5)].map((_, i) => (
										<motion.div
											key={i}
											className="absolute w-1 h-1 bg-cyan-400/50 rounded-full pointer-events-none"
											style={{
												left: `${20 + Math.random() * 60}%`,
												top: `${20 + Math.random() * 60}%`,
											}}
											animate={{
												y: [0, -10, 0],
												opacity: [0.3, 0.8, 0.3],
											}}
											transition={{
												duration: 2 + Math.random(),
												repeat: Number.POSITIVE_INFINITY,
												delay: Math.random() * 2,
											}}
										/>
									))}

									<div className="relative z-10 p-6">
										{/* User Profile Section */}
										<motion.div
											className="flex flex-col items-center space-y-4 mb-6"
											custom={0}
											variants={itemVariants}
											initial="hidden"
											animate="visible"
										>
											<div className="relative">
												<motion.img
													src={user?.profileImageUrl}
													alt={user?.displayName}
													className="w-16 h-16 rounded-full"
													whileHover={{ scale: 1.1 }}
													transition={{
														type: "spring",
														stiffness: 300,
														damping: 25,
													}}
												/>
												{/* Profile glow */}
												<div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg" />
											</div>

											<div className="text-center">
												<h3 className="text-white font-semibold text-lg">
													{user?.displayName}
												</h3>
												<p className="text-gray-400 text-sm">
													@{user?.username}
												</p>
											</div>
										</motion.div>

										{/* Divider */}
										<motion.div
											className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-6"
											custom={1}
											variants={itemVariants}
											initial="hidden"
											animate="visible"
										/>

										{/* Actions */}
										<div className="space-y-4">
											<motion.button
												onClick={logout}
												className="w-full text-gray-300 hover:text-red-400 transition-all flex items-center justify-center space-x-3 p-3 rounded-lg hover:bg-white/10 group relative"
												title="Logout"
												custom={2}
												variants={itemVariants}
												initial="hidden"
												animate="visible"
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
											>
												<LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
												<span className="font-medium">Logout</span>

												{/* Hover glow effect */}
												<motion.div
													className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"
													initial={false}
												/>
											</motion.button>

											<motion.div
												className="flex justify-center"
												custom={3}
												variants={itemVariants}
												initial="hidden"
												animate="visible"
											>
												<div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2">
													<appkit-button />
												</div>
											</motion.div>
										</div>
									</div>

									{/* Bottom gradient border */}
									<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50" />
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;

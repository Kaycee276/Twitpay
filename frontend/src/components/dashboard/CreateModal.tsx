import { useCreateModal } from "../../store/createModal";
import { motion, AnimatePresence } from "framer-motion";
import {
	Zap,
	Sparkles,
	ArrowRight,
	Coins,
	Clock,
	MessageCircle,
} from "lucide-react";
import TokenSelector from "../../common/TokenSelector";
import AmountInput from "../../common/AmountInput";
import ExpirationSelector from "../../common/ExpirationSelector";
import { useState } from "react";
import { useAuthStore } from "../../store/auth";

const tokenOptions = [
	{ label: "ETH (Base)", value: "eth" },
	{ label: "USDC (Base)", value: "usdc" },
];

const expirationOptions = [
	{ label: "24 hours", value: 24 },
	{ label: "48 hours", value: 48 },
	{ label: "7 days", value: 168 },
];

type CreateModalProps = {
	setOpenModal: (value: null) => void;
	isOpen: boolean;
};

const CreateModal = ({ setOpenModal, isOpen }: CreateModalProps) => {
	const {
		token,
		amountPerUser,
		keywords,
		// canStopEarly,
		expiration,
		receiver,
		loading,
		maxRecipients,
		setToken,
		setAmountPerUser,
		setKeywords,
		// setCanStopEarly,
		setExpiration,
		setReceiver,
		setMaxRecipients,
		setLoading,
		resetForm,
	} = useCreateModal();

	const { addTransaction, fetchActivity, fetchStats } = useAuthStore();

	const [transactionCreated, setTransactionCreated] = useState(false);
	const [transactionData, setTransactionData] = useState<{
		claimLink: string;
		transactionId: string;
	} | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Validate inputs
			if (!token || !amountPerUser || Number.parseFloat(amountPerUser) <= 0) {
				throw new Error("Please enter a valid amount greater than 0");
			}
			if (!keywords.trim()) {
				throw new Error("Please enter at least one keyword for verification");
			}

			// Calculate total amount
			const amount = Number.parseFloat(amountPerUser);
			const totalAmount = maxRecipients ? amount * maxRecipients : amount;

			const response = await fetch("http://localhost:4000/api/transactions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					token,
					amountPerUser: amount,
					keywords: keywords.trim(),
					expiration,
					receiver: receiver.trim() || null,
					totalAmount,
					maxRecipients: maxRecipients || null,
				}),
			});

			if (!response.ok) {
				const contentType = response.headers.get("content-type");
				let errorMessage = "Failed to create transaction";

				if (contentType && contentType.includes("application/json")) {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} else {
					const text = await response.text();
					console.error("Server returned HTML:", text);
					errorMessage =
						"Server error - please check if the backend is running on port 4000";
				}

				throw new Error(errorMessage);
			}

			const data = await response.json();

			// Add to recent activity
			addTransaction({
				type: `Created ${data.transaction.token} giveaway`,
				date: new Date().toISOString(),
				status: "Created",
			});

			// Refresh activity data from server
			await fetchActivity();
			await fetchStats();

			setTransactionData({
				claimLink: data.claimLink,
				transactionId: data.transaction.id,
			});
			setTransactionCreated(true);

			// Copy to clipboard
			navigator.clipboard.writeText(data.claimLink).catch(() => {
				console.log("Could not copy to clipboard");
			});

			setLoading(false);
		} catch (error) {
			console.error("Error creating transaction:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create transaction";
			alert(`❌ Error: ${errorMessage}`);
			setLoading(false);
		}
	};

	const handleClose = () => {
		setOpenModal(null);
		setTransactionCreated(false);
		setTransactionData(null);
		resetForm();
	};

	// Animation variants
	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	const modalVariants = {
		hidden: {
			scale: 0.3,
			opacity: 0,
			y: 100,
			rotateX: -15,
		},
		visible: {
			scale: 1,
			opacity: 1,
			y: 0,
			rotateX: 0,
			transition: {
				type: "spring" as const,
				stiffness: 300,
				damping: 25,
				duration: 0.6,
			},
		},
		exit: {
			scale: 0.3,
			opacity: 0,
			y: 100,
			rotateX: 15,
			transition: {
				duration: 0.3,
			},
		},
	};

	const formItemVariants = {
		hidden: { opacity: 0, x: -50, scale: 0.8 },
		visible: (i: number) => ({
			opacity: 1,
			x: 0,
			scale: 1,
			transition: {
				delay: 0.3 + i * 0.1,
				type: "spring" as const,
				stiffness: 300,
				damping: 25,
			},
		}),
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4"
					variants={backdropVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					onClick={handleClose}
				>
					<div className="absolute inset-0 backdrop-blur-sm bg-black/50" />

					<motion.div
						className="relative bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-3 sm:p-5 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto shadow-2xl overflow-y-auto max-h-[96vh] text-xs sm:text-sm"
						variants={modalVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />

						<div className="relative z-10 flex items-center gap-3 mb-4">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{
									duration: 8,
									repeat: Number.POSITIVE_INFINITY,
									ease: "linear",
								}}
								className="w-8 h-8 border-2 border-cyan-400/50 rounded-full flex items-center justify-center"
							>
								<motion.div
									animate={{ rotate: -360 }}
									transition={{
										duration: 6,
										repeat: Number.POSITIVE_INFINITY,
										ease: "linear",
									}}
								>
									<Zap className="w-4 h-4 text-cyan-400" />
								</motion.div>
							</motion.div>

							<motion.h4
								className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2, duration: 0.5 }}
							>
								{transactionCreated
									? "Transaction Created!"
									: "Create Transaction"}
							</motion.h4>
						</div>

						{transactionCreated && transactionData ? (
							<motion.div
								className="relative z-10 space-y-4"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3, duration: 0.5 }}
							>
								{/* Success Message */}
								<motion.div
									className="text-center p-2 bg-green-500/20 border border-green-500/30 rounded-lg"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
								>
									<div className="text-2xl mb-2">✅</div>
									<h3 className="text-lg font-bold text-green-400 mb-2">
										Transaction Created Successfully!
									</h3>
								</motion.div>

								{/* Claim Link */}
								<motion.div
									className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
								>
									<div className="flex items-center gap-2 ">
										<div className="text-lg">🔗</div>
										<label className="font-medium text-gray-200">
											Claim Link
										</label>
									</div>
									<div className="bg-black/30 p-3 rounded border break-all text-cyan-400 font-mono text-xs">
										{transactionData.claimLink}
									</div>
									<button
										onClick={() =>
											navigator.clipboard.writeText(transactionData.claimLink)
										}
										className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
									>
										Click to copy link
									</button>
								</motion.div>

								{/* Close Button */}
								<motion.div
									className="flex justify-center pt-4"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.8 }}
								>
									<motion.button
										type="button"
										className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-medium shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
										onClick={handleClose}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Done
									</motion.button>
								</motion.div>
							</motion.div>
						) : (
							<motion.form
								className="relative z-10 space-y-2.5"
								onSubmit={handleSubmit}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3, duration: 0.5 }}
							>
								<motion.div
									custom={0}
									variants={formItemVariants}
									initial="hidden"
									animate="visible"
									className="relative"
								>
									<div className="flex items-center gap-2 mb-2">
										<Coins className="w-4 h-4 text-cyan-400" />
										<label className="font-medium text-gray-200">Token</label>
									</div>
									<TokenSelector
										value={token}
										onChange={setToken}
										options={tokenOptions}
									/>
								</motion.div>

								<motion.div
									custom={1}
									variants={formItemVariants}
									initial="hidden"
									animate="visible"
								>
									<div className="flex items-center gap-2 mb-2">
										<Sparkles className="w-4 h-4 text-purple-400" />
										<label className="font-medium text-gray-200">
											Amount per User
										</label>
									</div>
									<AmountInput
										value={amountPerUser}
										onChange={setAmountPerUser}
									/>
								</motion.div>

								<motion.div
									custom={2}
									variants={formItemVariants}
									initial="hidden"
									animate="visible"
								>
									<div className="flex items-center gap-2 mb-2">
										<MessageCircle className="w-4 h-4 text-pink-400" />
										<label className="font-medium text-gray-200">
											Keywords
										</label>
									</div>
									<input
										type="text"
										value={keywords}
										onChange={(e) => setKeywords(e.target.value)}
										className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
										placeholder="e.g. reward, winner, claim"
										required
									/>
									<span className="text-gray-400 text-xs">
										Comma-separated keywords for verification
									</span>
								</motion.div>

								<motion.div
									custom={3}
									variants={formItemVariants}
									initial="hidden"
									animate="visible"
								>
									<div className="flex items-center gap-2 mb-2">
										<Clock className="w-4 h-4 text-yellow-400" />
										<label className="font-medium text-gray-200">
											Expiration
										</label>
									</div>
									<ExpirationSelector
										value={expiration}
										onChange={setExpiration}
										options={expirationOptions}
									/>
								</motion.div>

								<motion.div
									custom={4}
									variants={formItemVariants}
									initial="hidden"
									animate="visible"
								>
									<label className="block mb-2 font-medium text-gray-200">
										Receiver Twitter Handle (optional)
									</label>
									<input
										type="text"
										value={receiver}
										onChange={(e) => setReceiver(e.target.value)}
										className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
										placeholder="@username"
									/>
								</motion.div>

								<motion.div
									custom={4}
									variants={formItemVariants}
									initial="hidden"
									animate="visible"
								>
									<label className="block mb-2 font-medium text-gray-200">
										Max Recipients (optional)
									</label>
									<input
										type="number"
										value={maxRecipients || ""}
										onChange={(e) =>
											setMaxRecipients(
												e.target.value ? Number.parseInt(e.target.value) : null
											)
										}
										className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
										placeholder="e.g. 100"
										min="1"
									/>
									<span className="text-gray-400 text-xs">
										Maximum number of recipients for this transaction
									</span>
								</motion.div>

								<motion.div
									className="flex justify-end space-x-4 pt-4"
									custom={6}
									variants={formItemVariants}
									initial="hidden"
									animate="visible"
								>
									<motion.button
										type="button"
										className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 rounded-lg hover:bg-white/20 transition-all font-medium"
										onClick={handleClose}
										disabled={loading}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Cancel
									</motion.button>

									<motion.button
										type="submit"
										className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-medium shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2 overflow-hidden"
										disabled={loading}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<motion.div
											className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
											initial={false}
										/>
										<span className="relative z-10">
											{loading ? "Creating..." : "Create"}
										</span>
										{!loading && (
											<motion.div
												animate={{ x: [0, 3, 0] }}
												transition={{
													duration: 1.5,
													repeat: Number.POSITIVE_INFINITY,
												}}
												className="relative z-10"
											>
												<ArrowRight className="w-4 h-4" />
											</motion.div>
										)}

										<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-400 blur-xl opacity-20" />
									</motion.button>
								</motion.div>
							</motion.form>
						)}

						<AnimatePresence>
							{loading && (
								<motion.div
									className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									<motion.div
										className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full"
										animate={{ rotate: 360 }}
										transition={{
											duration: 1,
											repeat: Number.POSITIVE_INFINITY,
											ease: "linear",
										}}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default CreateModal;

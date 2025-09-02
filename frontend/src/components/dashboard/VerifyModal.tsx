import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useAuthStore } from "../../store/auth";

interface VerifyModalProps {
	setOpenModal: (value: null) => void;
	isOpen: boolean;
	onVerificationComplete?: (data: {
		tweetUrl: string;
		transactionId: string;
	}) => void;
}

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4000";

const VerifyModal = ({
	setOpenModal,
	isOpen,
	onVerificationComplete,
}: VerifyModalProps) => {
	const { fetchActivity, fetchStats } = useAuthStore();
	const [tweetUrl, setTweetUrl] = useState("");
	const [transactionId, setTransactionId] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Validate inputs
			if (!tweetUrl.trim() || !transactionId.trim()) {
				throw new Error("Please fill in all fields");
			}

			// Validate tweet URL format
			if (!tweetUrl.includes("twitter.com") && !tweetUrl.includes("x.com")) {
				throw new Error("Please enter a valid Twitter/X URL");
			}

			// Call verification API
			const response = await fetch(`${API_URL}/api/verify`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					tweetUrl: tweetUrl.trim(),
					transactionId: transactionId.trim(),
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || data.message || "Verification failed");
			}

			setSuccess(true);

			// Refresh activity data from server
			await fetchActivity();
			await fetchStats();

			// Call parent callback if provided
			if (onVerificationComplete) {
				onVerificationComplete({
					tweetUrl: tweetUrl.trim(),
					transactionId: transactionId.trim(),
				});
			}

			// Close modal after 2 seconds
			setTimeout(() => {
				setOpenModal(null);
				setSuccess(false);
				setTweetUrl("");
				setTransactionId("");
			}, 2000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Verification failed");
			console.log("Verification error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setOpenModal(null);
		setTweetUrl("");
		setTransactionId("");
		setError(null);
		setSuccess(false);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center px-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					onClick={handleClose}
				>
					<motion.div
						className="relative bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl"
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.9, opacity: 0, y: 20 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 25,
							duration: 0.3,
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />

						<div className="relative z-10">
							<motion.h4
								className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4"
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1, duration: 0.3 }}
							>
								Verify Your Tweet
							</motion.h4>

							{success ? (
								<motion.div
									className="text-center py-8"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3 }}
								>
									<CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
									<h3 className="text-green-400 font-bold text-lg mb-2">
										Success!
									</h3>
									<p className="text-gray-300">
										Your tweet has been verified successfully!
									</p>
									<p className="text-gray-400 text-sm mt-2">
										You can now claim your rewards from the transaction page.
									</p>
								</motion.div>
							) : (
								<motion.form
									onSubmit={handleSubmit}
									className="space-y-4"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.2, duration: 0.3 }}
								>
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.25, duration: 0.3 }}
									>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											Tweet URL
										</label>
										<input
											type="url"
											value={tweetUrl}
											onChange={(e) => setTweetUrl(e.target.value)}
											className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
											placeholder="https://twitter.com/username/status/123456789"
											required
										/>
										<p className="text-xs text-gray-400 mt-1">
											Paste the URL of your verification tweet
										</p>
									</motion.div>

									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.3, duration: 0.3 }}
									>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											Transaction ID
										</label>
										<input
											type="text"
											value={transactionId}
											onChange={(e) => setTransactionId(e.target.value)}
											className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
											placeholder="Enter transaction ID"
											required
										/>
										<p className="text-xs text-gray-400 mt-1">
											The transaction ID from your claim
										</p>
									</motion.div>

									{error && (
										<motion.div
											className="bg-red-900/20 border border-red-500/30 rounded-lg p-3"
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
										>
											<div className="flex items-center gap-2">
												<XCircle className="w-5 h-5 text-red-400" />
												<p className="text-red-400 text-sm">{error}</p>
											</div>
										</motion.div>
									)}

									<motion.div
										className="flex justify-end space-x-3 pt-4"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.35, duration: 0.3 }}
									>
										<motion.button
											type="button"
											className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 rounded-lg hover:bg-white/20 transition-all font-medium"
											onClick={handleClose}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											Cancel
										</motion.button>

										<motion.button
											type="submit"
											className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
											disabled={loading}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											{loading ? "Verifying..." : "Verify Tweet"}
										</motion.button>
									</motion.div>
								</motion.form>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default VerifyModal;

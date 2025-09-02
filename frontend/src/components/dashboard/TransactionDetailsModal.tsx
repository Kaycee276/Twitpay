import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag, Activity } from "lucide-react";
import { useAuthStore } from "../../store/auth";
import { formatDate } from "../../utils/formatDate";
import useTransactionDetailsModal from "../../store/transactionDetailsModal";

const TransactionDetailsModal = () => {
	const { isOpen, transactionId, closeModal } = useTransactionDetailsModal();
	const { transactions } = useAuthStore();

	// Find the selected transaction
	const transaction = transactions.find(
		(t, index) => index.toString() === transactionId
	);

	if (!transaction) return null;

	// Function to determine status color based on transaction status
	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "active":
				return "text-green-400";
			case "completed":
				return "text-blue-400";
			case "expired":
				return "text-red-400";
			case "claimed":
				return "text-purple-400";
			case "pending":
				return "text-yellow-400";
			case "cancelled":
				return "text-gray-400";
			case "claiming_enabled":
				return "text-cyan-400";
			default:
				return "text-green-400";
		}
	};

	// Function to get status background color for better visibility
	const getStatusBgColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "active":
				return "bg-green-500/10";
			case "completed":
				return "bg-blue-500/10";
			case "expired":
				return "bg-red-500/10";
			case "claimed":
				return "bg-purple-500/10";
			case "pending":
				return "bg-yellow-500/10";
			case "cancelled":
				return "bg-gray-500/10";
			case "claiming_enabled":
				return "bg-cyan-500/10";
			default:
				return "bg-green-500/10";
		}
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

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4"
					variants={backdropVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					onClick={closeModal}
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

						{/* Header */}
						<div className="relative z-10 flex items-center justify-between mb-4">
							<motion.h4
								className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2, duration: 0.5 }}
							>
								Transaction Details
							</motion.h4>
							<motion.button
								onClick={closeModal}
								className="p-1 rounded-full hover:bg-white/10 transition-colors"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<X className="w-5 h-5 text-gray-400" />
							</motion.button>
						</div>

						{/* Transaction Details */}
						<motion.div
							className="relative z-10 space-y-4"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3, duration: 0.5 }}
						>
							{/* Transaction Type */}
							<motion.div
								className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
							>
								<div className="flex items-center gap-2 mb-2">
									<Tag className="w-4 h-4 text-cyan-400" />
									<label className="font-medium text-gray-200">Type</label>
								</div>
								<p className="text-white font-medium">{transaction.type}</p>
							</motion.div>

							{/* Transaction Date */}
							<motion.div
								className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
							>
								<div className="flex items-center gap-2 mb-2">
									<Calendar className="w-4 h-4 text-purple-400" />
									<label className="font-medium text-gray-200">Date</label>
								</div>
								<p className="text-white font-medium">
									{formatDate(transaction.date)}
								</p>
							</motion.div>

							{/* Transaction Status */}
							<motion.div
								className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6 }}
							>
								<div className="flex items-center gap-2 mb-2">
									<Activity className="w-4 h-4 text-pink-400" />
									<label className="font-medium text-gray-200">Status</label>
								</div>
								<span
									className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
										transaction.status
									)} ${getStatusBgColor(transaction.status)}`}
								>
									{transaction.status}
								</span>
							</motion.div>

							{/* Transaction ID (if available) */}
							{transactionId && (
								<motion.div
									className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.7 }}
								>
									<div className="flex items-center gap-2 mb-2">
										<label className="font-medium text-gray-200">
											Transaction ID
										</label>
									</div>
									<p className="text-cyan-400 font-mono text-xs break-all">
										{transactionId}
									</p>
								</motion.div>
							)}
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
								onClick={closeModal}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Close
							</motion.button>
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default TransactionDetailsModal;

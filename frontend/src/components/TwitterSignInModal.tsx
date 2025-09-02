import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

interface TwitterSignInModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const backdropVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalVariants = {
	hidden: { opacity: 0, scale: 0.95, y: 40 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { type: "spring" as const, stiffness: 200, damping: 20 },
	},
};

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4000";

const TwitterSignInModal: React.FC<TwitterSignInModalProps> = ({
	isOpen,
	onClose,
}) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
					initial="hidden"
					animate="visible"
					exit="hidden"
					variants={backdropVariants}
					onClick={onClose}
				>
					<motion.div
						className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 flex flex-col items-center"
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={modalVariants}
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-700  transition"
							onClick={onClose}
							aria-label="Close"
						>
							<X className="w-6 h-6" />
						</button>
						<div className="flex flex-col items-center gap-4 mt-2">
							<FaXTwitter className="w-20 h-20 text-black  " />
							<h2 className="text-2xl font-bold text-center mb-2">
								Sign in with Twitter
							</h2>
							<p className="text-gray-500  text-center mb-4">
								Connect your Twitter account to continue.
							</p>
							<button
								className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-semibold text-lg shadow transition-all duration-200"
								onClick={() => {
									window.location.href = `${API_URL}/auth/twitter`;
								}}
							>
								<FaXTwitter className="w-5 h-5" />
								Sign in with Twitter
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default TwitterSignInModal;

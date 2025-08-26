import { motion } from "framer-motion";

const LoadingSpinner = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
				className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full"
			/>
		</div>
	);
};

export default LoadingSpinner;

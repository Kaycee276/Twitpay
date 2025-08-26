import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { useAuthStore } from "../../store/auth";

const WelcomeSection = () => {
	const user = useAuthStore((state) => state.user);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className=" text-left md:mb-8 mb-2"
		>
			<div className="flex items-center space-x-4">
				<div className="relative">
					{user?.verified && (
						<div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
							<CheckCircle className="w-4 h-4 text-white" />
						</div>
					)}
				</div>
				<div>
					<h2 className="text-2xl font-bold text-white text-ellipsis">
						Welcome back, {user?.displayName?.split(" ")[0]}!
					</h2>
					<div className="flex items-center space-x-2 text-gray-400">
						<FaXTwitter className="w-4 h-4" />
						<span>@{user?.username}</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default WelcomeSection;

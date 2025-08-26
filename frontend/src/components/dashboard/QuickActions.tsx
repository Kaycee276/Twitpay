import { motion } from "framer-motion";
import { FaXTwitter } from "react-icons/fa6";
import { Zap } from "lucide-react";
import { useState } from "react";
import CreateModal from "./CreateModal";
import VerifyModal from "./VerifyModal";

interface ActionButtonProps {
	icon: React.ComponentType<{ className?: string }>;
	text: string;
	gradient: string;
	onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
	icon: Icon,
	text,
	gradient,
	onClick,
}) => (
	<button
		className={`flex items-center space-x-3 p-4 ${gradient} rounded-xl transition-all duration-200`}
		onClick={onClick}
	>
		<Icon className="w-5 h-5 text-white" />
		<span className="text-white font-medium">{text}</span>
	</button>
);

const QuickActions = () => {
	const [openModal, setOpenModal] = useState<null | "create" | "verify">(null);

	const actions = [
		{
			icon: Zap,
			text: "Create New Transaction",
			gradient:
				"bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-colors duration-300",
			onClick: () => setOpenModal("create"),
		},
		{
			icon: FaXTwitter,
			text: "Verify Tweet",
			gradient:
				"bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-colors duration-300",
			onClick: () => setOpenModal("verify"),
		},
	];

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10"
			>
				<h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{actions.map((action, index) => (
						<ActionButton key={index} {...action} />
					))}
				</div>
			</motion.div>

			{openModal === "create" && (
				<CreateModal
					setOpenModal={setOpenModal}
					isOpen={openModal === "create"}
				/>
			)}
			{openModal === "verify" && (
				<VerifyModal
					setOpenModal={setOpenModal}
					isOpen={openModal === "verify"}
				/>
			)}
		</>
	);
};

export default QuickActions;

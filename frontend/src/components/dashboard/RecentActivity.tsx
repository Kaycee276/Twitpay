import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useAuthStore } from "../../store/auth";
import { formatDate } from "../../utils/formatDate";
import useTransactionDetailsModal from "../../store/transactionDetailsModal";

const RecentActivity = () => {
	const { transactions } = useAuthStore();
	const { openModal } = useTransactionDetailsModal();

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

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.3 }}
			className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
		>
			<h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
			{transactions.length === 0 ? (
				<div className="text-center py-8">
					<AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-400">
						No transactions yet. Start by creating your first transaction!
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{transactions.map((transaction, index) => (
						<div
							key={index}
							className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
							onClick={() => openModal(index.toString())}
						>
							<div className="flex-1">
								<p className="text-white font-medium">{transaction.type}</p>
								<p className="text-gray-400 text-sm">
									{formatDate(transaction.date)}
								</p>
							</div>
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
									transaction.status
								)} ${getStatusBgColor(transaction.status)}`}
							>
								{transaction.status}
							</span>
						</div>
					))}
				</div>
			)}
		</motion.div>
	);
};

export default RecentActivity;

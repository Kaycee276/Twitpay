import { motion } from "framer-motion";
import { Activity, CheckCircle, Shield } from "lucide-react";
import { useAuthStore } from "../../store/auth";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: React.ComponentType<{ className?: string }>;
	iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
	title,
	value,
	icon: Icon,
	iconColor,
}) => (
	<div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
		<div className="flex items-center justify-between">
			<div>
				<p className="text-gray-400 text-sm">{title}</p>
				<p className="text-2xl font-bold text-white">{value}</p>
			</div>
			<Icon className={`w-8 h-8 ${iconColor}`} />
		</div>
	</div>
);

const StatsGrid = () => {
	const { stats } = useAuthStore();

	const statsData = [
		{
			title: "Total Transactions",
			value: stats.totalTransactions.toString(),
			icon: Activity,
			iconColor: "text-cyan-400",
		},
		{
			title: "Verified Claims",
			value: stats.verifiedClaims.toString(),
			icon: CheckCircle,
			iconColor: "text-green-400",
		},
		{
			title: "Active Transactions",
			value: stats.activeTransactions.toString(),
			icon: Shield,
			iconColor: "text-purple-400",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.1 }}
			className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
		>
			{statsData.map((stat, index) => (
				<StatCard key={index} {...stat} />
			))}
		</motion.div>
	);
};

export default StatsGrid;

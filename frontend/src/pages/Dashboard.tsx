import { useEffect } from "react";
import { useAuthStore } from "../store/auth";
import Header from "../components/dashboard/Header";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import StatsGrid from "../components/dashboard/StatsGrid";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import LoadingSpinner from "../components/dashboard/LoadingSpinner";

const Dashboard = () => {
	const { loading, checkAuthStatus, fetchActivity, fetchStats } =
		useAuthStore();

	useEffect(() => {
		const initializeDashboard = async () => {
			await checkAuthStatus();
			await fetchActivity();
			await fetchStats();
		};

		initializeDashboard();
	}, [checkAuthStatus, fetchActivity, fetchStats]);

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			<Header />

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<WelcomeSection />
				<StatsGrid />
				<QuickActions />
				<RecentActivity />
			</div>
		</div>
	);
};

export default Dashboard;

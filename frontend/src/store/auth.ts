import { create } from "zustand";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4000";

export interface UserProfile {
	id: string;
	username: string;
	displayName: string;
	profileImageUrl?: string;
	verified?: boolean;
}

export interface Transaction {
	type: string;
	date: string;
	status: string;
}

export interface UserStats {
	totalTransactions: number;
	verifiedClaims: number;
	activeTransactions: number;
	completedTransactions: number;
}

interface AuthState {
	user: UserProfile | null;
	transactions: Transaction[];
	stats: UserStats;
	loading: boolean;
	isAuthenticated: boolean;

	// Actions
	setUser: (user: UserProfile | null) => void;
	setTransactions: (transactions: Transaction[]) => void;
	setStats: (stats: UserStats) => void;
	setLoading: (loading: boolean) => void;
	setAuthenticated: (authenticated: boolean) => void;
	addTransaction: (transaction: Transaction) => void;

	// Async actions
	checkAuthStatus: () => Promise<void>;
	fetchActivity: () => Promise<void>;
	fetchStats: () => Promise<void>;
	logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	transactions: [],
	stats: {
		totalTransactions: 0,
		verifiedClaims: 0,
		activeTransactions: 0,
		completedTransactions: 0,
	},
	loading: true,
	isAuthenticated: false,

	setUser: (user) => set({ user, isAuthenticated: !!user }),
	setTransactions: (transactions) => set({ transactions }),
	setStats: (stats) => set({ stats }),
	setLoading: (loading) => set({ loading }),
	setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
	addTransaction: (transaction) =>
		set((state) => ({ transactions: [transaction, ...state.transactions] })),

	checkAuthStatus: async () => {
		set({ loading: true });
		try {
			const response = await fetch(`${API_URL}/auth/status`, {
				credentials: "include",
			});

			if (response.ok) {
				const userData = await response.json();
				set({ user: userData, isAuthenticated: true });

				// Fetch user activity (transactions and claims)
				try {
					const activityResponse = await fetch(`${API_URL}/api/activity`, {
						credentials: "include",
					});

					if (activityResponse.ok) {
						const activityData = await activityResponse.json();
						set({ transactions: activityData });
					}
				} catch (activityError) {
					console.error("Failed to fetch activity:", activityError);
				}
			} else {
				set({ user: null, isAuthenticated: false });
				window.location.href = "/";
			}
		} catch (error) {
			console.error("Auth check failed:", error);
			set({ user: null, isAuthenticated: false });
			window.location.href = "/";
		} finally {
			set({ loading: false });
		}
	},

	fetchActivity: async () => {
		try {
			const activityResponse = await fetch(`${API_URL}/api/activity`, {
				credentials: "include",
			});

			if (activityResponse.ok) {
				const activityData = await activityResponse.json();
				set({ transactions: activityData });
			}
		} catch (error) {
			console.error("Failed to fetch activity:", error);
		}
	},

	fetchStats: async () => {
		try {
			const statsResponse = await fetch(`${API_URL}/api/stats`, {
				credentials: "include",
			});

			if (statsResponse.ok) {
				const statsData = await statsResponse.json();
				set({ stats: statsData });
			}
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		}
	},

	logout: async () => {
		try {
			await fetch(`${API_URL}/auth/logout`, {
				method: "POST",
				credentials: "include",
			});
			set({ user: null, isAuthenticated: false, transactions: [] });
			window.location.href = "/";
		} catch (error) {
			console.error("Logout failed:", error);
		}
	},
}));

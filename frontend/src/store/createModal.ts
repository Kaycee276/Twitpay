import { create } from "zustand";

interface CreateModalState {
	// Form states
	token: string;
	amountPerUser: string;
	keywords: string;
	canStopEarly: boolean;
	expiration: number;
	receiver: string;
	maxRecipients: number | null;
	loading: boolean;

	// Actions
	setToken: (token: string) => void;
	setAmountPerUser: (amountPerUser: string) => void;
	setKeywords: (keywords: string) => void;
	setCanStopEarly: (canStopEarly: boolean) => void;
	setExpiration: (expiration: number) => void;
	setReceiver: (receiver: string) => void;
	setMaxRecipients: (maxRecipients: number | null) => void;
	setLoading: (loading: boolean) => void;

	// Reset all states
	resetForm: () => void;
}

const useCreateModalStore = create<CreateModalState>((set) => ({
	// Initial states
	token: "usdc",
	amountPerUser: "0",
	keywords: "",
	canStopEarly: false,
	expiration: 24,
	receiver: "",
	maxRecipients: null,
	loading: false,

	// Action methods
	setToken: (token) => set({ token }),
	setAmountPerUser: (amountPerUser) => set({ amountPerUser }),
	setKeywords: (keywords) => set({ keywords }),
	setCanStopEarly: (canStopEarly: boolean) => set({ canStopEarly }),
	setExpiration: (expiration) => set({ expiration }),
	setReceiver: (receiver) => set({ receiver }),
	setMaxRecipients: (maxRecipients) => set({ maxRecipients }),
	setLoading: (loading) => set({ loading }),

	// Reset method
	resetForm: () =>
		set({
			token: "usdc",
			amountPerUser: "0",
			keywords: "",
			canStopEarly: false,
			expiration: 24,
			receiver: "",
			maxRecipients: null,
			loading: false,
		}),
}));

// Custom hook for easy access
export const useCreateModal = () => {
	const {
		token,
		amountPerUser,
		keywords,
		canStopEarly,
		expiration,
		receiver,
		loading,
		maxRecipients,
		setToken,
		setAmountPerUser,
		setKeywords,
		setCanStopEarly,
		setExpiration,
		setReceiver,
		setLoading,
		setMaxRecipients,
		resetForm,
	} = useCreateModalStore();

	return {
		token,
		amountPerUser,
		keywords,
		canStopEarly,
		expiration,
		receiver,
		loading,
		maxRecipients,
		setToken,
		setAmountPerUser,
		setKeywords,
		setCanStopEarly,
		setExpiration,
		setReceiver,
		setMaxRecipients,
		setLoading,
		resetForm,
	};
};

export default useCreateModalStore;

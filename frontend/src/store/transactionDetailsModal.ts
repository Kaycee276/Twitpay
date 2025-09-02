import { create } from "zustand";

interface TransactionDetailsModalState {
	isOpen: boolean;
	transactionId: string | null;
	openModal: (transactionId: string) => void;
	closeModal: () => void;
}

const useTransactionDetailsModal = create<TransactionDetailsModalState>(
	(set) => ({
		isOpen: false,
		transactionId: null,
		openModal: (transactionId: string) => set({ isOpen: true, transactionId }),
		closeModal: () => set({ isOpen: false, transactionId: null }),
	})
);

export default useTransactionDetailsModal;

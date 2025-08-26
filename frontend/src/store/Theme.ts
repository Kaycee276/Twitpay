import { create } from "zustand";

interface ThemeState {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
}

const useThemeStore = create<ThemeState>((set) => ({
	theme: "light",
	setTheme: (theme) => set({ theme }),
}));

export const useTheme = () => {
	const { theme, setTheme } = useThemeStore();
	return { theme, setTheme };
};

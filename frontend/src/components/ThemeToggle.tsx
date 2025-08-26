import { useTheme } from "../store/Theme";

const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<button onClick={toggleTheme}>
			Switch to {theme === "light" ? "Dark" : "Light"} Mode
		</button>
	);
};

export default ThemeToggle;

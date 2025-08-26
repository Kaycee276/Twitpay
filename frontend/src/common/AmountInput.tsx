import { motion } from "framer-motion";

type AmountInputProps = {
	value: string;
	onChange: (value: string) => void;
};

const AmountInput = ({ value, onChange }: AmountInputProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;

		if (/^[0-9]*\.?[0-9]*$/.test(newValue) || newValue === "") {
			onChange(newValue);
		}
	};

	return (
		<motion.input
			type="text"
			inputMode="decimal"
			value={value}
			onChange={handleChange}
			className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
			placeholder="0.00"
			required
			whileFocus={{ scale: 1.02 }}
		/>
	);
};

export default AmountInput;

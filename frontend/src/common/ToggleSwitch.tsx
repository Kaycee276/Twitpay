import { motion } from "framer-motion";

interface ToggleSwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
	return (
		<div className="inline-flex items-center">
			{/* visually-hidden native checkbox for accessibility */}
			<input
				id="toggle-switch"
				type="checkbox"
				className="sr-only"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				aria-checked={checked}
				aria-label={checked ? "On" : "Off"}
			/>

			{/* visible switch */}
			<label
				htmlFor="toggle-switch"
				className="relative w-10 h-6 rounded-full cursor-pointer select-none"
				role="switch"
				aria-checked={checked}
			>
				{/* track */}
				<span
					className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${
						checked ? "bg-green-500" : "bg-gray-300"
					}`}
				/>

				{/* knob */}
				<motion.span
					layout
					initial={false}
					animate={{ x: checked ? 20 : 6 }}
					transition={{ type: "spring", stiffness: 700, damping: 30 }}
					className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
				/>
			</label>
		</div>
	);
}

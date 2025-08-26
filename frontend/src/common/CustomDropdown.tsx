"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

type Option = {
	label: string;
	value: string | number;
};

type CustomDropdownProps = {
	value: string | number;
	onChange: (value: string | number) => void;
	options: Option[];
	placeholder?: string;
	className?: string;
};

const CustomDropdown = ({
	value,
	onChange,
	options,
	placeholder = "Select option",
	className = "",
}: CustomDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((opt) => opt.value === value);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setFocusedIndex(-1);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isOpen) {
			if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
				e.preventDefault();
				setIsOpen(true);
				setFocusedIndex(0);
			}
			return;
		}

		switch (e.key) {
			case "Escape":
				setIsOpen(false);
				setFocusedIndex(-1);
				break;
			case "ArrowDown":
				e.preventDefault();
				setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
				break;
			case "ArrowUp":
				e.preventDefault();
				setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
				break;
			case "Enter":
			case " ":
				e.preventDefault();
				if (focusedIndex >= 0) {
					onChange(options[focusedIndex].value);
					setIsOpen(false);
					setFocusedIndex(-1);
				}
				break;
		}
	};

	const handleOptionClick = (
		optionValue: string | number,
		e: React.MouseEvent
	) => {
		e.preventDefault();
		e.stopPropagation();
		console.log("Clicked option:", optionValue); // Debug log
		onChange(optionValue);
		setIsOpen(false);
		setFocusedIndex(-1);
	};

	const dropdownVariants = {
		hidden: {
			opacity: 0,
			scale: 0.95,
			y: -10,
		},
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				type: "spring" as const,
				stiffness: 400,
				damping: 25,
				duration: 0.2,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			y: -10,
			transition: {
				duration: 0.15,
			},
		},
	};

	const optionVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: (i: number) => ({
			opacity: 1,
			x: 0,
			transition: {
				delay: i * 0.05,
				duration: 0.2,
			},
		}),
	};

	return (
		<div ref={dropdownRef} className={`relative ${className}`}>
			{/* Trigger Button */}
			<motion.button
				type="button"
				className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all flex items-center justify-between group"
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={handleKeyDown}
				whileFocus={{ scale: 1.02 }}
				whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
			>
				<span className={selectedOption ? "text-white" : "text-gray-400"}>
					{selectedOption ? selectedOption.label : placeholder}
				</span>

				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.2 }}
					className="ml-2"
				>
					<ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
				</motion.div>

				{/* Glow effect on hover */}
				<motion.div
					className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
					initial={false}
				/>
			</motion.button>

			{/* Dropdown Menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-lg shadow-2xl z-50 overflow-hidden"
						variants={dropdownVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						role="listbox"
					>
						{/* Glow effect */}
						<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-lg" />

						<div className="relative z-10 py-2 max-h-60 overflow-y-auto">
							{options.map((option, index) => (
								<motion.button
									key={option.value}
									type="button"
									custom={index}
									variants={optionVariants}
									initial="hidden"
									animate="visible"
									className={`w-full px-4 py-3 text-left hover:bg-white/10 focus:bg-white/10 focus:outline-none transition-all flex items-center justify-between group ${
										focusedIndex === index ? "bg-white/10" : ""
									} ${
										option.value === value ? "text-cyan-400" : "text-gray-200"
									}`}
									onClick={(e) => handleOptionClick(option.value, e)}
									onMouseEnter={() => setFocusedIndex(index)}
									role="option"
									aria-selected={option.value === value}
								>
									<span className="group-hover:text-white transition-colors">
										{option.label}
									</span>

									{option.value === value && (
										<motion.div
											initial={{ scale: 0, rotate: -90 }}
											animate={{ scale: 1, rotate: 0 }}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 25,
											}}
										>
											<Check className="w-4 h-4 text-cyan-400" />
										</motion.div>
									)}

									{/* Hover glow effect */}
									<motion.div
										className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
										initial={false}
									/>
								</motion.button>
							))}
						</div>

						{/* Floating particles in dropdown */}
						{[...Array(3)].map((_, i) => (
							<motion.div
								key={i}
								className="absolute w-1 h-1 bg-cyan-400/50 rounded-full pointer-events-none"
								style={{
									left: `${20 + Math.random() * 60}%`,
									top: `${20 + Math.random() * 60}%`,
								}}
								animate={{
									y: [0, -10, 0],
									opacity: [0.3, 0.8, 0.3],
								}}
								transition={{
									duration: 2 + Math.random(),
									repeat: Number.POSITIVE_INFINITY,
									delay: Math.random() * 2,
								}}
							/>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default CustomDropdown;

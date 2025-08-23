import CustomDropdown from "./CustomDropdown";

type TokenSelectorProps = {
	value: string;
	onChange: (value: string) => void;
	options: { label: string; value: string }[];
};

const TokenSelector = ({ value, onChange, options }: TokenSelectorProps) => {
	const handleChange = (newValue: string | number) => {
		onChange(newValue as string);
	};

	return (
		<CustomDropdown
			value={value}
			onChange={handleChange}
			options={options}
			placeholder="Select token"
		/>
	);
};

export default TokenSelector;

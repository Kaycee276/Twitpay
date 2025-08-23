import CustomDropdown from "./CustomDropdown";

type ExpirationSelectorProps = {
	value: number;
	onChange: (value: number) => void;
	options: { label: string; value: number }[];
};

const ExpirationSelector = ({
	value,
	onChange,
	options,
}: ExpirationSelectorProps) => {
	const handleChange = (newValue: string | number) => {
		onChange(newValue as number);
	};

	return (
		<CustomDropdown
			value={value}
			onChange={handleChange}
			options={options}
			placeholder="Select expiration"
		/>
	);
};

export default ExpirationSelector;

import React from "react";
import { Country } from "country-state-city";

const CountrySelect = ({ label, value, onChange }) => {
	const countries = Country.getAllCountries();

	return (
		<div className="mb-6">
			<label
				htmlFor="country-select"
				className="block text-gray-600 font-medium mb-2"
			>
				{label}
			</label>
			<select
				id="country-select"
				name="country"
				value={value}
				onChange={onChange}
				className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-purple transition-shadow"
			>
				<option value="">Select a country...</option>

				{countries.map((country) => (
					<option key={country.isoCode} value={country.isoCode}>
						{country.name}
					</option>
				))}
			</select>
		</div>
	);
};

export default CountrySelect;

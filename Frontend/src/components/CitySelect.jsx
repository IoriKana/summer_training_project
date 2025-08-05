import React from "react";
import { City } from "country-state-city";

const CitySelect = ({ label, value, onChange, countryCode }) => {
	const cities = City.getCitiesOfCountry(countryCode) || [];
	return (
		<div className="mb-6">
			<label
				htmlFor="city-select"
				className="block text-gray-600 font-medium mb-2"
			>
				{label}
			</label>
			<select
				id="city-select"
				name="city"
				value={value}
				onChange={onChange}
				disabled={!countryCode}
				className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-purple transition-shadow disabled:bg-gray-200"
			>
				<option value="" disabled>
					{countryCode ? "Select a city..." : "Please select a country first"}
				</option>

				{cities.map((city) => (
					<option key={city.name} value={city.name}>
						{city.name}
					</option>
				))}
			</select>
		</div>
	);
};
export default CitySelect;

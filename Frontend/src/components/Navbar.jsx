import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
	// This function will be passed to NavLink to conditionally apply classes
	const getNavLinkClass = ({ isActive }) => {
		// Base classes for all links
		const baseClasses = "py-2 px-3 rounded-md transition-colors duration-300";
		// Classes to add ONLY if the link is active
		const activeClasses = "text-pastel-purple font-semibold";
		// Classes for inactive links
		const inactiveClasses = "text-dark-gray hover:bg-gray-200/50";

		return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
	};

	return (
		// Main navbar container with the "frosted glass" effect
		<nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
			<div className="container mx-auto flex items-center justify-between py-3 px-4">
				<h2 className="font-extrabold">E-Commerce App</h2>

				<ul className="hidden md:flex items-center gap-4 font-medium">
					{/* Each NavLink now uses the function to get its classes */}
					<NavLink to="/home" className={getNavLinkClass}>
						Home
					</NavLink>
					<NavLink to="/users" className={getNavLinkClass}>
						Users
					</NavLink>
					<NavLink to="/about" className={getNavLinkClass}>
						About
					</NavLink>
					<NavLink to="/contact" className={getNavLinkClass}>
						Contact
					</NavLink>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;

import React from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logoUrl from "../assets/logo.svg";

const Navbar = () => {
	const { authToken, logout } = useAuth();
	const navigate = useNavigate();
	const getNavLinkClass = ({ isActive }) => {
		const baseClasses = "py-2 px-3 rounded-md transition-colors duration-300";
		const activeClasses = "text-pastel-purple font-semibold";
		const inactiveClasses = "text-dark-gray hover:bg-gray-200/50";
		return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
			<div className="container mx-auto flex items-center justify-between py-3 px-4">
				<Link to="/">
					<img className="w-15 cursor-pointer" src={logoUrl} alt="Logo" />
				</Link>

				<ul className="hidden md:flex items-center gap-4 font-medium">
					<NavLink to="/about" className={getNavLinkClass}>
						About
					</NavLink>
					<NavLink to="/contact" className={getNavLinkClass}>
						Contact
					</NavLink>

					{authToken ? (
						<>
							<NavLink to="/profile" className={getNavLinkClass}>
								Profile
							</NavLink>
							<button
								onClick={handleLogout}
								className="py-2 px-3 rounded-md text-dark-gray hover:bg-gray-200/50"
							>
								Logout
							</button>
						</>
					) : (
						<NavLink to="/login" className={getNavLinkClass}>
							Login
						</NavLink>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;

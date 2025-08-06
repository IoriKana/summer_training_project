import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logoUrl from "../assets/logo.svg";
import ProfileImageSmall from "./ProfileImageSmall";
import { useCart } from "../hooks/useCart";

const Navbar = () => {
	const { authToken, logout, account } = useAuth();
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

	const { itemCount } = useCart();

	return (
		<nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
			<div className="container mx-auto flex items-center justify-between py-3 px-4">
				<Link to="/">
					<div className="container mx-auto flex items-center  py-3 px-4">
						<img className="w-15 cursor-pointer" src={logoUrl} alt="Logo" />
						<h2 className="font-extrabold font-mono">Aura Cart</h2>
					</div>
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
							<NavLink to="/cart" className={getNavLinkClass}>
								<div className="relative">
									Cart
									{itemCount > 0 && (
										<span className="absolute -top-2 -right-3 bg-pastel-pink text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
											{itemCount}
										</span>
									)}
								</div>
							</NavLink>
							<button
								onClick={handleLogout}
								className="py-2 px-3 rounded-md text-dark-gray hover:bg-gray-200/50"
							>
								Logout
							</button>
							<NavLink to="/profile" className={getNavLinkClass}>
								<ProfileImageSmall image={account?.profile_image_url} />
							</NavLink>
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

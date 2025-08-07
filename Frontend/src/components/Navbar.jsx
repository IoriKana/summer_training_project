import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import logoUrl from "../assets/logo.svg";
import ProfileImageSmall from "./ProfileImageSmall";

const NavLinkItem = ({ to, children }) => {
	const getNavLinkClass = ({ isActive }) => {
		const baseClasses = "py-2 px-3 rounded-md transition-colors duration-300";
		const activeClasses = "text-pastel-purple font-semibold";
		const inactiveClasses = "text-dark-gray hover:bg-gray-200/50";
		return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
	};
	return (
		<NavLink to={to} className={getNavLinkClass}>
			{children}
		</NavLink>
	);
};

const Navbar = () => {
	const { authToken, logout, account } = useAuth();
	const { itemCount } = useCart();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
			<div className="container mx-auto flex items-center justify-between py-3 px-4">
				<Link to="/" className="flex items-center gap-3">
					<img className="w-12" src={logoUrl} alt="Logo" />
					<h2 className="font-extrabold font-mono text-xl text-dark-gray">
						AuraCart
					</h2>
				</Link>

				<ul className="hidden md:flex items-center gap-4 font-medium">
					<NavLinkItem to="/about">About</NavLinkItem>
					<NavLinkItem to="/contact">Contact</NavLinkItem>

					{authToken ? (
						<>
							<NavLinkItem to="/orders">Orders</NavLinkItem>
							<NavLinkItem to="/cart">
								<div className="relative">
									Cart
									{itemCount > 0 && (
										<span className="absolute -top-3 -right-4 bg-pastel-pink text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
											{itemCount}
										</span>
									)}
								</div>
							</NavLinkItem>
							<NavLink to="/profile">
								<ProfileImageSmall image={account?.profile_image_url} />
							</NavLink>
							<button
								onClick={handleLogout}
								className="py-2 px-3 rounded-md text-dark-gray hover:bg-gray-200/50 transition-colors duration-300"
							>
								Logout
							</button>
						</>
					) : (
						<NavLinkItem to="/login">Login</NavLinkItem>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;

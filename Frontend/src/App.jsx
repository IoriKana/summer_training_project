import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Users from './pages/Users';
// import LoginPage from './pages/LoginPage';
// import MyProfile from './pages/MyProfile';
import Navbar from "./components/Navbar";
import Login from "./pages/LoginPage";

function App() {
	return (
		<div className="mx-4 sm:mx-[10%]">
			<Navbar />
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/home" element={<Home />} />;
				{/* <Route path="/users" element={<Users />}/>
        <Route path="/users/:email" element={<Users />}/> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />  */}
			</Routes>
		</div>
	);
}
export default App;

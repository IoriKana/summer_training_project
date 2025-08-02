import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Users from './pages/Users';
import LoginPage from './pages/LoginPage';
// import MyProfile from './pages/MyProfile';
import Navbar from './components/Navbar';



function App() {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />}/>
        <Route path="/users/:email" element={<Users />}/> */}
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} /> */}
      </Routes>
    </div>
  )
}
export default App
